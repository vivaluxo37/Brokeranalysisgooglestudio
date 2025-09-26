import React from 'react';
import MetaTags from '../common/MetaTags';
import JsonLdSchema, {
  createOrganizationSchema,
  createWebsiteSchema,
  createBrokerSchema,
  createArticleSchema,
  createBreadcrumbSchema,
  createFAQSchema,
  createProductSchema
} from '../common/JsonLdSchema';

interface SEOContainerProps {
  type: 'home' | 'broker' | 'article' | 'category' | 'comparison' | 'tools';
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
  data?: any;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  keywords?: string[];
  publishDate?: string;
  modifiedDate?: string;
  author?: string;
  noIndex?: boolean;
}

const SEOContainer: React.FC<SEOContainerProps> = ({
  type,
  title,
  description,
  canonicalUrl,
  imageUrl,
  data,
  breadcrumbs,
  faqs,
  keywords = [],
  publishDate,
  modifiedDate,
  author,
  noIndex = false
}) => {
  // Generate structured data based on page type
  const getStructuredData = () => {
    const schemas = [];

    // Always include organization and website schemas
    schemas.push(createOrganizationSchema());
    schemas.push(createWebsiteSchema());

    switch (type) {
      case 'broker':
        if (data) {
          schemas.push(createBrokerSchema(data, canonicalUrl));
          schemas.push(createProductSchema(data, canonicalUrl));
        }
        break;
      case 'article':
        if (data) {
          schemas.push(createArticleSchema(data, canonicalUrl));
        }
        break;
    }

    // Add breadcrumb schema if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push(createBreadcrumbSchema(breadcrumbs));
    }

    // Add FAQ schema if provided
    if (faqs && faqs.length > 0) {
      schemas.push(createFAQSchema(faqs));
    }

    return schemas;
  };

  const structuredData = getStructuredData();

  // Determine content type for meta tags
  const getContentType = () => {
    switch (type) {
      case 'broker': return 'broker';
      case 'article': return 'article';
      case 'comparison': return 'website';
      case 'tools': return 'website';
      default: return 'website';
    }
  };

  // Generate default keywords based on type and data
  const getDefaultKeywords = () => {
    const baseKeywords = ['forex broker', 'trading', 'broker comparison'];

    switch (type) {
      case 'broker':
        return [
          ...baseKeywords,
          `${data?.name || 'forex broker'} review`,
          `${data?.name || 'broker'} trading`,
          'forex trading account',
          'online broker',
          'currency trading'
        ];
      case 'article':
        return [
          ...baseKeywords,
          'forex trading guide',
          'trading education',
          'market analysis',
          'trading strategies',
          'forex tips'
        ];
      case 'comparison':
        return [
          ...baseKeywords,
          'broker comparison',
          'compare forex brokers',
          'best forex brokers',
          'broker reviews',
          'trading platforms'
        ];
      case 'tools':
        return [
          ...baseKeywords,
          'trading tools',
          'forex calculators',
          'trading calculator',
          'market analysis tools',
          'trading resources'
        ];
      default:
        return baseKeywords;
    }
  };

  const allKeywords = keywords.length > 0 ? keywords : getDefaultKeywords();

  return (
    <>
      <MetaTags
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        imageUrl={imageUrl}
        type={getContentType()}
        keywords={allKeywords}
        publishDate={publishDate}
        modifiedDate={modifiedDate}
        author={author}
        noIndex={noIndex}
        breadcrumbs={breadcrumbs}
      />

      {structuredData.map((schema, index) => (
        <JsonLdSchema
          key={index}
          data={schema}
          type={type}
          id={`${type}-${index}`}
        />
      ))}
    </>
  );
};

export default SEOContainer;