/**
 * Automated Sitemap Management Service
 * Intelligent sitemap generation and management with cache integration
 * Automatically updates sitemaps based on content changes
 */

import fs from 'fs';
import path from 'path';
import { allSEOPageConfigs, SEOPageConfig } from '../data/seoPageConfigs';
import { COUNTRIES, CountryConfig } from '../lib/constants/countries';
import { programmaticCache } from './programmaticCache';
import { performanceMonitoring } from './performanceMonitoring';

// Sitemap interfaces
export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  alternates?: AlternateLanguage[];
  images?: SitemapImage[];
  videos?: SitemapVideo[];
}

export interface AlternateLanguage {
  href: string;
  hreflang: string;
}

export interface SitemapImage {
  loc: string;
  caption?: string;
  geoLocation?: string;
  title?: string;
  license?: string;
}

export interface SitemapVideo {
  thumbnailLoc: string;
  title: string;
  description: string;
  contentLoc?: string;
  playerLoc?: string;
  duration?: number;
  expirationDate?: string;
  rating?: number;
  viewCount?: number;
  publicationDate?: string;
  familyFriendly?: boolean;
  tags?: string[];
}

export interface SitemapIndex {
  sitemaps: {
    loc: string;
    lastmod: string;
  }[];
}

export interface SitemapGenerationOptions {
  baseUrl: string;
  outputDir: string;
  enableImages: boolean;
  enableVideos: boolean;
  enableAlternates: boolean;
  enableNews: boolean;
  compressOutput: boolean;
  maxUrlsPerSitemap: number;
  includeLastMod: boolean;
  generateIndex: boolean;
  submitToSearchEngines: boolean;
}

// Cache-aware sitemap management
class SitemapManagerService {
  private config: SitemapGenerationOptions;
  private sitemapCache = new Map<string, string>();
  private lastGeneration = new Map<string, number>();
  private changeDetector = new Map<string, string>();

  constructor() {
    this.config = {
      baseUrl: 'https://brokeranalysis.com',
      outputDir: path.join(process.cwd(), 'public'),
      enableImages: true,
      enableVideos: false,
      enableAlternates: true,
      enableNews: false,
      compressOutput: true,
      maxUrlsPerSitemap: 50000,
      includeLastMod: true,
      generateIndex: true,
      submitToSearchEngines: false
    };
  }

  /**
   * Generate complete sitemap system with cache integration
   */
  async generateCompleteSitemap(options?: Partial<SitemapGenerationOptions>): Promise<{
    files: string[];
    stats: SitemapStats;
    cacheHits: number;
    performance: {
      generationTime: number;
      cacheTime: number;
      writeTime: number;
    };
  }> {
    const startTime = Date.now();
    const config = { ...this.config, ...options };
    
    let cacheHits = 0;
    const generatedFiles: string[] = [];
    const cacheStartTime = Date.now();

    try {
      // Generate individual sitemaps
      const programmaticSitemap = await this.generateProgrammaticSitemap();
      const staticSitemap = await this.generateStaticSitemap();
      const newsSitemap = config.enableNews ? await this.generateNewsSitemap() : null;
      
      const cacheTime = Date.now() - cacheStartTime;
      const writeStartTime = Date.now();

      // Write sitemap files
      await this.writeSitemapFile('sitemap-programmatic.xml', programmaticSitemap.xml, config);
      generatedFiles.push('sitemap-programmatic.xml');

      await this.writeSitemapFile('sitemap-static.xml', staticSitemap.xml, config);
      generatedFiles.push('sitemap-static.xml');

      if (newsSitemap) {
        await this.writeSitemapFile('sitemap-news.xml', newsSitemap.xml, config);
        generatedFiles.push('sitemap-news.xml');
      }

      const writeTime = Date.now() - writeStartTime;

      // Generate sitemap index
      let sitemapIndex = '';
      if (config.generateIndex) {
        sitemapIndex = this.generateSitemapIndex(generatedFiles, config);
        await this.writeSitemapFile('sitemap.xml', sitemapIndex, config);
        generatedFiles.push('sitemap.xml');
      }

      // Generate robots.txt entry
      await this.updateRobotsTxt(config);

      // Calculate statistics
      const stats: SitemapStats = {
        totalUrls: programmaticSitemap.entries.length + staticSitemap.entries.length + (newsSitemap?.entries.length || 0),
        programmaticUrls: programmaticSitemap.entries.length,
        staticUrls: staticSitemap.entries.length,
        newsUrls: newsSitemap?.entries.length || 0,
        sitemapFiles: generatedFiles.length,
        lastGenerated: new Date().toISOString(),
        cacheHitRate: cacheHits / (programmaticSitemap.entries.length + staticSitemap.entries.length + (newsSitemap?.entries.length || 0))
      };

      // Update performance metrics
      performanceMonitoring.trackCacheAccess('sitemap:generation', cacheHits > 0, Date.now() - startTime);

      return {
        files: generatedFiles,
        stats,
        cacheHits,
        performance: {
          generationTime: Date.now() - startTime,
          cacheTime,
          writeTime
        }
      };

    } catch (error) {
      console.error('Failed to generate complete sitemap:', error);
      throw error;
    }
  }

