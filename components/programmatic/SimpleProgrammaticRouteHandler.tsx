/**
 * Simple Programmatic Route Handler
 *
 * A simplified version that uses local seed data to demonstrate programmatic SEO functionality.
 * This component handles different URL patterns and generates appropriate content.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getCountryByCode, getCategoryBySlug, getStrategyBySlug, getFeatureBySlug, generateTitle, generateMetaDescription, generateKeywords } from '../../data/programmatic-data-utils';
import LoadingSpinner from '../ui/LoadingSpinner';

interface SimpleProgrammaticRouteHandlerProps {
  fallback?: React.ComponentType;
}

interface PageData {
  title: string;
  description: string;
  content: string;
  keywords: string[];
  metaTitle: string;
  metaDescription: string;
  structuredData: Record<string, any>;
  pageType: string;
  country?: any;
  category?: any;
  strategy?: any;
  feature?: any;
}

export const SimpleProgrammaticRouteHandler: React.FC<SimpleProgrammaticRouteHandlerProps> = ({
  fallback: FallbackComponent
}) => {
  const location = useLocation();
  const params = useParams();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generatePageData = async () => {
      try {
        setLoading(true);
        setError(null);

        const pathname = location.pathname;
        console.log('🔄 Processing route:', pathname);

        // Parse the URL to determine page type
        const segments = pathname.split('/').filter(Boolean);
        console.log('📋 URL segments:', segments);

        let pageType = '';
        let country = null;
        let category = null;
        let strategy = null;
        let feature = null;

        // Determine page type based on URL pattern
        if (segments.length === 2) {
          const [first, second] = segments;

          // Check if it's category-country (e.g., /forex/us, /crypto/gb)
          const categoryCandidate = getCategoryBySlug(first);
          const countryCandidate = getCountryByCode(second);

          if (categoryCandidate && countryCandidate) {
            pageType = 'category_country';
            category = categoryCandidate;
            country = countryCandidate;
          }
        } else if (segments.length === 3) {
          const [first, second, third] = segments;

          // Check if it's category/strategy (e.g., /forex/strategy/scalping)
          if (second === 'strategy') {
            pageType = 'strategy';
            category = getCategoryBySlug(first);
            strategy = getStrategyBySlug(third);
          }
          // Check if it's category/feature (e.g., /forex/feature/leverage)
          else if (second === 'feature') {
            pageType = 'feature';
            category = getCategoryBySlug(first);
            feature = getFeatureBySlug(third);
          }
        } else if (segments.length === 2 && segments[0] === 'country') {
          // Check if it's country/trading (e.g., /country/trading/us)
          pageType = 'country';
          country = getCountryByCode(segments[1]);
        }

        if (!pageType) {
          setError('Page not found');
          setLoading(false);
          return;
        }

        console.log(`✅ Detected ${pageType} page:`, {
          country: country?.name,
          category: category?.name,
          strategy: strategy?.name,
          feature: feature?.name
        });

        // Generate page content
        const content = generateContent(pageType, { country, category, strategy, feature });
        setPageData(content);

      } catch (error) {
        console.error('❌ Error generating page data:', error);
        setError('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };

    generatePageData();
  }, [location.pathname, params]);

  const generateContent = (pageType: string, { country, category, strategy, feature }: any): PageData => {
    // Get template for this page type
    const templates = {
      category_country: {
        title_template: '{category} Trading in {country} | Best Brokers 2025',
        meta_description_template: 'Find the best {category} brokers in {country}. Compare platforms, learn regulations, and start trading {category} safely.',
        structured_data_template: {
          "@type": "Article",
          "headline": "{category} Trading in {country}",
          "description": "Complete guide to {category} trading in {country}"
        }
      },
      strategy: {
        title_template: '{strategy} Strategy Guide | How to Trade {strategy}',
        meta_description_template: 'Master the {strategy} trading strategy. Learn entry/exit signals, risk management, and practical examples.',
        structured_data_template: {
          "@type": "Article",
          "headline": "{strategy} Trading Strategy",
          "description": "Complete guide to {strategy} trading strategy"
        }
      },
      feature: {
        title_template: '{feature} in Trading | What You Need to Know',
        meta_description_template: 'Understanding {feature} in trading. Compare broker offerings, learn best practices, and make informed decisions.',
        structured_data_template: {
          "@type": "Article",
          "headline": "{feature} in Trading",
          "description": "Complete guide to {feature} in trading"
        }
      },
      country: {
        title_template: 'Forex Trading in {country} | Complete Guide 2025',
        meta_description_template: 'Everything you need to know about forex trading in {country}. Find regulated brokers and start trading safely.',
        structured_data_template: {
          "@type": "Article",
          "headline": "Forex Trading in {country}",
          "description": "Complete guide to forex trading in {country}"
        }
      }
    };

    const template = templates[pageType] || templates.category_country;

    // Generate title and meta description
    const title = generateTitle(template, category?.slug, country?.code, strategy?.slug, feature?.slug);
    const metaDescription = generateMetaDescription(template, category?.slug, country?.code, strategy?.slug, feature?.slug);
    const keywords = generateKeywords(category?.slug, country?.code, strategy?.slug, feature?.slug);

    // Generate structured data
    const structuredData = { ...template.structured_data_template };
    if (country) {
      structuredData.headline = structuredData.headline.replace(/{country}/g, country.name);
      structuredData.description = structuredData.description.replace(/{country}/g, country.name);
    }
    if (category) {
      structuredData.headline = structuredData.headline.replace(/{category}/g, category.name);
      structuredData.description = structuredData.description.replace(/{category}/g, category.name);
    }

    // Generate page content
    const content = generatePageContent(pageType, { country, category, strategy, feature });

    return {
      title,
      description: metaDescription,
      content,
      keywords,
      metaTitle: title,
      metaDescription,
      structuredData,
      pageType,
      country,
      category,
      strategy,
      feature
    };
  };

  const generatePageContent = (pageType: string, { country, category, strategy, feature }: any): string => {
    let content = '';

    switch (pageType) {
      case 'category_country':
        content = `
          <h1>${category?.name} Trading in ${country?.name}</h1>

          <p>Welcome to your comprehensive guide to ${category?.name} trading in ${country?.name}.
          This page covers everything you need to know about ${category?.name} trading,
          from regulations to top broker recommendations.</p>

          <h2>Legal and Regulatory Landscape</h2>
          <p>In ${country?.name}, ${category?.name} trading is regulated by ${country?.regulatory_authority}.
          This ensures that traders are protected and that brokers maintain high standards of service.</p>

          <h2>Top ${category?.name} Brokers in ${country?.name}</h2>
          <p>We've analyzed the best ${category?.name} brokers that accept traders from ${country?.name}.
          Each broker has been thoroughly vetted for security, reliability, and trading conditions.</p>

          <h2>Trading Conditions</h2>
          <ul>
            <li>Currency: ${country?.currency}</li>
            <li>Primary languages: ${country?.languages?.join(', ')}</li>
            <li>Regulatory authority: ${country?.regulatory_authority}</li>
            <li>Trading popularity: #${country?.trading_popularity} globally</li>
          </ul>

          <h2>Getting Started</h2>
          <p>To start ${category?.name} trading in ${country?.name}, you'll need to:</p>
          <ol>
            <li>Choose a regulated broker from our recommendations</li>
            <li>Complete the account verification process</li>
            <li>Fund your account using available payment methods</li>
            <li>Start with a demo account to practice</li>
            <li>Begin live trading with a small amount</li>
          </ol>

          <h2>Frequently Asked Questions</h2>
          <p><strong>Is ${category?.name} trading legal in ${country?.name}?</strong></p>
          <p>Yes, ${category?.name} trading is legal in ${country?.name} when done through regulated brokers.</p>

          <p><strong>What payment methods are available?</strong></p>
          <p>Most brokers offer bank transfers, credit cards, and popular e-wallets for ${country?.name} traders.</p>
        `;
        break;

      case 'strategy':
        content = `
          <h1>${strategy?.name} Trading Strategy Guide</h1>

          <p>Master the ${strategy?.name} trading strategy with our comprehensive guide.
          This strategy is suitable for ${strategy?.difficulty} level traders looking to
          improve their trading performance.</p>

          <h2>What is ${strategy?.name}?</h2>
          <p>${strategy?.description}</p>

          <h2>How It Works</h2>
          <p>The ${strategy?.name} strategy involves specific techniques and approaches
          that traders can use to identify trading opportunities and manage risk effectively.</p>

          <h2>Key Components</h2>
          <ul>
            <li>Entry and exit signals</li>
            <li>Risk management rules</li>
            <li>Position sizing guidelines</li>
            <li>Market analysis techniques</li>
          </ul>

          <h2>Best Practices</h2>
          <p>To successfully implement the ${strategy?.name} strategy, follow these best practices:</p>
          <ul>
            <li>Practice on a demo account first</li>
            <li>Start with small position sizes</li>
            <li>Keep detailed trading records</li>
            <li>Continuously educate yourself</li>
          </ul>
        `;
        break;

      case 'feature':
        content = `
          <h1>${feature?.name} in Trading</h1>

          <p>Understanding ${feature?.name} is essential for successful trading.
          This feature is considered ${feature?.importance} importance for traders.</p>

          <h2>What is ${feature?.name}?</h2>
          <p>${feature?.description}</p>

          <h2>Why It Matters</h2>
          <p>${feature?.name} plays a crucial role in trading success by:</p>
          <ul>
            <li>Enabling better trading decisions</li>
            <li>Providing market access</li>
            <li>Managing trading risks</li>
            <li>Improving overall trading experience</li>
          </ul>

          <h2>What to Look For</h2>
          <p>When evaluating ${feature?.name} in trading platforms, consider:</p>
          <ul>
            <li>Reliability and stability</li>
            <li>Cost effectiveness</li>
            <li>User-friendliness</li>
            <li>Customer support quality</li>
          </ul>
        `;
        break;

      case 'country':
        content = `
          <h1>Forex Trading in ${country?.name}</h1>

          <p>Complete guide to forex trading in ${country?.name}.
          Learn about regulations, top brokers, and how to start trading safely.</p>

          <h2>Regulatory Environment</h2>
          <p>Forex trading in ${country?.name} is regulated by ${country?.regulatory_authority},
          ensuring trader protection and market integrity.</p>

          <h2>Market Overview</h2>
          <p>${country?.name} is ranked #${country?.trading_popularity} globally for forex trading activity,
          with a strong trader community and advanced trading infrastructure.</p>

          <h2>Local Considerations</h2>
          <ul>
            <li>Currency: ${country?.currency}</li>
            <li>Primary languages: ${country?.languages?.join(', ')}</li>
            <li>Timezone: ${country?.region}</li>
            <li>Payment preferences: Local banking methods</li>
          </ul>
        `;
        break;

      default:
        content = '<h1>Page Content</h1><p>Programmatic content will be generated here.</p>';
    }

    return content;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested page could not be found.'}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Render a simple page template with the generated content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with structured data */}
      <script type="application/ld+json">
        {JSON.stringify(pageData.structuredData)}
      </script>

      <main className="container mx-auto px-4 py-8">
        {/* SEO Meta Tags - in production these would be in the document head */}
        <div className="hidden" data-seo-title={pageData.metaTitle} data-seo-description={pageData.metaDescription}>
          {pageData.keywords.map((keyword, index) => (
            <span key={index} data-seo-keyword={keyword} />
          ))}
        </div>

        {/* Page Header */}
        <header className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageData.title}</h1>
          <p className="text-lg text-gray-600">{pageData.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {pageData.keywords.map((keyword, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </header>

        {/* Page Content */}
        <article className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        </article>

        {/* Page Information */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Page Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Page Type:</span>
              <span className="ml-2 capitalize">{pageData.pageType.replace('_', ' ')}</span>
            </div>
            {pageData.country && (
              <div>
                <span className="font-semibold">Country:</span>
                <span className="ml-2">{pageData.country.name}</span>
              </div>
            )}
            {pageData.category && (
              <div>
                <span className="font-semibold">Category:</span>
                <span className="ml-2">{pageData.category.name}</span>
              </div>
            )}
            {pageData.strategy && (
              <div>
                <span className="font-semibold">Strategy:</span>
                <span className="ml-2">{pageData.strategy.name}</span>
              </div>
            )}
            {pageData.feature && (
              <div>
                <span className="font-semibold">Feature:</span>
                <span className="ml-2">{pageData.feature.name}</span>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500">
              This page was generated programmatically using AI-powered content creation.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SimpleProgrammaticRouteHandler;