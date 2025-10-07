/**
 * Page Data Service
 * 
 * This service orchestrates data fetching for programmatic SEO pages. It combines
 * broker data, AI-generated content, and cached results to provide comprehensive
 * page data for all programmatic page types.
 */

import { createClient } from '@supabase/supabase-js';
import { PageDetectionResult } from '../../lib/programmatic/pageTypeDetector';
import { aiContentGenerator } from '../content/AIContentGenerator';
import type { ContentGenerationRequest } from '../content/AIContentGenerator';
import { contentCache } from '../cache/contentCache';
import { unifiedBrokerService } from '../unifiedBrokerService';

// Types
interface PageData {
  title: string;
  description: string;
  content: string;
  meta: {
    keywords: string[];
    structuredData: Record<string, any>;
    canonical: string;
    robots: string;
  };
  brokers: any[];
  faqs?: Array<{ question: string; answer: string }>;
  comparison?: Array<{ feature: string; value: string }>;
  breadcrumbs: Array<{ label: string; href?: string }>;
  relatedPages: Array<{ title: string; href: string }>;
  analytics: {
    pageType: string;
    category?: string;
    country?: string;
    generatedAt: string;
    contentQuality: number;
  };
}

interface BrokerFilter {
  category?: string;
  country?: string;
  features?: string[];
  regulation?: string[];
  minDeposit?: number;
  maxLeverage?: number;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

/**
 * Page Data Service
 */
export class PageDataService {
  /**
   * Get comprehensive page data for a programmatic page
   */
  async getPageData(pageDetection: PageDetectionResult): Promise<PageData> {
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(pageDetection);
      const cachedData = await contentCache.get<PageData>(cacheKey);
      
      if (cachedData) {
        return cachedData.content;
      }

      // Generate page data
      const pageData = await this.generatePageData(pageDetection);

      // Cache the result
      await contentCache.set(cacheKey, pageData, {
        ttl: 24 * 60 * 60 * 1000, // 24 hours
        tags: this.generateCacheTags(pageDetection)
      });

      return pageData;

    } catch (error) {
      console.error('Error getting page data:', error);
      throw new Error(`Failed to get page data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate page data based on page detection
   */
  private async generatePageData(pageDetection: PageDetectionResult): Promise<PageData> {
    const { type, params, metadata } = pageDetection;

    switch (type) {
      case 'category':
        return this.generateCategoryPageData(params.categorySlug as string, metadata);
      
      case 'country':
        return this.generateCountryPageData(params.countryCode as string, params.countryName as string, metadata);
      
      case 'category-country':
        return this.generateCategoryCountryPageData(
          params.categorySlug as string,
          params.countryCode as string,
          params.countryName as string,
          metadata
        );
      
      case 'strategy':
        return this.generateStrategyPageData(params.strategySlug as string, metadata);
      
      case 'feature':
        return this.generateFeaturePageData(params.featureSlug as string, metadata);
      
      case 'broker':
        return this.generateBrokerPageData(params.brokerSlug as string, metadata);
      
      case 'home':
        return this.generateHomePageData(metadata);
      
      default:
        throw new Error(`Unsupported page type: ${type}`);
    }
  }

  /**
   * Generate category page data
   */
  private async generateCategoryPageData(
    categorySlug: string,
    metadata: { title: string; description: string; keywords: string[] }
  ): Promise<PageData> {
    // Get brokers for this category
    const brokers = await this.getBrokersByFilter({ category: categorySlug });

    // Generate AI content
    const contentRequest: ContentGenerationRequest = {
      type: 'page_content',
      context: {
        pageType: 'category',
        category: this.formatCategoryName(categorySlug),
        targetAudience: 'traders of all levels',
        tone: 'professional',
        length: 'medium',
        keywords: metadata.keywords
      },
      options: {
        includeStructuredData: true,
        includeFAQs: true,
        includeComparison: true
      }
    };

    const aiContent = await aiContentGenerator.generateContent(contentRequest);

    return {
      title: metadata.title,
      description: metadata.description,
      content: aiContent.content,
      meta: {
        keywords: metadata.keywords,
        structuredData: aiContent.structuredData || {},
        canonical: `/${categorySlug}`,
        robots: 'index,follow'
      },
      brokers,
      faqs: aiContent.faqs,
      comparison: aiContent.comparison,
      breadcrumbs: this.generateBreadcrumbs('category', { categorySlug }),
      relatedPages: await this.generateRelatedPages('category', { categorySlug }),
      analytics: {
        pageType: 'category',
        category: categorySlug,
        generatedAt: new Date().toISOString(),
        contentQuality: aiContent.metadata.qualityScore
      }
    };
  }

  /**
   * Generate country page data
   */
  private async generateCountryPageData(
    countryCode: string,
    countryName: string,
    metadata: { title: string; description: string; keywords: string[] }
  ): Promise<PageData> {
    // Get brokers for this country
    const brokers = await this.getBrokersByFilter({ country: countryCode });

    // Get country info
    const countryInfo = await this.getCountryInfo(countryCode);

    // Generate AI content
    const contentRequest: ContentGenerationRequest = {
      type: 'page_content',
      context: {
        pageType: 'country',
        country: countryName,
        region: countryInfo?.region,
        targetAudience: 'traders in this country',
        tone: 'professional',
        length: 'medium',
        keywords: metadata.keywords
      },
      options: {
        includeStructuredData: true,
        includeFAQs: true,
        includeComparison: true
      }
    };

    const aiContent = await aiContentGenerator.generateContent(contentRequest);

    return {
      title: metadata.title,
      description: metadata.description,
      content: aiContent.content,
      meta: {
        keywords: metadata.keywords,
        structuredData: aiContent.structuredData || {},
        canonical: `/country/${countryCode}`,
        robots: 'index,follow'
      },
      brokers,
      faqs: aiContent.faqs,
      comparison: aiContent.comparison,
      breadcrumbs: this.generateBreadcrumbs('country', { countryCode, countryName }),
      relatedPages: await this.generateRelatedPages('country', { countryCode }),
      analytics: {
        pageType: 'country',
        country: countryCode,
        generatedAt: new Date().toISOString(),
        contentQuality: aiContent.metadata.qualityScore
      }
    };
  }

  /**
   * Generate category-country page data
   */
  private async generateCategoryCountryPageData(
    categorySlug: string,
    countryCode: string,
    countryName: string,
    metadata: { title: string; description: string; keywords: string[] }
  ): Promise<PageData> {
    // Get brokers for this category-country combination
    const brokers = await this.getBrokersByFilter({ 
      category: categorySlug, 
      country: countryCode 
    });

    // Get country info
    const countryInfo = await this.getCountryInfo(countryCode);

    // Generate AI content
    const contentRequest: ContentGenerationRequest = {
      type: 'page_content',
      context: {
        pageType: 'category-country',
        category: this.formatCategoryName(categorySlug),
        country: countryName,
        region: countryInfo?.region,
        targetAudience: `${this.formatCategoryName(categorySlug)} traders in ${countryName}`,
        tone: 'professional',
        length: 'medium',
        keywords: metadata.keywords
      },
      options: {
        includeStructuredData: true,
        includeFAQs: true,
        includeComparison: true
      }
    };

    const aiContent = await aiContentGenerator.generateContent(contentRequest);

    return {
      title: metadata.title,
      description: metadata.description,
      content: aiContent.content,
      meta: {
        keywords: metadata.keywords,
        structuredData: aiContent.structuredData || {},
        canonical: `/${categorySlug}/${countryCode}`,
        robots: 'index,follow'
      },
      brokers,
      faqs: aiContent.faqs,
      comparison: aiContent.comparison,
      breadcrumbs: this.generateBreadcrumbs('category-country', { categorySlug, countryCode, countryName }),
      relatedPages: await this.generateRelatedPages('category-country', { categorySlug, countryCode }),
      analytics: {
        pageType: 'category-country',
        category: categorySlug,
        country: countryCode,
        generatedAt: new Date().toISOString(),
        contentQuality: aiContent.metadata.qualityScore
      }
    };
  }

  /**
   * Generate strategy page data
   */
  private async generateStrategyPageData(
    strategySlug: string,
    metadata: { title: string; description: string; keywords: string[] }
  ): Promise<PageData> {
    // Generate AI content for strategy guide
    const contentRequest: ContentGenerationRequest = {
      type: 'article',
      context: {
        pageType: 'strategy',
        strategy: this.formatStrategyName(strategySlug),
        targetAudience: 'traders looking to learn new strategies',
        tone: 'educational',
        length: 'long',
        keywords: metadata.keywords
      },
      options: {
        includeStructuredData: true,
        includeFAQs: true
      }
    };

    const aiContent = await aiContentGenerator.generateContent(contentRequest);

    // Get brokers that support this strategy
    const brokers = await this.getBrokersByFilter({ features: [strategySlug] });

    return {
      title: metadata.title,
      description: metadata.description,
      content: aiContent.content,
      meta: {
        keywords: metadata.keywords,
        structuredData: aiContent.structuredData || {},
        canonical: `/${strategySlug}-strategy`,
        robots: 'index,follow'
      },
      brokers,
      faqs: aiContent.faqs,
      breadcrumbs: this.generateBreadcrumbs('strategy', { strategySlug }),
      relatedPages: await this.generateRelatedPages('strategy', { strategySlug }),
      analytics: {
        pageType: 'strategy',
        generatedAt: new Date().toISOString(),
        contentQuality: aiContent.metadata.qualityScore
      }
    };
  }

  /**
   * Generate feature page data
   */
  private async generateFeaturePageData(
    featureSlug: string,
    metadata: { title: string; description: string; keywords: string[] }
  ): Promise<PageData> {
    // Generate AI content for feature comparison
    const contentRequest: ContentGenerationRequest = {
      type: 'comparison',
      context: {
        pageType: 'feature',
        feature: this.formatFeatureName(featureSlug),
        targetAudience: 'traders looking for specific features',
        tone: 'analytical',
        length: 'medium',
        keywords: metadata.keywords
      },
      options: {
        includeStructuredData: true,
        includeFAQs: true,
        includeComparison: true
      }
    };

    const aiContent = await aiContentGenerator.generateContent(contentRequest);

    // Get brokers that offer this feature
    const brokers = await this.getBrokersByFilter({ features: [featureSlug] });

    return {
      title: metadata.title,
      description: metadata.description,
      content: aiContent.content,
      meta: {
        keywords: metadata.keywords,
        structuredData: aiContent.structuredData || {},
        canonical: `/${featureSlug}-feature`,
        robots: 'index,follow'
      },
      brokers,
      faqs: aiContent.faqs,
      comparison: aiContent.comparison,
      breadcrumbs: this.generateBreadcrumbs('feature', { featureSlug }),
      relatedPages: await this.generateRelatedPages('feature', { featureSlug }),
      analytics: {
        pageType: 'feature',
        generatedAt: new Date().toISOString(),
        contentQuality: aiContent.metadata.qualityScore
      }
    };
  }

  /**
   * Generate broker page data
   */
  private async generateBrokerPageData(
    brokerSlug: string,
    metadata: { title: string; description: string; keywords: string[] }
  ): Promise<PageData> {
    // Get broker details
    const broker = await this.getBrokerBySlug(brokerSlug);
    
    if (!broker) {
      throw new Error(`Broker not found: ${brokerSlug}`);
    }

    // Generate meta description
    const metaRequest: ContentGenerationRequest = {
      type: 'meta_description',
      context: {
        pageType: 'broker',
        topic: broker.name,
        targetAudience: 'traders considering this broker',
        keywords: metadata.keywords
      }
    };

    const metaContent = await aiContentGenerator.generateContent(metaRequest);

    return {
      title: metadata.title,
      description: metaContent.content,
      content: this.generateBrokerReviewContent(broker),
      meta: {
        keywords: metadata.keywords,
        structuredData: this.generateBrokerStructuredData(broker),
        canonical: `/broker/${brokerSlug}`,
        robots: 'index,follow'
      },
      brokers: [broker],
      breadcrumbs: this.generateBreadcrumbs('broker', { brokerSlug, brokerName: broker.name }),
      relatedPages: await this.generateRelatedPages('broker', { brokerSlug, broker }),
      analytics: {
        pageType: 'broker',
        generatedAt: new Date().toISOString(),
        contentQuality: 0.9 // Broker reviews are high quality by default
      }
    };
  }

  /**
   * Generate home page data
   */
  private async generateHomePageData(
    metadata: { title: string; description: string; keywords: string[] }
  ): Promise<PageData> {
    // Get top brokers
    const brokers = await this.getTopBrokers(10);

    return {
      title: metadata.title,
      description: metadata.description,
      content: this.generateHomePageContent(),
      meta: {
        keywords: metadata.keywords,
        structuredData: this.generateHomePageStructuredData(),
        canonical: '/',
        robots: 'index,follow'
      },
      brokers,
      breadcrumbs: [{ label: 'Home' }],
      relatedPages: await this.generateRelatedPages('home'),
      analytics: {
        pageType: 'home',
        generatedAt: new Date().toISOString(),
        contentQuality: 0.95
      }
    };
  }

  /**
   * Get brokers by filter
   */
  private async getBrokersByFilter(filter: BrokerFilter): Promise<any[]> {
    try {
      let query = supabase.from('brokers').select('*');

      if (filter.category) {
        // This would need to be implemented based on your broker-category relationship
        query = query.contains('categories', [filter.category]);
      }

      if (filter.country) {
        query = query.contains('supported_countries', [filter.country]);
      }

      if (filter.features && filter.features.length > 0) {
        query = query.contains('features', filter.features);
      }

      if (filter.regulation && filter.regulation.length > 0) {
        query = query.contains('regulation', filter.regulation);
      }

      if (filter.minDeposit) {
        query = query.gte('min_deposit', filter.minDeposit);
      }

      if (filter.maxLeverage) {
        query = query.lte('max_leverage', filter.maxLeverage);
      }

      const { data, error } = await query.order('content_priority', { ascending: false });

      if (error) {
        console.error('Error getting brokers by filter:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('Error getting brokers by filter:', error);
      return [];
    }
  }

  /**
   * Get top brokers
   */
  private async getTopBrokers(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .order('content_priority', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting top brokers:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('Error getting top brokers:', error);
      return [];
    }
  }

  /**
   * Get broker by slug
   */
  private async getBrokerBySlug(slug: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error getting broker by slug:', error);
        return null;
      }

      return data;

    } catch (error) {
      console.error('Error getting broker by slug:', error);
      return null;
    }
  }

  /**
   * Get country info
   */
  private async getCountryInfo(countryCode: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .eq('code', countryCode)
        .single();

      if (error) {
        console.error('Error getting country info:', error);
        return null;
      }

      return data;

    } catch (error) {
      console.error('Error getting country info:', error);
      return null;
    }
  }

  /**
   * Generate breadcrumbs
   */
  private generateBreadcrumbs(
    type: string,
    params: Record<string, any>
  ): Array<{ label: string; href?: string }> {
    const breadcrumbs: Array<{ label: string; href?: string }> = [
      { label: 'Home', href: '/' }
    ];

    switch (type) {
      case 'category':
        breadcrumbs.push({
          label: this.formatCategoryName(params.categorySlug)
        });
        break;

      case 'country':
        breadcrumbs.push({
          label: params.countryName
        });
        break;

      case 'category-country':
        breadcrumbs.push({
          label: this.formatCategoryName(params.categorySlug),
          href: `/${params.categorySlug}`
        });
        breadcrumbs.push({
          label: params.countryName
        });
        break;

      case 'strategy':
        breadcrumbs.push({
          label: 'Trading Strategies',
          href: '/strategies'
        });
        breadcrumbs.push({
          label: this.formatStrategyName(params.strategySlug)
        });
        break;

      case 'feature':
        breadcrumbs.push({
          label: 'Broker Features',
          href: '/features'
        });
        breadcrumbs.push({
          label: this.formatFeatureName(params.featureSlug)
        });
        break;

      case 'broker':
        breadcrumbs.push({
          label: 'Broker Reviews',
          href: '/brokers'
        });
        breadcrumbs.push({
          label: params.brokerName
        });
        break;
    }

    return breadcrumbs;
  }

  /**
   * Generate related pages
   */
  private async generateRelatedPages(
    type: string,
    params: Record<string, any> = {}
  ): Promise<Array<{ title: string; href: string }>> {
    const relatedPages: Array<{ title: string; href: string }> = [];

    switch (type) {
      case 'category':
        // Add related countries for this category
        const popularCountries = ['US', 'GB', 'DE', 'FR', 'AU'];
        for (const country of popularCountries) {
          relatedPages.push({
            title: `Best ${this.formatCategoryName(params.categorySlug)} Brokers in ${country}`,
            href: `/${params.categorySlug}/${country.toLowerCase()}`
          });
        }
        break;

      case 'country':
        // Add popular categories for this country
        const popularCategories = ['forex', 'stocks', 'crypto'];
        for (const category of popularCategories) {
          relatedPages.push({
            title: `Best ${this.formatCategoryName(category)} Brokers in ${params.countryName}`,
            href: `/${category}/${params.countryCode.toLowerCase()}`
          });
        }
        break;

      case 'strategy':
        // Add related strategies
        const relatedStrategies = ['day-trading', 'swing-trading', 'scalping'];
        for (const strategy of relatedStrategies) {
          if (strategy !== params.strategySlug) {
            relatedPages.push({
              title: `${this.formatStrategyName(strategy)} Strategy`,
              href: `/${strategy}-strategy`
            });
          }
        }
        break;

      case 'feature':
        // Add related features
        const relatedFeatures = ['low-spreads', 'high-leverage', 'mobile-trading'];
        for (const feature of relatedFeatures) {
          if (feature !== params.featureSlug) {
            relatedPages.push({
              title: `Brokers with ${this.formatFeatureName(feature)}`,
              href: `/${feature}-feature`
            });
          }
        }
        break;
    }

    return relatedPages.slice(0, 5); // Limit to 5 related pages
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(pageDetection: PageDetectionResult): string {
    return `page-data:${pageDetection.type}:${JSON.stringify(pageDetection.params)}`;
  }

  /**
   * Generate cache tags
   */
  private generateCacheTags(pageDetection: PageDetectionResult): string[] {
    const tags = [`page-type:${pageDetection.type}`];
    
    if (pageDetection.params.categorySlug) {
      tags.push(`category:${pageDetection.params.categorySlug}`);
    }
    
    if (pageDetection.params.countryCode) {
      tags.push(`country:${pageDetection.params.countryCode}`);
    }
    
    if (pageDetection.params.strategySlug) {
      tags.push(`strategy:${pageDetection.params.strategySlug}`);
    }
    
    if (pageDetection.params.featureSlug) {
      tags.push(`feature:${pageDetection.params.featureSlug}`);
    }
    
    return tags;
  }

  /**
   * Format category name
   */
  private formatCategoryName(slug: string): string {
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  /**
   * Format strategy name
   */
  private formatStrategyName(slug: string): string {
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  /**
   * Format feature name
   */
  private formatFeatureName(slug: string): string {
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  /**
   * Generate broker review content
   */
  private generateBrokerReviewContent(broker: any): string {
    return `
      <h2>${broker.name} Review</h2>
      <p>${broker.name} is a ${broker.year_founded}-established broker headquartered in ${broker.headquarters}.</p>
      
      <h3>Regulation</h3>
      <p>${broker.name} is regulated by ${broker.regulation.join(', ')}.</p>
      
      <h3>Trading Platforms</h3>
      <p>Available platforms include ${broker.platforms.join(', ')}.</p>
      
      <h3>Instruments</h3>
      <p>Trade ${broker.instruments.join(', ')} with competitive spreads.</p>
      
      <h3>Account Details</h3>
      <p>Minimum deposit: $${broker.min_deposit}</p>
      <p>Maximum leverage: ${broker.max_leverage}:1</p>
      
      <h3>Conclusion</h3>
      <p>${broker.name} offers a comprehensive trading experience suitable for traders of all levels.</p>
    `;
  }

  /**
   * Generate structured data for broker
   */
  private generateBrokerStructuredData(broker: any): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'FinancialService',
      name: broker.name,
      description: `Comprehensive review of ${broker.name} trading broker`,
      url: `/broker/${broker.slug}`,
      provider: {
        '@type': 'Organization',
        name: broker.name,
        foundingDate: broker.year_founded.toString(),
        address: {
          '@type': 'PostalAddress',
          addressCountry: broker.headquarters
        }
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: broker.min_deposit.toString(),
        description: 'Minimum deposit requirement'
      }
    };
  }

  /**
   * Generate home page content
   */
  private generateHomePageContent(): string {
    return `
      <h2>Find Your Perfect Trading Broker</h2>
      <p>Compare the best online trading brokers for 2025. Our comprehensive reviews and comparisons help you find the right platform for your trading needs.</p>
      
      <h3>Why Choose Our Recommendations?</h3>
      <ul>
        <li>Unbiased, expert reviews</li>
        <li>Real trader feedback</li>
        <li>Up-to-date information</li>
        <li>Focus on safety and regulation</li>
      </ul>
      
      <h3>Popular Trading Categories</h3>
      <p>Whether you're interested in forex, stocks, crypto, or commodities, we have detailed guides and broker recommendations to help you succeed.</p>
    `;
  }

  /**
   * Generate structured data for home page
   */
  private generateHomePageStructuredData(): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Broker Analysis',
      description: 'Find and compare the best online trading brokers',
      url: '/',
      potentialAction: {
        '@type': 'SearchAction',
        target: '/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    };
  }
}

// Export singleton instance
export const pageDataService = new PageDataService();
export default pageDataService;