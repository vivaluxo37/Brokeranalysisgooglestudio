import React from 'react';
import { FAQItem } from '../../utils/contentGenerators';

interface FaqSchemaProps {
  faqs: FAQItem[];
  countryName: string;
}

/**
 * FAQ Schema Component
 * Generates schema.org FAQPage structured data for SEO
 */
const FaqSchema: React.FC<FaqSchemaProps> = ({ faqs, countryName }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    })),
    'about': {
      '@type': 'FinancialService',
      'name': `Forex Trading in ${countryName}`,
      'serviceType': 'Forex Brokerage'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default FaqSchema;