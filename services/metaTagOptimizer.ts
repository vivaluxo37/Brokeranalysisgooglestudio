/**
 * Dynamic Meta Tag Optimization System
 * Generates and optimizes meta tags for programmatic directory pages
 * Integrates with caching system and performance monitoring
 */

import { Broker } from '../types';
import { SEOPageConfig } from '../data/seoPageConfigs';
import { CountryConfig } from '../lib/constants/countries';
import { programmaticCache } from './programmaticCache';
import { performanceMonitoring } from './performanceMonitoring';

// Meta tag interfaces
export interface MetaTagData {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  robots: string;
  og: OpenGraphData;
  twitter: TwitterCardData;
  alternateLanguages?: AlternateLanguage[];
  customMeta?: CustomMetaTag[];
}

export interface OpenGraphData {
  title: string;
  description: string;
  type: 'website' | 'article' | 'product';
  url: string;
  image: string;
  imageAlt: string;
  siteName: string;
  locale: string;
  alternateLocales?: string[];
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site: string;
  creator: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface AlternateLanguage {
  hreflang: string;
  href: string;
}

export interface CustomMetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}

export interface SEOMetrics {
  titleLength: number;
  descriptionLength: number;
  keywordDensity: number;
  readabilityScore: number;
  mobileFriendly: boolean;
  socialOptimized: boolean;
}

// Configuration for meta tag optimization
interface MetaOptimizationConfig {
  baseUrl: string;
  siteName: string;
  defaultAuthor: string;
  socialHandles: {
    twitter: string;
    facebook: string;
    linkedin: string;
  };
  defaultImage: string;
  titleLimits: {
    min: number;
    max: number;
    optimal: number;
  };
  descriptionLimits: {
    min: number;
    max: number;
    optimal: number;
  };
  keywordLimits: {
    primary: number;
    secondary: number;
    total: number;
  };
}

class MetaTagOptimizerService {
  private config: MetaOptimizationConfig;
  private metaCache = new Map<string, MetaTagData>();
  private performanceMetrics = new Map<string, SEOMetrics>();

  constructor() {
    this.config = {
      baseUrl: 'https://brokeranalysis.com',
      siteName: 'Broker Analysis',
      defaultAuthor: 'Broker Analysis Editorial Team',
      socialHandles: {
        twitter: '@brokeranalysis',
        facebook: 'brokeranalysis',
        linkedin: 'company/brokeranalysis'
      },
      defaultImage: 'https://brokeranalysis.com/images/og-default.jpg',
      titleLimits: {
        min: 30,
        max: 60,
        optimal: 55
      },
      descriptionLimits: {
        min: 120,
        max: 160,
        optimal: 155
      },
      keywordLimits: {
        primary: 3,
        secondary: 5,
        total: 10
      }
    };
  }

  /**
   * Generate optimized meta tags for programmatic pages
   */
  async generateOptimizedMetaTags(
    pageType: 'category' | 'country' | 'seo',
    pageSlug: string,
    brokers: Broker[],
    config: SEOPageConfig | CountryConfig,
    additionalContext?: any
  ): Promise<MetaTagData> {
    const cacheKey = `meta:${pageType}:${pageSlug}`;
    const startTime = Date.now();

    // Try cache first
    try {
      const cached = await programmaticCache.get('meta-tags', pageSlug);
      if (cached) {
        performanceMonitoring.trackCacheAccess(cacheKey, true, Date.now() - startTime);
        return cached;
      }
    } catch (error) {
      console.warn('Failed to get meta tags from cache:', error);
    }

    // Generate new meta tags
    const metaTags = await this.createMetaTags(pageType, pageSlug, brokers, config, additionalContext);
    
    // Optimize meta tags
    const optimizedMetaTags = this.optimizeMetaTags(metaTags, pageType, brokers);
    
    // Calculate SEO metrics
    const seoMetrics = this.calculateSEOMetrics(optimizedMetaTags, pageType, brokers.length);
    this.performanceMetrics.set(cacheKey, seoMetrics);

    // Cache the results
    try {
      await programmaticCache.set('meta-tags', pageSlug, optimizedMetaTags, {
        dependencies: [`brokers:all`],
        version: '1.0'
      });
    } catch (error) {
      console.warn('Failed to cache meta tags:', error);
    }

    performanceMonitoring.trackCacheAccess(cacheKey, false, Date.now() - startTime);
    return optimizedMetaTags;
  }