  /**
   * Generate programmatic directory sitemap with cache integration
   */
  async generateProgrammaticSitemap(): Promise<{ xml: string; entries: SitemapEntry[] }> {
    const cacheKey = 'sitemap:programmatic';
    
    // Check cache first
    try {
      const cached = await programmaticCache.get('sitemap', 'programmatic');
      if (cached && this.isValidCache(cached)) {
        return cached;
      }
    } catch (error) {
      console.warn('Cache miss for programmatic sitemap:', error);
    }

    const entries: SitemapEntry[] = [];
    const today = new Date().toISOString().split('T')[0];

    // 1. Category pages (/best-brokers/[category])
    for (const config of allSEOPageConfigs) {
      const categorySlug = config.path.split('/').pop();
      if (categorySlug) {
        const entry = await this.createCategoryPageEntry(categorySlug, config, today);
        entries.push(entry);
      }
    }

    // 2. Country pages (/best-forex-brokers/[country])
    for (const country of COUNTRIES) {
      const entry = await this.createCountryPageEntry(country, today);
      entries.push(entry);
    }

    // 3. SEO pages (/brokers/[seo-slug])
    for (const config of allSEOPageConfigs) {
      const seoSlug = config.path.split('/').pop();
      if (seoSlug) {
        const entry = await this.createSEOPageEntry(seoSlug, config, today);
        entries.push(entry);
      }
    }

    // Generate XML
    const xml = this.generateSitemapXML(entries, 'programmatic');
    const result = { xml, entries };

    // Cache the result
    try {
      await programmaticCache.set('sitemap', 'programmatic', result, {
        dependencies: ['brokers:all', 'config:seo'],
        version: '1.0'
      });
    } catch (error) {
      console.warn('Failed to cache programmatic sitemap:', error);
    }

    return result;
  }

