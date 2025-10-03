/**
 * Enhanced Structured Data Service for Programmatic Pages
 * Generates comprehensive JSON-LD schemas for better SEO
 */

import { Broker } from '../types';
import { SEOPageConfig } from '../data/seoPageConfigs';

interface StructuredDataOptions {
  baseUrl?: string;
  organizationName?: string;
  organizationLogo?: string;
}

class StructuredDataService {
  private baseUrl: string;
  private organizationName: string;
  private organizationLogo: string;

  constructor(options: StructuredDataOptions = {}) {
    this.baseUrl = options.baseUrl || 'https://brokeranalysis.com';
    this.organizationName = options.organizationName || 'Broker Analysis';
    this.organizationLogo = options.organizationLogo || `${this.baseUrl}/logo.png`;
  }

  /**
   * Generate Organization schema
   */
  generateOrganizationSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.organizationName,
      url: this.baseUrl,
      logo: this.organizationLogo,
      sameAs: [
        // Add social media links when available
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['English']
      }
    };
  }

  /**
   * Generate WebSite schema with search action
   */
  generateWebSiteSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.organizationName,
      url: this.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };
  }

  /**
   * Generate FAQ schema for pages with FAQs
   */
  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): object {
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
   * Generate Breadcrumb schema
   */
  generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${this.baseUrl}${item.url}`
      }))
    };
  }

  /**
   * Generate ItemList schema for broker listings
   */
  generateBrokerListSchema(
    brokers: Broker[], 
    listName: string, 
    description?: string
  ): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: listName,
      description: description || `A curated list of ${brokers.length} forex brokers`,
      numberOfItems: brokers.length,
      itemListElement: brokers.slice(0, 10).map((broker, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'FinancialProduct',
          name: broker.name,
          description: broker.description,
          url: `${this.baseUrl}/broker/${broker.slug}`,
          provider: {
            '@type': 'Organization',
            name: broker.name,
            url: broker.externalUrl || `${this.baseUrl}/broker/${broker.slug}`
          },
          aggregateRating: broker.score ? {
            '@type': 'AggregateRating',
            ratingValue: broker.score,
            ratingCount: broker.reviewCount || 100,
            bestRating: 5,
            worstRating: 1
          } : undefined
        }
      }))
    };
  }

  /**
   * Generate Article schema for category pages
   */
  generateArticleSchema(config: {
    title: string;
    description: string;
    url: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
    keywords?: string[];
  }): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: config.title,
      description: config.description,
      url: config.url,
      datePublished: config.datePublished || new Date().toISOString(),
      dateModified: config.dateModified || new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name: this.organizationName,
        url: this.baseUrl
      },
      publisher: {
        '@type': 'Organization',
        name: this.organizationName,
        logo: {
          '@type': 'ImageObject',
          url: this.organizationLogo
        }
      },
      keywords: config.keywords?.join(', '),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': config.url
      }
    };
  }

  /**
   * Generate Product schema for individual brokers
   */
  generateBrokerProductSchema(broker: Broker): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      name: broker.name,
      description: broker.description,
      url: `${this.baseUrl}/broker/${broker.slug}`,
      brand: {
        '@type': 'Brand',
        name: broker.name
      },
      provider: {
        '@type': 'Organization',
        name: broker.name,
        url: broker.externalUrl || `${this.baseUrl}/broker/${broker.slug}`,
        foundingDate: broker.established?.toString(),
        address: broker.headquarters ? {
          '@type': 'PostalAddress',
          addressCountry: broker.headquarters
        } : undefined
      },
      aggregateRating: broker.score ? {
        '@type': 'AggregateRating',
        ratingValue: broker.score,
        ratingCount: broker.reviewCount || 100,
        bestRating: 5,
        worstRating: 1
      } : undefined,
      offers: {
        '@type': 'Offer',
        price: broker.accessibility.minDeposit,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString()
      },
      category: 'Forex Broker'
    };
  }

  /**
   * Generate Review schema
   */
  generateReviewSchema(review: {
    reviewRating: number;
    reviewBody: string;
    author: string;
    datePublished: string;
    itemReviewed: {
      name: string;
      type: string;
    };
  }): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.reviewRating,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: review.reviewBody,
      author: {
        '@type': 'Person',
        name: review.author
      },
      datePublished: review.datePublished,
      itemReviewed: {
        '@type': review.itemReviewed.type,
        name: review.itemReviewed.name
      }
    };
  }

  /**
   * Generate comprehensive schema for category pages
   */
  generateCategoryPageSchema(
    config: SEOPageConfig,
    brokers: Broker[],
    breadcrumbs: Array<{ name: string; url: string }>
  ): object[] {
    const schemas = [];

    // Organization schema
    schemas.push(this.generateOrganizationSchema());

    // WebSite schema
    schemas.push(this.generateWebSiteSchema());

    // Breadcrumb schema
    if (breadcrumbs.length > 0) {
      schemas.push(this.generateBreadcrumbSchema(breadcrumbs));
    }

    // Article schema for the category page
    schemas.push(this.generateArticleSchema({
      title: config.title,
      description: config.description,
      url: `${this.baseUrl}${config.path}`,
      keywords: config.highlights
    }));

    // ItemList schema for brokers
    if (brokers.length > 0) {
      schemas.push(this.generateBrokerListSchema(
        brokers,
        config.title,
        config.description
      ));
    }

    // FAQ schema
    if (config.faqs && config.faqs.length > 0) {
      schemas.push(this.generateFAQSchema(config.faqs));
    }

    return schemas;
  }

  /**
   * Generate comprehensive schema for country pages
   */
  generateCountryPageSchema(
    country: {
      name: string;
      slug: string;
      description: string;
    },
    brokers: Broker[],
    breadcrumbs: Array<{ name: string; url: string }>,
    faqs: Array<{ question: string; answer: string }>
  ): object[] {
    const schemas = [];
    const pageUrl = `${this.baseUrl}/best-forex-brokers/${country.slug}`;

    // Organization schema
    schemas.push(this.generateOrganizationSchema());

    // WebSite schema
    schemas.push(this.generateWebSiteSchema());

    // Breadcrumb schema
    if (breadcrumbs.length > 0) {
      schemas.push(this.generateBreadcrumbSchema(breadcrumbs));
    }

    // Article schema for the country page
    schemas.push(this.generateArticleSchema({
      title: `Best Forex Brokers in ${country.name}`,
      description: country.description,
      url: pageUrl,
      keywords: ['forex brokers', country.name.toLowerCase(), 'trading', 'regulation']
    }));

    // ItemList schema for country-specific brokers
    if (brokers.length > 0) {
      schemas.push(this.generateBrokerListSchema(
        brokers,
        `Best Forex Brokers in ${country.name}`,
        `Top-rated forex brokers available to traders in ${country.name}`
      ));
    }

    // FAQ schema
    if (faqs && faqs.length > 0) {
      schemas.push(this.generateFAQSchema(faqs));
    }

    return schemas;
  }

  /**
   * Generate HowTo schema for trading guides
   */
  generateHowToSchema(guide: {
    name: string;
    description: string;
    steps: Array<{
      name: string;
      text: string;
      url?: string;
      image?: string;
    }>;
  }): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: guide.name,
      description: guide.description,
      step: guide.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        url: step.url,
        image: step.image
      }))
    };
  }

  /**
   * Generate Table schema for comparison data
   */
  generateTableSchema(table: {
    caption: string;
    headers: string[];
    rows: string[][];
  }): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Table',
      caption: table.caption,
      tableHeader: table.headers,
      tableBody: table.rows
    };
  }

  /**
   * Combine multiple schemas into a single JSON-LD script
   */
  combineSchemas(schemas: object[]): string {
    if (schemas.length === 1) {
      return JSON.stringify(schemas[0], null, 2);
    }

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemas
    }, null, 2);
  }

  /**
   * Validate schema markup
   */
  validateSchema(schema: object): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!schema['@context']) {
      errors.push('Missing @context property');
    }

    if (!schema['@type']) {
      errors.push('Missing @type property');
    }

    // Type-specific validation
    if (schema['@type'] === 'Organization' && !schema['name']) {
      errors.push('Organization schema missing name property');
    }

    if (schema['@type'] === 'Article' && !schema['headline']) {
      errors.push('Article schema missing headline property');
    }

    // Check for common issues
    if (schema['url'] && typeof schema['url'] !== 'string') {
      warnings.push('URL should be a string');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Singleton instance
export const structuredData = new StructuredDataService({
  baseUrl: 'https://brokeranalysis.com',
  organizationName: 'Broker Analysis',
  organizationLogo: 'https://brokeranalysis.com/logo.png'
});

// React component for injecting structured data
export function StructuredDataHead({ schemas }: { schemas: object[] }) {
  const combinedSchema = structuredData.combineSchemas(schemas);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: combinedSchema }}
    />
  );
}

// Utility functions
export const SchemaUtils = {
  /**
   * Generate all schemas for a category page
   */
  forCategoryPage: (
    config: SEOPageConfig,
    brokers: Broker[],
    breadcrumbs: Array<{ name: string; url: string }>
  ) => structuredData.generateCategoryPageSchema(config, brokers, breadcrumbs),

  /**
   * Generate all schemas for a country page
   */
  forCountryPage: (
    country: { name: string; slug: string; description: string },
    brokers: Broker[],
    breadcrumbs: Array<{ name: string; url: string }>,
    faqs: Array<{ question: string; answer: string }>
  ) => structuredData.generateCountryPageSchema(country, brokers, breadcrumbs, faqs),

  /**
   * Generate all schemas for a broker page
   */
  forBrokerPage: (broker: Broker) => [
    structuredData.generateOrganizationSchema(),
    structuredData.generateBrokerProductSchema(broker)
  ],

  /**
   * Validate and combine schemas
   */
  validateAndCombine: (schemas: object[]) => {
    const validSchemas = schemas.filter(schema => {
      const validation = structuredData.validateSchema(schema);
      if (!validation.valid) {
        console.warn('Invalid schema:', validation.errors);
      }
      return validation.valid;
    });

    return structuredData.combineSchemas(validSchemas);
  }
};