  /**
   * Create base meta tags for different page types
   */
  private async createMetaTags(
    pageType: 'category' | 'country' | 'seo',
    pageSlug: string,
    brokers: Broker[],
    config: SEOPageConfig | CountryConfig,
    additionalContext?: any
  ): Promise<MetaTagData> {
    const pageUrl = `${this.config.baseUrl}/${this.getPagePath(pageType, pageSlug)}`;
    
    switch (pageType) {
      case 'category':
        return this.createCategoryMetaTags(pageSlug, config as SEOPageConfig, brokers, pageUrl);
      case 'country':
        return this.createCountryMetaTags(pageSlug, config as CountryConfig, brokers, pageUrl);
      case 'seo':
        return this.createSEOMetaTags(pageSlug, config as SEOPageConfig, brokers, pageUrl);
      default:
        throw new Error(`Unknown page type: ${pageType}`);
    }
  }

  /**
   * Create meta tags for category pages
   */
  private createCategoryMetaTags(
    pageSlug: string,
    config: SEOPageConfig,
    brokers: Broker[],
    pageUrl: string
  ): MetaTagData {
    const brokerCount = brokers.length;
    const topBrokers = brokers.slice(0, 3).map(b => b.name);
    
    // Dynamic title generation
    const title = this.optimizeTitle(
      `${config.title} (${brokerCount} Brokers) - Compare ${new Date().getFullYear()}`,
      config.title
    );

    // Dynamic description with broker names and key features
    const description = this.optimizeDescription(
      `Compare ${brokerCount} ${config.title.toLowerCase()} including ${topBrokers.join(', ')}. ` +
      `${config.highlights.slice(0, 2).join(', ')}. Updated ${new Date().getFullYear()}.`
    );

    // Generate keywords from config and broker data
    const keywords = this.generateKeywords([
      ...config.highlights,
      'forex broker',
      'online trading',
      'currency trading',
      ...topBrokers.map(name => name.toLowerCase()),
      pageSlug.replace(/-/g, ' ')
    ]);

    return {
      title,
      description,
      keywords,
      canonical: pageUrl,
      robots: 'index, follow',
      og: {
        title: title,
        description: description,
        type: 'website',
        url: pageUrl,
        image: this.generateCategoryImage(config, brokers),
        imageAlt: `${config.title} - Top Forex Brokers Comparison`,
        siteName: this.config.siteName,
        locale: 'en_US'
      },
      twitter: {
        card: 'summary_large_image',
        site: this.config.socialHandles.twitter,
        creator: this.config.socialHandles.twitter,
        title: this.truncateForTwitter(title),
        description: this.truncateForTwitter(description),
        image: this.generateCategoryImage(config, brokers),
        imageAlt: `${config.title} comparison chart`
      },
      customMeta: [
        { name: 'author', content: this.config.defaultAuthor },
        { name: 'category', content: 'Forex Trading' },
        { name: 'broker-count', content: brokerCount.toString() },
        { name: 'last-updated', content: new Date().toISOString().split('T')[0] }
      ]
    };
  }

  /**
   * Create meta tags for country pages
   */
  private createCountryMetaTags(
    pageSlug: string,
    config: CountryConfig,
    brokers: Broker[],
    pageUrl: string
  ): MetaTagData {
    const brokerCount = brokers.length;
    const topBrokers = brokers.slice(0, 3).map(b => b.name);
    const countryName = config.name;

    // Generate country-specific title
    const title = this.optimizeTitle(
      `Best Forex Brokers in ${countryName} ${new Date().getFullYear()} (${brokerCount} Regulated)`,
      `${countryName} forex brokers`
    );

    // Country-specific description
    const description = this.optimizeDescription(
      `Top ${brokerCount} regulated forex brokers in ${countryName}: ${topBrokers.join(', ')}. ` +
      `Compare spreads, platforms, and regulations for ${countryName} traders.`
    );

    // Country-specific keywords
    const keywords = this.generateKeywords([
      `${countryName.toLowerCase()} forex brokers`,
      `forex trading ${countryName.toLowerCase()}`,
      'regulated brokers',
      'currency trading',
      ...topBrokers.map(name => name.toLowerCase()),
      config.code.toLowerCase()
    ]);

    return {
      title,
      description,
      keywords,
      canonical: pageUrl,
      robots: 'index, follow',
      og: {
        title: title,
        description: description,
        type: 'website',
        url: pageUrl,
        image: this.generateCountryImage(config, brokers),
        imageAlt: `Best Forex Brokers in ${countryName}`,
        siteName: this.config.siteName,
        locale: 'en_US'
      },
      twitter: {
        card: 'summary_large_image',
        site: this.config.socialHandles.twitter,
        creator: this.config.socialHandles.twitter,
        title: this.truncateForTwitter(title),
        description: this.truncateForTwitter(description),
        image: this.generateCountryImage(config, brokers),
        imageAlt: `${countryName} forex brokers chart`
      },
      customMeta: [
        { name: 'author', content: this.config.defaultAuthor },
        { name: 'geo.region', content: config.code },
        { name: 'geo.country', content: config.code },
        { name: 'broker-count', content: brokerCount.toString() },
        { name: 'country', content: countryName }
      ]
    };
  }