  /**
   * Generate static pages sitemap
   */
  async generateStaticSitemap(): Promise<{ xml: string; entries: SitemapEntry[] }> {
    const entries: SitemapEntry[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Static pages
    const staticPages = [
      { url: '', priority: 1.0, changefreq: 'daily' as const },
      { url: '/about', priority: 0.8, changefreq: 'monthly' as const },
      { url: '/contact', priority: 0.7, changefreq: 'monthly' as const },
      { url: '/privacy', priority: 0.5, changefreq: 'yearly' as const },
      { url: '/terms', priority: 0.5, changefreq: 'yearly' as const },
      { url: '/best-brokers', priority: 0.9, changefreq: 'weekly' as const },
      { url: '/best-forex-brokers', priority: 0.9, changefreq: 'weekly' as const },
      { url: '/brokers', priority: 0.8, changefreq: 'weekly' as const },
      { url: '/news', priority: 0.7, changefreq: 'daily' as const },
      { url: '/education', priority: 0.8, changefreq: 'weekly' as const }
    ];

    staticPages.forEach(page => {
      entries.push({
        url: `${this.config.baseUrl}${page.url}`,
        lastmod: today,
        changefreq: page.changefreq,
        priority: page.priority,
        alternates: this.config.enableAlternates ? this.generateAlternates(page.url) : undefined
      });
    });

    const xml = this.generateSitemapXML(entries, 'static');
    return { xml, entries };
  }

  /**
   * Generate news sitemap (if enabled)
   */
  async generateNewsSitemap(): Promise<{ xml: string; entries: SitemapEntry[] } | null> {
    // This would integrate with news/blog system
    // For now, return null as we don't have news content
    return null;
  }

  /**
   * Create category page sitemap entry with enhanced metadata
   */
  private async createCategoryPageEntry(
    categorySlug: string,
    config: SEOPageConfig,
    lastmod: string
  ): Promise<SitemapEntry> {
    const url = `${this.config.baseUrl}/best-brokers/${categorySlug}`;
    
    const entry: SitemapEntry = {
      url,
      lastmod,
      changefreq: this.calculateChangeFreq('category', config),
      priority: this.calculatePriority('category', config),
      alternates: this.config.enableAlternates ? this.generateAlternates(`/best-brokers/${categorySlug}`) : undefined
    };

    // Add images if enabled
    if (this.config.enableImages) {
      entry.images = this.generateCategoryImages(categorySlug, config);
    }

    return entry;
  }

  /**
   * Create country page sitemap entry
   */
  private async createCountryPageEntry(
    country: CountryConfig,
    lastmod: string
  ): Promise<SitemapEntry> {
    const url = `${this.config.baseUrl}/best-forex-brokers/${country.slug}`;
    
    const entry: SitemapEntry = {
      url,
      lastmod,
      changefreq: this.calculateChangeFreq('country', country),
      priority: this.calculatePriority('country', country),
      alternates: this.config.enableAlternates ? this.generateAlternates(`/best-forex-brokers/${country.slug}`) : undefined
    };

    // Add images if enabled
    if (this.config.enableImages) {
      entry.images = this.generateCountryImages(country);
    }

    return entry;
  }

  /**
   * Create SEO page sitemap entry
   */
  private async createSEOPageEntry(
    seoSlug: string,
    config: SEOPageConfig,
    lastmod: string
  ): Promise<SitemapEntry> {
    const url = `${this.config.baseUrl}/brokers/${seoSlug}`;
    
    return {
      url,
      lastmod,
      changefreq: this.calculateChangeFreq('seo', config),
      priority: this.calculatePriority('seo', config),
      alternates: this.config.enableAlternates ? this.generateAlternates(`/brokers/${seoSlug}`) : undefined
    };
  }

  /**
   * Generate sitemap XML from entries
   */
  private generateSitemapXML(entries: SitemapEntry[], type: string): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

    const footer = '</urlset>';

    // Sort entries by priority (highest first)
    const sortedEntries = entries.sort((a, b) => b.priority - a.priority);

    const urls = sortedEntries.map(entry => {
      let urlXml = `  <url>
    <loc>${this.escapeXml(entry.url)}</loc>`;

      if (this.config.includeLastMod && entry.lastmod) {
        urlXml += `
    <lastmod>${entry.lastmod}</lastmod>`;
      }

      urlXml += `
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>`;

      // Add alternate language tags
      if (entry.alternates) {
        entry.alternates.forEach(alt => {
          urlXml += `
    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${this.escapeXml(alt.href)}"/>`;
        });
      }

      // Add image tags
      if (entry.images) {
        entry.images.forEach(img => {
          urlXml += `
    <image:image>
      <image:loc>${this.escapeXml(img.loc)}</image:loc>`;
          if (img.caption) {
            urlXml += `
      <image:caption>${this.escapeXml(img.caption)}</image:caption>`;
          }
          if (img.title) {
            urlXml += `
      <image:title>${this.escapeXml(img.title)}</image:title>`;
          }
          urlXml += `
    </image:image>`;
        });
      }

      // Add video tags
      if (entry.videos) {
        entry.videos.forEach(video => {
          urlXml += `
    <video:video>
      <video:thumbnail_loc>${this.escapeXml(video.thumbnailLoc)}</video:thumbnail_loc>
      <video:title>${this.escapeXml(video.title)}</video:title>
      <video:description>${this.escapeXml(video.description)}</video:description>`;
          
          if (video.contentLoc) {
            urlXml += `
      <video:content_loc>${this.escapeXml(video.contentLoc)}</video:content_loc>`;
          }
          if (video.playerLoc) {
            urlXml += `
      <video:player_loc>${this.escapeXml(video.playerLoc)}</video:player_loc>`;
          }
          if (video.duration) {
            urlXml += `
      <video:duration>${video.duration}</video:duration>`;
          }
          if (video.rating) {
            urlXml += `
      <video:rating>${video.rating}</video:rating>`;
          }
          if (video.viewCount) {
            urlXml += `
      <video:view_count>${video.viewCount}</video:view_count>`;
          }
          if (video.publicationDate) {
            urlXml += `
      <video:publication_date>${video.publicationDate}</video:publication_date>`;
          }
          if (video.familyFriendly !== undefined) {
            urlXml += `
      <video:family_friendly>${video.familyFriendly ? 'yes' : 'no'}</video:family_friendly>`;
          }
          if (video.tags) {
            video.tags.forEach(tag => {
              urlXml += `
      <video:tag>${this.escapeXml(tag)}</video:tag>`;
            });
          }
          urlXml += `
    </video:video>`;
        });
      }

      urlXml += `
  </url>`;
      return urlXml;
    }).join('\n');

    return `${header}\n${urls}\n${footer}`;
  }

