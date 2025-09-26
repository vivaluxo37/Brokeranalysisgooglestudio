
import React, { useEffect } from 'react';

const SCRIPT_ID = 'json-ld-schema';

interface JsonLdSchemaProps {
  data: Record<string, any>;
  type?: 'organization' | 'website' | 'broker' | 'article' | 'breadcrumb' | 'faq' | 'product';
  id?: string;
}

const JsonLdSchema: React.FC<JsonLdSchemaProps> = ({ data, type = 'website', id }) => {
  useEffect(() => {
    const scriptId = id ? `${SCRIPT_ID}-${id}` : SCRIPT_ID;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    // Create script if it doesn't exist
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    // Set the content with proper formatting
    script.innerHTML = JSON.stringify(data, null, 2);

    // Cleanup on unmount for SPA navigation
    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, [data, type, id]);

  return null; // This component does not render any visible elements
};

// Helper functions for creating structured data
export const createOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BrokerAnalysis',
  url: 'https://brokeranalysis.com',
  logo: 'https://brokeranalysis.com/logo.png',
  description: 'AI-driven forex broker comparison and research platform',
  foundingDate: '2023',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Global',
    addressCountry: 'Worldwide'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: 'English'
  },
  sameAs: [
    'https://twitter.com/brokeranalysis',
    'https://linkedin.com/company/brokeranalysis'
  ]
});

export const createWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BrokerAnalysis',
  url: 'https://brokeranalysis.com',
  description: 'AI-driven forex broker comparison and research platform',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://brokeranalysis.com/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  },
  publisher: {
    '@type': 'Organization',
    name: 'BrokerAnalysis',
    logo: {
      '@type': 'ImageObject',
      url: 'https://brokeranalysis.com/logo.png'
    }
  }
});

export const createBrokerSchema = (broker: any, url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: broker.name,
  url: url,
  description: broker.description,
  image: broker.logoUrl,
  telephone: broker.customerSupport?.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: broker.headquarters?.split(', ')[0],
    addressCountry: broker.headquarters?.split(', ').pop()
  },
  aggregateRating: broker.score ? {
    '@type': 'AggregateRating',
    ratingValue: broker.score,
    ratingCount: 100,
    bestRating: 10,
    worstRating: 1
  } : undefined,
  serviceType: 'Forex Trading',
  provider: {
    '@type': 'Organization',
    name: broker.name,
    foundingDate: broker.foundingYear?.toString()
  },
  areaServed: 'Worldwide',
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: broker.websiteUrl,
    serviceLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'Global'
      }
    }
  }
});

export const createArticleSchema = (article: any, url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.metaDescription || article.summary,
  image: article.imageUrl,
  url: url,
  datePublished: article.publishDate,
  dateModified: article.modifiedDate || article.publishDate,
  author: {
    '@type': 'Person',
    name: article.author?.name || 'BrokerAnalysis Team',
    url: article.author?.url
  },
  publisher: {
    '@type': 'Organization',
    name: 'BrokerAnalysis',
    logo: {
      '@type': 'ImageObject',
      url: 'https://brokeranalysis.com/logo.png'
    }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': url
  },
  articleSection: 'Forex Trading',
  wordCount: article.wordCount || 1000,
  keywords: article.keywords?.join(', '),
  inLanguage: 'en-US'
});

export const createBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url
  }))
});

export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
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
});

export const createProductSchema = (broker: any, url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: `${broker.name} Forex Trading Account`,
  description: broker.description,
  url: url,
  image: broker.logoUrl,
  brand: {
    '@type': 'Brand',
    name: broker.name
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: broker.name
    }
  },
  aggregateRating: broker.score ? {
    '@type': 'AggregateRating',
    ratingValue: broker.score,
    ratingCount: 100,
    bestRating: 10,
    worstRating: 1
  } : undefined,
  review: broker.reviews?.map((review: any) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author
    },
    datePublished: review.date,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1
    },
    reviewBody: review.content
  }))
});

export const createWebPageSchema = (options: {
  title: string;
  description: string;
  url: string;
  lastModified: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: options.title,
  description: options.description,
  url: options.url,
  dateModified: options.lastModified,
  mainEntity: {
    '@type': 'Article',
    headline: options.title,
    description: options.description,
    dateModified: options.lastModified
  },
  breadcrumb: options.breadcrumbs ? {
    '@type': 'BreadcrumbList',
    itemListElement: options.breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  } : undefined
});

export const createHowToSchema = (options: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; url?: string }>;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: options.name,
  description: options.description,
  step: options.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
    url: step.url
  }))
});

export default JsonLdSchema;
