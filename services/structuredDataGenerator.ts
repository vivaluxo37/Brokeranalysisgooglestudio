/**
 * Advanced JSON-LD Structured Data Generator
 * Generates SEO-optimized structured data for programmatic directory pages
 * Integrates with caching system for optimal performance
 */

import { Broker } from '../types';
import { SEOPageConfig } from '../data/seoPageConfigs';
import { CountryConfig } from '../lib/constants/countries';
import { programmaticCache } from './programmaticCache';
import { performanceMonitoring } from './performanceMonitoring';

// Base schema interfaces
export interface BaseSchema {
  '@context': string | string[];
  '@type': string;
  [key: string]: any;
}

export interface OrganizationSchema extends BaseSchema {
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    '@type': 'PostalAddress';
    addressCountry: string;
    addressRegion?: string;
    addressLocality?: string;
  };
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone?: string;
    email?: string;
    contactType: string;
  }[];
  sameAs?: string[];
  foundingDate?: string;
  numberOfEmployees?: string;
  award?: string[];
}

export interface WebPageSchema extends BaseSchema {
  '@type': 'WebPage';
  name: string;
  description: string;
  url: string;
  mainEntity?: any;
  breadcrumb?: BreadcrumbListSchema;
  isPartOf: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
  datePublished: string;
  dateModified: string;
  author: {
    '@type': 'Organization';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
}

export interface CollectionPageSchema extends BaseSchema {
  '@type': 'CollectionPage';
  name: string;
  description: string;
  url: string;
  mainEntity: {
    '@type': 'ItemList';
    numberOfItems: number;
    itemListElement: any[];
  };
  breadcrumb: BreadcrumbListSchema;
  isPartOf: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
}

export interface BreadcrumbListSchema extends BaseSchema {
  '@type': 'BreadcrumbList';
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }[];
}

export interface FAQPageSchema extends BaseSchema {
  '@type': 'FAQPage';
  mainEntity: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }[];
}

export interface ReviewSchema extends BaseSchema {
  '@type': 'Review';
  reviewRating: {
    '@type': 'Rating';
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  author: {
    '@type': 'Organization';
    name: string;
  };
  reviewBody: string;
  itemReviewed: {
    '@type': 'FinancialProduct';
    name: string;
    description: string;
    provider: {
      '@type': 'Organization';
      name: string;
    };
  };
}

export interface FinancialProductSchema extends BaseSchema {
  '@type': 'FinancialProduct';
  name: string;
  description: string;
  provider: OrganizationSchema;
  category: string;
  url?: string;
  offers?: {
    '@type': 'Offer';
    priceCurrency: string;
    price?: string;
    priceSpecification?: {
      '@type': 'PriceSpecification';
      valueAddedTaxIncluded: boolean;
      price: string;
      priceCurrency: string;
    };
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
    worstRating: number;
  };
  featureList?: string[];
}

// Configuration for structured data generation
interface StructuredDataConfig {
  baseUrl: string;
  siteName: string;
  organization: {
    name: string;
    url: string;
    logo: string;
    description: string;
    foundingDate: string;
    contactEmail: string;
    socialProfiles: string[];
  };
  defaultAuthor: {
    name: string;
    type: 'Organization' | 'Person';
  };
}

class StructuredDataGeneratorService {
  private config: StructuredDataConfig;
  private schemaCache = new Map<string, any>();
  private cachePrefix = 'structured-data';

  constructor() {
    this.config = {
      baseUrl: 'https://brokeranalysis.com',
      siteName: 'Broker Analysis',
      organization: {
        name: 'Broker Analysis',
        url: 'https://brokeranalysis.com',
        logo: 'https://brokeranalysis.com/logo.png',
        description: 'Comprehensive forex broker analysis and comparison platform',
        foundingDate: '2020-01-01',
        contactEmail: 'info@brokeranalysis.com',
        socialProfiles: [
          'https://twitter.com/brokeranalysis',
          'https://linkedin.com/company/brokeranalysis',
          'https://facebook.com/brokeranalysis'
        ]
      },
      defaultAuthor: {
        name: 'Broker Analysis Editorial Team',
        type: 'Organization'
      }
    };
  }

