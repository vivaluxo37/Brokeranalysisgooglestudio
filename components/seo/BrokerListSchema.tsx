import React from 'react';
import { Broker } from '../../types';

interface BrokerListSchemaProps {
  brokers: Broker[];
  countryName: string;
  url: string;
}

/**
 * Broker List Schema Component
 * Generates schema.org ItemList structured data for broker listings
 */
const BrokerListSchema: React.FC<BrokerListSchemaProps> = ({
  brokers,
  countryName,
  url
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `Best Forex Brokers in ${countryName}`,
    'description': `Curated list of top ${brokers.length} forex brokers accepting clients from ${countryName}`,
    'url': url,
    'numberOfItems': brokers.length,
    'itemListElement': brokers.map((broker, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'FinancialService',
        '@id': `https://brokeranalysis.com/broker/${broker.id}`,
        'name': broker.name,
        'description': broker.description,
        'url': broker.websiteUrl,
        'image': broker.logoUrl,
        'aggregateRating': broker.score ? {
          '@type': 'AggregateRating',
          'ratingValue': broker.score,
          'bestRating': 10,
          'worstRating': 0
        } : undefined,
        'serviceType': 'Forex Brokerage',
        'areaServed': {
          '@type': 'Place',
          'name': countryName
        },
        'offers': broker.accessibility?.minDeposit !== undefined ? {
          '@type': 'Offer',
          'price': broker.accessibility.minDeposit,
          'priceCurrency': 'USD',
          'description': `Minimum deposit: $${broker.accessibility.minDeposit}`
        } : undefined,
        'additionalType': broker.coreInfo?.brokerType || 'Forex Broker'
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default BrokerListSchema;