/**
 * Programmatic Page Template
 * 
 * This component renders the template for all programmatic SEO pages. It provides
 * a consistent layout structure while adapting the content based on page type
 * and data.
 */

import React from 'react';
import { Helmet } from '../seo/HelmetAsync';
import { PageDetectionResult } from '../../lib/programmatic/pageTypeDetector';
import { ProgrammaticBreadcrumbs } from './ProgrammaticRouteHandler';
import ComparisonTable from '../brokers/ComparisonTable';
import { FAQSection } from '../ui/FAQSection';
import { RelatedPages } from '../ui/RelatedPages';
import { StructuredData } from '../seo/StructuredData';

interface ProgrammaticPageTemplateProps {
  pageDetection: PageDetectionResult;
  pageData: {
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
  };
}

export const ProgrammaticPageTemplate: React.FC<ProgrammaticPageTemplateProps> = ({
  pageDetection,
  pageData
}) => {
  const renderHeroSection = () => {
    return (
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {pageData.title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              {pageData.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Compare Brokers
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderContentSection = () => {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="prose prose-lg max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: formatContent(pageData.content) 
                    }} 
                  />
                </div>

                {/* FAQs Section */}
                {pageData.faqs && pageData.faqs.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                    <FAQSection faqs={pageData.faqs} />
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  {/* Quick Comparison */}
                  {pageData.comparison && pageData.comparison.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">Quick Comparison</h3>
                      <div className="space-y-3">
                        {pageData.comparison.map((item, index) => (
                          <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                            <div className="font-semibold text-gray-900">{item.feature}</div>
                            <div className="text-gray-600">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Features */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Regulated brokers
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Competitive spreads
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Fast execution
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        24/7 support
                      </li>
                    </ul>
                  </div>

                  {/* Page Info */}
                  <div className="bg-gray-100 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Page Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Page Type:</span>
                        <span className="font-semibold capitalize">{pageData.analytics.pageType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Content Quality:</span>
                        <span className="font-semibold">
                          {Math.round(pageData.analytics.contentQuality * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-semibold">
                          {new Date(pageData.analytics.generatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderBrokersSection = () => {
    if (!pageData.brokers || pageData.brokers.length === 0) {
      return null;
    }

    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Recommended {pageDetection.type === 'category' ? 
                pageDetection.params.categorySlug : 
                pageDetection.type === 'country' ? 
                pageDetection.params.countryName : 
                'Trading'} Brokers
            </h2>
            <ComparisonTable brokers={pageData.brokers} />
            
            <div className="text-center mt-12">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                View All Brokers
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderRelatedPagesSection = () => {
    if (!pageData.relatedPages || pageData.relatedPages.length === 0) {
      return null;
    }

    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Related Pages</h2>
            <RelatedPages pages={pageData.relatedPages} />
          </div>
        </div>
      </section>
    );
  };

  const formatContent = (content: string): string => {
    // Convert newlines to paragraphs
    return content
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.trim() === '') return '';
        
        // Check if it's a heading
        if (paragraph.match(/^#+\s/)) {
          const level = paragraph.match(/^#+/)?.[0].length || 1;
          const text = paragraph.replace(/^#+\s/, '');
          return `<h${Math.min(level, 3)} class="text-2xl font-bold mt-8 mb-4">${text}</h${Math.min(level, 3)}>`;
        }
        
        // Check if it's a list item
        if (paragraph.match(/^\d+\.\s/)) {
          return `<li class="ml-6 mb-2">${paragraph.replace(/^\d+\.\s/, '')}</li>`;
        }
        
        // Regular paragraph
        return `<p class="mb-6">${paragraph}</p>`;
      })
      .join('\n');
  };

  return (
    <>
      <Helmet>
        <title>{pageData.title}</title>
        <meta name="description" content={pageData.description} />
        <meta name="keywords" content={pageData.meta.keywords.join(', ')} />
        <link rel="canonical" href={pageData.meta.canonical} />
        <meta name="robots" content={pageData.meta.robots} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={pageData.title} />
        <meta property="og:description" content={pageData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageData.meta.canonical} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageData.title} />
        <meta name="twitter:description" content={pageData.description} />
      </Helmet>

      <StructuredData data={pageData.meta.structuredData} />

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <ProgrammaticBreadcrumbs pageDetection={pageDetection} />
        </div>
      </div>

      {/* Hero Section */}
      {renderHeroSection()}

      {/* Content Section */}
      {renderContentSection()}

      {/* Brokers Section */}
      {renderBrokersSection()}

      {/* Related Pages Section */}
      {renderRelatedPagesSection()}

      {/* Analytics (hidden) */}
      <div 
        className="hidden"
        data-page-type={pageData.analytics.pageType}
        data-category={pageData.analytics.category}
        data-country={pageData.analytics.country}
        data-content-quality={pageData.analytics.contentQuality}
        data-generated-at={pageData.analytics.generatedAt}
      />
    </>
  );
};

export default ProgrammaticPageTemplate;