  /**
   * Generate complete structured data for a programmatic directory page
   */
  async generatePageStructuredData(
    pageType: 'category' | 'country' | 'seo',
    pageSlug: string,
    brokers: Broker[],
    config: SEOPageConfig | CountryConfig,
    additionalData?: any
  ): Promise<BaseSchema[]> {
    const cacheKey = `${this.cachePrefix}:${pageType}:${pageSlug}`;
    const startTime = Date.now();
    
    // Try to get from cache first
    try {
      const cached = await programmaticCache.get('structured-data', pageSlug);
      if (cached) {
        performanceMonitoring.trackCacheAccess(cacheKey, true, Date.now() - startTime);
        return cached.schemas;
      }
    } catch (error) {
      console.warn('Failed to get structured data from cache:', error);
    }

    const schemas: BaseSchema[] = [];
    const pageUrl = `${this.config.baseUrl}/${this.getPagePath(pageType, pageSlug)}`;

    // 1. Organization schema (always included)
    schemas.push(this.generateOrganizationSchema());

    // 2. WebSite schema (for search box)
    schemas.push(this.generateWebSiteSchema());

    // 3. Breadcrumb schema
    const breadcrumbs = this.generateBreadcrumbSchema(pageType, pageSlug, config);
    schemas.push(breadcrumbs);

    // 4. Page-specific schemas
    switch (pageType) {
      case 'category':
        const categorySchemas = this.generateCategoryPageSchemas(
          pageSlug,
          config as SEOPageConfig,
          brokers,
          pageUrl,
          breadcrumbs
        );
        schemas.push(...categorySchemas);
        break;

      case 'country':
        const countrySchemas = this.generateCountryPageSchemas(
          pageSlug,
          config as CountryConfig,
          brokers,
          pageUrl,
          breadcrumbs
        );
        schemas.push(...countrySchemas);
        break;

      case 'seo':
        const seoSchemas = this.generateSEOPageSchemas(
          pageSlug,
          config as SEOPageConfig,
          brokers,
          pageUrl,
          breadcrumbs
        );
        schemas.push(...seoSchemas);
        break;
    }

    // 5. FAQ schema (if applicable)
    if (this.shouldIncludeFAQ(pageType, config)) {
      const faqSchema = this.generateFAQSchema(pageType, config, brokers);
      if (faqSchema) {
        schemas.push(faqSchema);
      }
    }

    // Cache the generated schemas
    try {
      await programmaticCache.set('structured-data', pageSlug, 
        { schemas, generatedAt: new Date().toISOString() },
        {
          dependencies: [`brokers:all`],
          version: '1.0'
        }
      );
    } catch (error) {
      console.warn('Failed to cache structured data:', error);
    }

    performanceMonitoring.trackCacheAccess(cacheKey, false, Date.now() - startTime);
    return schemas;
  }