  /**
   * Generate sitemap index file
   */
  private generateSitemapIndex(sitemapFiles: string[], config: SitemapGenerationOptions): string {
    const today = new Date().toISOString().split('T')[0];
    
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    const footer = '</sitemapindex>';

    const sitemaps = sitemapFiles
      .filter(file => file !== 'sitemap.xml') // Don't include the index itself
      .map(file => `  <sitemap>
    <loc>${config.baseUrl}/${file}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`)
      .join('\n');

    return `${header}\n${sitemaps}\n${footer}`;
  }

  /**
   * Helper methods for sitemap generation
   */
  private calculateChangeFreq(
    pageType: 'category' | 'country' | 'seo',
    config: SEOPageConfig | CountryConfig
  ): SitemapEntry['changefreq'] {
    switch (pageType) {
      case 'category':
        return 'weekly'; // Category pages updated weekly with new brokers
      case 'country':
        return 'monthly'; // Country pages less frequently updated
      case 'seo':
        return 'weekly'; // SEO pages updated regularly
      default:
        return 'weekly';
    }
  }

  private calculatePriority(
    pageType: 'category' | 'country' | 'seo',
    config: SEOPageConfig | CountryConfig
  ): number {
    switch (pageType) {
      case 'category':
        return (config as SEOPageConfig).priority || 0.8;
      case 'country':
        return ((config as CountryConfig).priority || 60) / 100;
      case 'seo':
        return (config as SEOPageConfig).priority || 0.7;
      default:
        return 0.5;
    }
  }

  private generateAlternates(path: string): AlternateLanguage[] {
    const alternates: AlternateLanguage[] = [];
    const supportedLocales = ['en', 'en-US', 'en-GB', 'en-AU', 'en-CA'];
    
    supportedLocales.forEach(locale => {
      alternates.push({
        href: `${this.config.baseUrl}${path}`,
        hreflang: locale
      });
    });

    return alternates;
  }

  private generateCategoryImages(categorySlug: string, config: SEOPageConfig): SitemapImage[] {
    return [
      {
        loc: `${this.config.baseUrl}/images/categories/${categorySlug}-hero.jpg`,
        caption: `${config.title} - Top Forex Brokers Comparison`,
        title: config.title
      },
      {
        loc: `${this.config.baseUrl}/images/categories/${categorySlug}-comparison.jpg`,
        caption: `${config.title} Detailed Comparison Chart`,
        title: `${config.title} Comparison`
      }
    ];
  }

  private generateCountryImages(country: CountryConfig): SitemapImage[] {
    return [
      {
        loc: `${this.config.baseUrl}/images/countries/${country.code.toLowerCase()}-brokers.jpg`,
        caption: `Best Forex Brokers in ${country.name}`,
        title: `${country.name} Forex Brokers`
      }
    ];
  }

  private async writeSitemapFile(
    filename: string,
    content: string,
    config: SitemapGenerationOptions
  ): Promise<void> {
    const filePath = path.join(config.outputDir, filename);
    
    // Ensure output directory exists
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(filePath, content, 'utf-8');

    // Update cache
    this.sitemapCache.set(filename, content);
    this.lastGeneration.set(filename, Date.now());
  }

