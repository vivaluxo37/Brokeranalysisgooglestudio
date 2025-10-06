import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BreadcrumbListSchema, StructuredDataGenerator, SchemaHelpers } from '../../lib/structuredData';

interface BreadcrumbSchemaProps {
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>;
  currentPage?: {
    name: string;
    url: string;
  };
}

const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ 
  breadcrumbs, 
  currentPage 
}) => {
  // Create the full breadcrumb list including current page if provided
  const fullBreadcrumbs = currentPage 
    ? [...breadcrumbs, currentPage]
    : breadcrumbs;

  // Create breadcrumb schema
  const breadcrumbSchema: BreadcrumbListSchema = SchemaHelpers.createBreadcrumbList(fullBreadcrumbs);

  // Generate JSON-LD
  const jsonLd = StructuredDataGenerator.generateJsonLd(breadcrumbSchema);

  return (
    <Helmet>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
    </Helmet>
  );
};

export default BreadcrumbSchema;