  /**
   * Generate organization schema
   */
  private generateOrganizationSchema(): OrganizationSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.config.organization.name,
      url: this.config.organization.url,
      logo: this.config.organization.logo,
      description: this.config.organization.description,
      foundingDate: this.config.organization.foundingDate,
      sameAs: this.config.organization.socialProfiles,
      contactPoint: [{
        '@type': 'ContactPoint',
        email: this.config.organization.contactEmail,
        contactType: 'customer service'
      }]
    };
  }

  /**
   * Generate website schema with search functionality
   */
  private generateWebSiteSchema(): BaseSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.config.siteName,
      url: this.config.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.config.baseUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };
  }

  /**
   * Generate breadcrumb schema
   */
  private generateBreadcrumbSchema(
    pageType: string,
    pageSlug: string,
    config: SEOPageConfig | CountryConfig
  ): BreadcrumbListSchema {
    const breadcrumbs: BreadcrumbListSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: this.config.baseUrl
        }
      ]
    };

    // Add page-type specific breadcrumbs
    switch (pageType) {
      case 'category':
        breadcrumbs.itemListElement.push(
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Best Brokers',
            item: `${this.config.baseUrl}/best-brokers`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: config.title,
            item: `${this.config.baseUrl}/best-brokers/${pageSlug}`
          }
        );
        break;

      case 'country':
        breadcrumbs.itemListElement.push(
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Forex Brokers by Country',
            item: `${this.config.baseUrl}/best-forex-brokers`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${(config as CountryConfig).name} Brokers`,
            item: `${this.config.baseUrl}/best-forex-brokers/${pageSlug}`
          }
        );
        break;

      case 'seo':
        breadcrumbs.itemListElement.push(
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Brokers',
            item: `${this.config.baseUrl}/brokers`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: config.title,
            item: `${this.config.baseUrl}/brokers/${pageSlug}`
          }
        );
        break;
    }

    return breadcrumbs;
  }

  /**
   * Generate schemas for category pages
   */
  private generateCategoryPageSchemas(
    pageSlug: string,
    config: SEOPageConfig,
    brokers: Broker[],
    pageUrl: string,
    breadcrumbs: BreadcrumbListSchema
  ): BaseSchema[] {
    const schemas: BaseSchema[] = [];

    // Collection page schema
    const collectionPage: CollectionPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: config.title,
      description: config.description,
      url: pageUrl,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: brokers.length,
        itemListElement: brokers.slice(0, 10).map((broker, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: this.generateBrokerSchema(broker)
        }))
      },
      breadcrumb: breadcrumbs,
      isPartOf: {
        '@type': 'WebSite',
        name: this.config.siteName,
        url: this.config.baseUrl
      }
    };

    schemas.push(collectionPage);

    // Add individual broker schemas for top brokers
    brokers.slice(0, 5).forEach(broker => {
      schemas.push(this.generateBrokerSchema(broker));
    });

    return schemas;
  }

  /**
   * Generate schemas for country pages
   */
  private generateCountryPageSchemas(
    pageSlug: string,
    config: CountryConfig,
    brokers: Broker[],
    pageUrl: string,
    breadcrumbs: BreadcrumbListSchema
  ): BaseSchema[] {
    const schemas: BaseSchema[] = [];

    // Collection page for country-specific brokers
    const countryPage: CollectionPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Best Forex Brokers in ${config.name}`,
      description: `Top-rated forex brokers available in ${config.name}. Compare regulations, features, and trading conditions.`,
      url: pageUrl,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: brokers.length,
        itemListElement: brokers.slice(0, 10).map((broker, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: this.generateBrokerSchema(broker, config)
        }))
      },
      breadcrumb: breadcrumbs,
      isPartOf: {
        '@type': 'WebSite',
        name: this.config.siteName,
        url: this.config.baseUrl
      }
    };

    schemas.push(countryPage);

    // Add place schema for the country
    const placeSchema: BaseSchema = {
      '@context': 'https://schema.org',
      '@type': 'Country',
      name: config.name,
      alternateName: config.code,
      description: `Forex trading and broker information for ${config.name}`
    };

    schemas.push(placeSchema);

    return schemas;
  }

  /**
   * Generate schemas for SEO pages
   */
  private generateSEOPageSchemas(
    pageSlug: string,
    config: SEOPageConfig,
    brokers: Broker[],
    pageUrl: string,
    breadcrumbs: BreadcrumbListSchema
  ): BaseSchema[] {
    const schemas: BaseSchema[] = [];

    // Web page schema for SEO pages
    const webpage: WebPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: config.title,
      description: config.description,
      url: pageUrl,
      breadcrumb: breadcrumbs,
      isPartOf: {
        '@type': 'WebSite',
        name: this.config.siteName,
        url: this.config.baseUrl
      },
      datePublished: new Date().toISOString().split('T')[0],
      dateModified: new Date().toISOString().split('T')[0],
      author: {
        '@type': 'Organization',
        name: this.config.defaultAuthor.name
      },
      publisher: {
        '@type': 'Organization',
        name: this.config.organization.name,
        logo: {
          '@type': 'ImageObject',
          url: this.config.organization.logo
        }
      }
    };

    // Add main entity if brokers are present
    if (brokers.length > 0) {
      webpage.mainEntity = {
        '@type': 'ItemList',
        numberOfItems: brokers.length,
        itemListElement: brokers.slice(0, 5).map((broker, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: this.generateBrokerSchema(broker)
        }))
      };
    }

    schemas.push(webpage);

    return schemas;
  }

  /**
   * Generate structured data for individual broker
   */
  private generateBrokerSchema(broker: Broker, country?: CountryConfig): FinancialProductSchema {
    // Calculate aggregate rating
    const rating = this.calculateBrokerRating(broker);
    
    const brokerSchema: FinancialProductSchema = {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      name: broker.name,
      description: broker.summary || `${broker.name} is a forex broker offering trading services with ${(broker.regulation?.regulators || []).join(', ')} regulation.`,
      provider: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: broker.name,
        url: broker.website,
        logo: broker.logo,
        description: broker.summary || '',
        foundingDate: broker.established?.toString(),
        address: broker.headquarters ? {
          '@type': 'PostalAddress',
          addressCountry: broker.headquarters.country,
          addressLocality: broker.headquarters.city
        } : undefined,
        sameAs: broker.socialMedia ? Object.values(broker.socialMedia).filter(Boolean) : []
      },
      category: 'Forex Trading',
      url: broker.website,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount: 1, // This should be dynamic based on actual reviews
        bestRating: 5,
        worstRating: 1
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: broker.accessibility.minDeposit?.toString() || '0',
        priceSpecification: {
          '@type': 'PriceSpecification',
          valueAddedTaxIncluded: false,
          price: broker.accessibility.minDeposit?.toString() || '0',
          priceCurrency: 'USD'
        }
      },
      featureList: this.extractBrokerFeatures(broker)
    };

    return brokerSchema;
  }

  /**
   * Generate FAQ schema for pages
   */
  private generateFAQSchema(
    pageType: string,
    config: SEOPageConfig | CountryConfig,
    brokers: Broker[]
  ): FAQPageSchema | null {
    const faqs = this.generateFAQsForPage(pageType, config, brokers);
    
    if (faqs.length === 0) {
      return null;
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  /**
   * Generate page-specific FAQs
   */
  private generateFAQsForPage(
    pageType: string,
    config: SEOPageConfig | CountryConfig,
    brokers: Broker[]
  ): { question: string; answer: string }[] {
    const faqs: { question: string; answer: string }[] = [];
    
    switch (pageType) {
      case 'category':
        const categoryConfig = config as SEOPageConfig;
        faqs.push(
          {
            question: `What are the best ${categoryConfig.title.toLowerCase()}?`,
            answer: `Based on our analysis, the top ${categoryConfig.title.toLowerCase()} include ${brokers.slice(0, 3).map(b => b.name).join(', ')}. These brokers offer ${categoryConfig.highlights.slice(0, 2).join(' and ')}.`
          },
          {
            question: `How do I choose the right ${categoryConfig.title.toLowerCase().replace('best ', '')}?`,
            answer: `When selecting a broker, consider factors like regulation, minimum deposit, spreads, available platforms, and customer support. Our comparison covers all these aspects.`
          }
        );
        break;

      case 'country':
        const countryConfig = config as CountryConfig;
        faqs.push(
          {
            question: `Are these brokers regulated in ${countryConfig.name}?`,
            answer: `Yes, all listed brokers are either regulated in ${countryConfig.name} or accept clients from ${countryConfig.name} through international regulations like CySEC, FCA, or ASIC.`
          },
          {
            question: `What is the minimum deposit for brokers in ${countryConfig.name}?`,
            answer: `Minimum deposits vary by broker, ranging from $${Math.min(...brokers.map(b => b.accessibility.minDeposit || 0))} to $${Math.max(...brokers.map(b => b.accessibility.minDeposit || 0))} among our top-rated brokers.`
          }
        );
        break;

      case 'seo':
        const seoConfig = config as SEOPageConfig;
        faqs.push(
          {
            question: `What makes these ${seoConfig.title.toLowerCase()} special?`,
            answer: `These brokers are selected based on ${seoConfig.highlights.join(', ')}. Each broker undergoes rigorous analysis of their trading conditions, regulation, and customer service.`
          }
        );
        break;
    }

    return faqs;
  }

  /**
   * Helper methods
   */
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

  private calculateBrokerRating(broker: Broker): number {
    // Simple rating calculation based on available data
    let score = 3; // Base score
    
    if (broker.regulation?.regulators && broker.regulation.regulators.length > 0) score += 0.5;
    if (broker.accessibility?.minDeposit && broker.accessibility.minDeposit <= 100) score += 0.5;
    if (broker.tradingConditions?.spreads?.eurusd && broker.tradingConditions.spreads.eurusd < 1.0) score += 0.5;
    if (broker.platforms?.mt4 || broker.platforms?.mt5) score += 0.5;
    
    return Math.min(5, Math.max(1, Number(score.toFixed(1))));
  }

  private extractBrokerFeatures(broker: Broker): string[] {
    const features: string[] = [];
    
    if (broker.platforms.mt4) features.push('MetaTrader 4');
    if (broker.platforms.mt5) features.push('MetaTrader 5');
    if (broker.copyTrading) features.push('Copy Trading');
    if (broker.isIslamic) features.push('Islamic Accounts');
    if (broker.accessibility.demoAccount) features.push('Demo Account');
    
    return features;
  }

  private shouldIncludeFAQ(pageType: string, config: SEOPageConfig | CountryConfig): boolean {
    // Always include FAQ for category and country pages
    return pageType === 'category' || pageType === 'country';
  }

  /**
   * Generate JSON-LD script tag
   */
  generateJSONLD(schemas: BaseSchema[]): string {
    return schemas.map(schema => 
      `<script type="application/ld+json">${JSON.stringify(schema, null, 0)}</script>`
    ).join('\n');
  }

  /**
   * Clear structured data cache
   */
  async clearCache(pattern?: string): Promise<void> {
    if (pattern) {
      await programmaticCache.invalidate(`${this.cachePrefix}:${pattern}`);
    } else {
      await programmaticCache.invalidate(`${this.cachePrefix}:*`);
    }
    this.schemaCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.schemaCache.size,
      keys: Array.from(this.schemaCache.keys())
    };
  }
}

// Create singleton instance
export const structuredDataGenerator = new StructuredDataGeneratorService();

// React hook for structured data  
export const useStructuredData = () => {
  return {
    generatePageStructuredData: structuredDataGenerator.generatePageStructuredData.bind(structuredDataGenerator),
    generateJSONLD: structuredDataGenerator.generateJSONLD.bind(structuredDataGenerator),
    clearCache: structuredDataGenerator.clearCache.bind(structuredDataGenerator),
    getCacheStats: structuredDataGenerator.getCacheStats.bind(structuredDataGenerator)
  };
};

// Alternative hook name for consistency
export const useStructuredDataGenerator = useStructuredData;

export default structuredDataGenerator;