  /**
   * Create meta tags for SEO pages
   */
  private createSEOMetaTags(
    pageSlug: string,
    config: SEOPageConfig,
    brokers: Broker[],
    pageUrl: string
  ): MetaTagData {
    const brokerCount = brokers.length;
    const topBrokers = brokers.slice(0, 3).map(b => b.name);

    const title = this.optimizeTitle(config.title, pageSlug.replace(/-/g, ' '));
    const description = this.optimizeDescription(
      brokerCount > 0 
        ? `${config.description} Compare ${topBrokers.join(', ')} and ${brokerCount - 3} more brokers.`
        : config.description
    );

    const keywords = this.generateKeywords([
      ...config.highlights,
      'forex',
      'trading',
      'brokers',
      pageSlug.replace(/-/g, ' ')
    ]);

    return {
      title,
      description,
      keywords,
      canonical: pageUrl,
      robots: 'index, follow',
      og: {
        title: title,
        description: description,
        type: 'article',
        url: pageUrl,
        image: this.generateSEOImage(config, brokers),
        imageAlt: config.title,
        siteName: this.config.siteName,
        locale: 'en_US'
      },
      twitter: {
        card: 'summary_large_image',
        site: this.config.socialHandles.twitter,
        creator: this.config.socialHandles.twitter,
        title: this.truncateForTwitter(title),
        description: this.truncateForTwitter(description),
        image: this.generateSEOImage(config, brokers),
        imageAlt: config.title
      },
      customMeta: [
        { name: 'author', content: this.config.defaultAuthor },
        { name: 'article:section', content: 'Forex Trading' },
        { name: 'broker-count', content: brokerCount.toString() }
      ]
    };
  }

  /**
   * Optimize meta tags for better SEO performance
   */
  private optimizeMetaTags(metaTags: MetaTagData, pageType: string, brokers: Broker[]): MetaTagData {
    return {
      ...metaTags,
      title: this.optimizeTitle(metaTags.title),
      description: this.optimizeDescription(metaTags.description),
      keywords: this.optimizeKeywords(metaTags.keywords, metaTags.title, metaTags.description),
      og: {
        ...metaTags.og,
        title: this.optimizeTitle(metaTags.og.title),
        description: this.optimizeDescription(metaTags.og.description)
      },
      twitter: {
        ...metaTags.twitter,
        title: this.truncateForTwitter(metaTags.twitter.title),
        description: this.truncateForTwitter(metaTags.twitter.description)
      }
    };
  }

  /**
   * Optimize title length and structure
   */
  private optimizeTitle(title: string, fallbackKeyword?: string): string {
    let optimizedTitle = title;

    // Ensure title is within optimal length
    if (title.length > this.config.titleLimits.max) {
      // Truncate while preserving important parts
      const parts = title.split(' - ');
      if (parts.length > 1) {
        // Keep the main part and truncate the secondary part
        optimizedTitle = parts[0];
        if (optimizedTitle.length < this.config.titleLimits.optimal) {
          const remaining = this.config.titleLimits.optimal - optimizedTitle.length - 3;
          optimizedTitle += ' - ' + parts[1].substring(0, remaining);
        }
      } else {
        optimizedTitle = title.substring(0, this.config.titleLimits.optimal - 3) + '...';
      }
    }

    // Ensure minimum length
    if (optimizedTitle.length < this.config.titleLimits.min && fallbackKeyword) {
      optimizedTitle += ` | ${fallbackKeyword}`;
    }

    return optimizedTitle;
  }

