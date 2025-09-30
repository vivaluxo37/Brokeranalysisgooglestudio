import React from 'react';

interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  countryName: string;
  countryFlag: string;
  datePublished?: string;
  dateModified?: string;
}

/**
 * Article Schema Component
 * Generates schema.org Article structured data for country pages
 */
const ArticleSchema: React.FC<ArticleSchemaProps> = ({
  title,
  description,
  url,
  countryName,
  countryFlag,
  datePublished,
  dateModified
}) => {
  const currentDate = new Date().toISOString();
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': title,
    'description': description,
    'url': url,
    'datePublished': datePublished || currentDate,
    'dateModified': dateModified || currentDate,
    'author': {
      '@type': 'Organization',
      'name': 'Broker Analysis',
      'url': 'https://brokeranalysis.com'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Broker Analysis',
      'url': 'https://brokeranalysis.com',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://brokeranalysis.com/logo.png'
      }
    },
    'about': {
      '@type': 'Place',
      'name': countryName,
      'additionalType': 'Country'
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': url
    },
    'image': {
      '@type': 'ImageObject',
      'url': `https://brokeranalysis.com/images/countries/${countryName.toLowerCase().replace(/\s+/g, '-')}-brokers.jpg`,
      'width': 1200,
      'height': 630
    },
    'articleSection': 'Forex Trading',
    'keywords': `forex brokers ${countryName}, ${countryName} forex trading, best brokers ${countryName}, forex trading guide`,
    'inLanguage': 'en-US'
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default ArticleSchema;