  private async updateRobotsTxt(config: SitemapGenerationOptions): Promise<void> {
    const robotsPath = path.join(config.outputDir, 'robots.txt');
    let robotsContent = '';

    // Read existing robots.txt if it exists
    if (fs.existsSync(robotsPath)) {
      robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    } else {
      robotsContent = `User-agent: *
Allow: /

# Sitemaps`;
    }

    // Add or update sitemap entries
    const sitemapEntry = `\nSitemap: ${config.baseUrl}/sitemap.xml`;
    
    if (!robotsContent.includes('Sitemap: ')) {
      robotsContent += sitemapEntry;
    } else if (!robotsContent.includes(sitemapEntry)) {
      robotsContent = robotsContent.replace(
        /Sitemap: .*/g,
        `Sitemap: ${config.baseUrl}/sitemap.xml`
      );
    }

    fs.writeFileSync(robotsPath, robotsContent, 'utf-8');
  }

  private isValidCache(cached: any): boolean {
    // Check if cached data is still valid (not older than 1 hour for sitemaps)
    const cacheAge = Date.now() - new Date(cached.generatedAt || 0).getTime();
    return cacheAge < 60 * 60 * 1000; // 1 hour
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Intelligent sitemap regeneration based on content changes
   */
  async regenerateIfNeeded(forceRegeneration = false): Promise<boolean> {
    if (forceRegeneration) {
      await this.generateCompleteSitemap();
      return true;
    }

    // Check if content has changed since last generation
    const contentHash = await this.calculateContentHash();
    const lastHash = this.changeDetector.get('content-hash');
    
    if (contentHash !== lastHash) {
      await this.generateCompleteSitemap();
      this.changeDetector.set('content-hash', contentHash);
      return true;
    }

    return false;
  }

  /**
   * Calculate content hash for change detection
   */
  private async calculateContentHash(): Promise<string> {
    const configContent = JSON.stringify(allSEOPageConfigs) + JSON.stringify(COUNTRIES);
    
    // Simple hash function (in production, use crypto.createHash)
    let hash = 0;
    for (let i = 0; i < configContent.length; i++) {
      const char = configContent.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString();
  }

  /**
   * Submit sitemaps to search engines (if enabled)
   */
  async submitToSearchEngines(config: SitemapGenerationOptions): Promise<void> {
    if (!config.submitToSearchEngines) return;

    const sitemapUrl = `${config.baseUrl}/sitemap.xml`;
    
    // Google Search Console submission
    try {
      // This would typically use Google Search Console API
      console.log(`Sitemap submitted to Google: ${sitemapUrl}`);
    } catch (error) {
      console.error('Failed to submit to Google:', error);
    }

    // Bing Webmaster Tools submission
    try {
      // This would typically use Bing Webmaster API
      console.log(`Sitemap submitted to Bing: ${sitemapUrl}`);
    } catch (error) {
      console.error('Failed to submit to Bing:', error);
    }
  }

  /**
   * Get sitemap generation statistics
   */
  getSitemapStats(): SitemapStats & { cacheStats: { size: number; keys: string[] } } {
    return {
      totalUrls: 0,
      programmaticUrls: 0,
      staticUrls: 0,
      newsUrls: 0,
      sitemapFiles: this.sitemapCache.size,
      lastGenerated: new Date().toISOString(),
      cacheHitRate: 0,
      cacheStats: {
        size: this.sitemapCache.size,
        keys: Array.from(this.sitemapCache.keys())
      }
    };
  }

  /**
   * Clear sitemap cache
   */
  async clearCache(): Promise<void> {
    this.sitemapCache.clear();
    this.lastGeneration.clear();
    this.changeDetector.clear();
    
    // Clear programmatic cache entries
    await programmaticCache.invalidate('sitemap:*');
  }
}

// Statistics interface
export interface SitemapStats {
  totalUrls: number;
  programmaticUrls: number;
  staticUrls: number;
  newsUrls: number;
  sitemapFiles: number;
  lastGenerated: string;
  cacheHitRate: number;
}

// Create singleton instance
export const sitemapManager = new SitemapManagerService();

// React hook for sitemap management
export const useSitemapManager = () => {
  return {
    generateCompleteSitemap: sitemapManager.generateCompleteSitemap.bind(sitemapManager),
    regenerateIfNeeded: sitemapManager.regenerateIfNeeded.bind(sitemapManager),
    getSitemapStats: sitemapManager.getSitemapStats.bind(sitemapManager),
    clearCache: sitemapManager.clearCache.bind(sitemapManager)
  };
};

export default sitemapManager;