  /**
   * Optimize description length and content
   */
  private optimizeDescription(description: string): string {
    let optimized = description;

    // Remove extra whitespace
    optimized = optimized.replace(/\s+/g, ' ').trim();

    // Truncate if too long
    if (optimized.length > this.config.descriptionLimits.max) {
      // Find the last complete sentence within the limit
      const truncated = optimized.substring(0, this.config.descriptionLimits.optimal);
      const lastPeriod = truncated.lastIndexOf('.');
      const lastComma = truncated.lastIndexOf(',');
      
      const cutoff = lastPeriod > lastComma && lastPeriod > 50 ? lastPeriod + 1 : 
                    lastComma > 50 ? lastComma : this.config.descriptionLimits.optimal;
      
      optimized = optimized.substring(0, cutoff).trim();
      
      // Ensure it doesn't end mid-word
      if (!optimized.endsWith('.') && !optimized.endsWith(',')) {
        optimized = optimized.substring(0, optimized.lastIndexOf(' ')) + '...';
      }
    }

    return optimized;
  }

  /**
   * Generate and optimize keywords
   */
  private generateKeywords(baseKeywords: string[]): string[] {
    // Remove duplicates and empty strings
    const unique = [...new Set(baseKeywords.filter(k => k && k.trim().length > 0))];
    
    // Sort by relevance (shorter phrases first, then alphabetically)
    const sorted = unique.sort((a, b) => {
      const aWords = a.split(' ').length;
      const bWords = b.split(' ').length;
      if (aWords !== bWords) return aWords - bWords;
      return a.localeCompare(b);
    });

    return sorted.slice(0, this.config.keywordLimits.total);
  }

  /**
   * Optimize keywords based on title and description content
   */
  private optimizeKeywords(keywords: string[], title: string, description: string): string[] {
    const titleWords = title.toLowerCase().split(/\s+/);
    const descWords = description.toLowerCase().split(/\s+/);
    const content = [...titleWords, ...descWords];

    // Score keywords by presence in title/description
    const scoredKeywords = keywords.map(keyword => {
      const keywordWords = keyword.toLowerCase().split(/\s+/);
      const score = keywordWords.reduce((acc, word) => {
        const titleMatches = titleWords.filter(w => w.includes(word)).length;
        const descMatches = descWords.filter(w => w.includes(word)).length;
        return acc + (titleMatches * 3) + (descMatches * 1);
      }, 0);
      
      return { keyword, score };
    });

    // Sort by score and return top keywords
    return scoredKeywords
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config.keywordLimits.total)
      .map(item => item.keyword);
  }

  /**
   * Calculate SEO metrics for performance tracking
   */
  private calculateSEOMetrics(metaTags: MetaTagData, pageType: string, brokerCount: number): SEOMetrics {
    const titleLength = metaTags.title.length;
    const descriptionLength = metaTags.description.length;
    
    // Calculate keyword density (simplified)
    const titleWords = metaTags.title.toLowerCase().split(/\s+/).length;
    const keywordDensity = metaTags.keywords.length / titleWords;
    
    // Simple readability score based on sentence length and structure
    const sentences = metaTags.description.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(/\s+/).length, 0) / sentences.length;
    const readabilityScore = Math.max(0, Math.min(100, 100 - (avgSentenceLength - 15) * 2));

    return {
      titleLength,
      descriptionLength,
      keywordDensity,
      readabilityScore,
      mobileFriendly: titleLength <= 55 && descriptionLength <= 155,
      socialOptimized: !!metaTags.og.image && !!metaTags.twitter.image
    };
  }

  /**
   * Helper methods for generating dynamic images
   */
  private generateCategoryImage(config: SEOPageConfig, brokers: Broker[]): string {
    // In a real implementation, this would generate or select appropriate images
    return `${this.config.baseUrl}/images/categories/${config.path.split('/').pop()}-og.jpg`;
  }

  private generateCountryImage(config: CountryConfig, brokers: Broker[]): string {
    return `${this.config.baseUrl}/images/countries/${config.code.toLowerCase()}-brokers-og.jpg`;
  }

  private generateSEOImage(config: SEOPageConfig, brokers: Broker[]): string {
    return `${this.config.baseUrl}/images/seo/${config.path.split('/').pop()}-og.jpg`;
  }

  private truncateForTwitter(text: string): string {
    const limit = 70; // Twitter's recommended title length
    return text.length > limit ? text.substring(0, limit - 3) + '...' : text;
  }

  private getPagePath(pageType: string, pageSlug: string): string {
    switch (pageType) {
      case 'category':
        return `best-brokers/${pageSlug}`;
      case 'country':
        return `best-forex-brokers/${pageSlug}`;
      case 'seo':
        return `brokers/${pageSlug}`;
      default:
        return pageSlug;
    }
  }

  /**
   * Generate HTML meta tags
   */
  generateHTMLMetaTags(metaTags: MetaTagData): string {
    const tags: string[] = [];

    // Basic meta tags
    tags.push(`<title>${this.escapeHTML(metaTags.title)}</title>`);
    tags.push(`<meta name="description" content="${this.escapeHTML(metaTags.description)}">`);
    tags.push(`<meta name="keywords" content="${this.escapeHTML(metaTags.keywords.join(', '))}">`);
    tags.push(`<meta name="robots" content="${metaTags.robots}">`);
    tags.push(`<link rel="canonical" href="${metaTags.canonical}">`);

    // Open Graph tags
    tags.push(`<meta property="og:title" content="${this.escapeHTML(metaTags.og.title)}">`);
    tags.push(`<meta property="og:description" content="${this.escapeHTML(metaTags.og.description)}">`);
    tags.push(`<meta property="og:type" content="${metaTags.og.type}">`);
    tags.push(`<meta property="og:url" content="${metaTags.og.url}">`);
    tags.push(`<meta property="og:image" content="${metaTags.og.image}">`);
    tags.push(`<meta property="og:image:alt" content="${this.escapeHTML(metaTags.og.imageAlt)}">`);
    tags.push(`<meta property="og:site_name" content="${this.escapeHTML(metaTags.og.siteName)}">`);
    tags.push(`<meta property="og:locale" content="${metaTags.og.locale}">`);

    // Twitter Card tags
    tags.push(`<meta name="twitter:card" content="${metaTags.twitter.card}">`);
    tags.push(`<meta name="twitter:site" content="${metaTags.twitter.site}">`);
    tags.push(`<meta name="twitter:creator" content="${metaTags.twitter.creator}">`);
    tags.push(`<meta name="twitter:title" content="${this.escapeHTML(metaTags.twitter.title)}">`);
    tags.push(`<meta name="twitter:description" content="${this.escapeHTML(metaTags.twitter.description)}">`);
    tags.push(`<meta name="twitter:image" content="${metaTags.twitter.image}">`);
    tags.push(`<meta name="twitter:image:alt" content="${this.escapeHTML(metaTags.twitter.imageAlt)}">`);

    // Custom meta tags
    metaTags.customMeta?.forEach(meta => {
      if (meta.name) {
        tags.push(`<meta name="${meta.name}" content="${this.escapeHTML(meta.content)}">`);
      } else if (meta.property) {
        tags.push(`<meta property="${meta.property}" content="${this.escapeHTML(meta.content)}">`);
      } else if (meta.httpEquiv) {
        tags.push(`<meta http-equiv="${meta.httpEquiv}" content="${this.escapeHTML(meta.content)}">`);
      }
    });

    return tags.join('\n');
  }

  private escapeHTML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Get SEO performance metrics
   */
  getSEOMetrics(pageKey: string): SEOMetrics | null {
    return this.performanceMetrics.get(pageKey) || null;
  }

  /**
   * Clear meta tag cache
   */
  async clearCache(pattern?: string): Promise<void> {
    if (pattern) {
      await programmaticCache.invalidate(`meta-tags:${pattern}`);
    } else {
      await programmaticCache.invalidate('meta-tags:*');
    }
    this.metaCache.clear();
    this.performanceMetrics.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[]; metrics: number } {
    return {
      size: this.metaCache.size,
      keys: Array.from(this.metaCache.keys()),
      metrics: this.performanceMetrics.size
    };
  }
}

// Create singleton instance
export const metaTagOptimizer = new MetaTagOptimizerService();

// React hook for meta tag optimization
export const useMetaTagOptimizer = () => {
  return {
    generateOptimizedMetaTags: metaTagOptimizer.generateOptimizedMetaTags.bind(metaTagOptimizer),
    generateHTMLMetaTags: metaTagOptimizer.generateHTMLMetaTags.bind(metaTagOptimizer),
    getSEOMetrics: metaTagOptimizer.getSEOMetrics.bind(metaTagOptimizer),
    clearCache: metaTagOptimizer.clearCache.bind(metaTagOptimizer),
    getCacheStats: metaTagOptimizer.getCacheStats.bind(metaTagOptimizer)
  };
};

export default metaTagOptimizer;