import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from '../../components/seo/HelmetAsync';
import { supabase } from '../lib/supabase';
import { getContentGenerator, type ContentTemplate, type BrokerSummary } from '../lib/contentGeneration';
import { getBrokerRanking } from '../lib/brokerRanking';
import { getCached, setCached } from '../lib/cache';
import BrokerCard from '../components/BrokerCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface CategoryPageData {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon?: string;
    color?: string;
  };
  brokers: any[];
  rankedBrokers: any[];
  content: ContentTemplate;
}

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [data, setData] = useState<CategoryPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categorySlug) {
      loadCategoryData(categorySlug);
    }
  }, [categorySlug]);

  const loadCategoryData = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);

      const cacheKey = `category-page-${slug}`;
      
      // Try to get from cache first
      const cached = await getCached<CategoryPageData>(cacheKey);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      // Fetch category info
      const { data: category, error: categoryError } = await supabase
        .from('broker_categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (categoryError || !category) {
        throw new Error(`Category not found: ${slug}`);
      }

      // Fetch brokers for this category
      const { data: brokerIds, error: mappingError } = await supabase
        .from('broker_category_map')
        .select('broker_id')
        .eq('category_id', category.id);

      if (mappingError) {
        throw new Error('Failed to fetch category mappings');
      }

      if (!brokerIds || brokerIds.length === 0) {
        // Set empty data
        const emptyData: CategoryPageData = {
          category,
          brokers: [],
          rankedBrokers: [],
          content: await generateEmptyContent(category.name, slug)
        };
        setData(emptyData);
        setLoading(false);
        return;
      }

      // Fetch broker details
      const { data: brokers, error: brokersError } = await supabase
        .from('brokers')
        .select('*')
        .in('id', brokerIds.map(b => b.broker_id));

      if (brokersError) {
        throw new Error('Failed to fetch brokers');
      }

      // Rank brokers for this category
      const rankedBrokers = await getBrokerRanking(brokers || [], {
        categoryId: category.id,
        limit: 50
      });

      // Convert to BrokerSummary format for content generation
      const brokerSummaries: BrokerSummary[] = rankedBrokers.map(broker => ({
        name: broker.name,
        rating: broker.rating || 8.0,
        minDeposit: broker.min_deposit || 100,
        regulation: broker.regulation || 'International',
        keyFeatures: [
          broker.platforms?.split(',')[0] || 'Trading Platform',
          `Min Deposit: $${broker.min_deposit || 100}`,
          broker.account_types?.split(',')[0] || 'Standard Account'
        ].filter(Boolean)
      }));

      // Generate content
      const contentGenerator = getContentGenerator();
      const content = await contentGenerator.generateCategoryContent(slug, brokerSummaries);

      const categoryData: CategoryPageData = {
        category,
        brokers: brokers || [],
        rankedBrokers,
        content
      };

      // Cache the result
      await setCached(cacheKey, categoryData, 3600); // Cache for 1 hour

      setData(categoryData);
    } catch (err) {
      console.error('Error loading category data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  const generateEmptyContent = async (categoryName: string, slug: string): Promise<ContentTemplate> => {
    return {
      h1: `Best ${categoryName} 2025`,
      intro: `Looking for the best ${categoryName.toLowerCase()} in 2025? We're currently updating our analysis of top-rated brokers in this category. Check back soon for comprehensive reviews and comparisons.`,
      faqs: [
        {
          id: 'what-are',
          question: `What are ${categoryName}?`,
          answer: `${categoryName} are specialized trading platforms that offer specific features and conditions tailored to different trading styles and requirements.`
        },
        {
          id: 'how-to-choose',
          question: `How to choose the right ${categoryName.toLowerCase().slice(0, -1)}?`,
          answer: 'When choosing a broker, consider regulatory compliance, trading costs, platform features, customer support quality, and available trading instruments.'
        }
      ],
      metaDescription: `Best ${categoryName} 2025: Expert analysis and comparison of top-rated brokers. Find the perfect platform for your trading needs.`,
      keywords: [`best ${categoryName.toLowerCase()}`, `${categoryName.toLowerCase()} 2025`, slug.replace(/-/g, ' ')]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested category could not be found.'}</p>
          <Link
            to="/best-brokers"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  const { category, rankedBrokers, content } = data;

  // Generate JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": content.h1,
    "description": content.metaDescription,
    "url": `${window.location.origin}/best-brokers/${category.slug}`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Best Brokers",
          "item": `${window.location.origin}/best-brokers`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": category.name
        }
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": `Best ${category.name}`,
      "description": content.intro,
      "numberOfItems": rankedBrokers.length,
      "itemListElement": rankedBrokers.slice(0, 10).map((broker, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "FinancialProduct",
          "name": broker.name,
          "description": broker.description || `${broker.name} forex broker`,
          "url": broker.website,
          "provider": {
            "@type": "Organization",
            "name": broker.name
          },
          "aggregateRating": broker.rating ? {
            "@type": "AggregateRating",
            "ratingValue": broker.rating,
            "bestRating": 10,
            "worstRating": 1
          } : undefined
        }
      }))
    }
  };

  // Generate FAQ structured data
  const faqStructuredData = content.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{content.h1}</title>
        <meta name="description" content={content.metaDescription} />
        <meta name="keywords" content={content.keywords.join(', ')} />
        <link rel="canonical" href={`${window.location.origin}/best-brokers/${category.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={content.h1} />
        <meta property="og:description" content={content.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/best-brokers/${category.slug}`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.h1} />
        <meta name="twitter:description" content={content.metaDescription} />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        {faqStructuredData && (
          <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
        )}
      </Helmet>

      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/best-brokers" className="text-blue-600 hover:text-blue-800">
              Best Brokers
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{category.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          {category.icon && (
            <div className="flex justify-center mb-4">
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl text-white"
                style={{ backgroundColor: category.color || '#3B82F6' }}
              >
                {category.icon}
              </div>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.h1}
          </h1>
          <div className="max-w-4xl mx-auto text-lg text-gray-600 leading-relaxed">
            {content.intro}
          </div>
        </div>

        {/* Broker Results */}
        {rankedBrokers.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Top {category.name} ({rankedBrokers.length} brokers)
              </h2>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Comparison Table Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Broker
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Min Deposit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Regulation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Platform
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rankedBrokers.slice(0, 10).map((broker, index) => (
                      <tr key={broker.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {broker.logo_url && (
                              <img 
                                className="h-8 w-8 rounded-full mr-3" 
                                src={broker.logo_url} 
                                alt={`${broker.name} logo`}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div className="text-sm font-medium text-gray-900">
                              {broker.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {broker.rating ? broker.rating.toFixed(1) : 'N/A'}
                            </span>
                            {broker.rating && (
                              <span className="text-xs text-gray-500 ml-1">/10</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${broker.min_deposit || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {broker.regulation || 'International'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {broker.platforms?.split(',')[0] || 'Web Platform'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detailed Broker Cards */}
            <div className="grid gap-6 lg:gap-8">
              {rankedBrokers.map((broker, index) => (
                <div key={broker.id} className="relative">
                  {index < 3 && (
                    <div className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full z-10">
                      #{index + 1} BEST
                    </div>
                  )}
                  <BrokerCard 
                    broker={broker} 
                    showRanking={true}
                    ranking={index + 1}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No brokers found</h3>
            <p className="text-gray-600">
              We're currently updating our analysis for this category. Check back soon!
            </p>
          </div>
        )}

        {/* FAQ Section */}
        {content.faqs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {content.faqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Trading?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Compare all features, read detailed reviews, and choose the perfect {category.name.toLowerCase().slice(0, -1)} for your trading strategy.
            </p>
            <Link
              to="/best-brokers"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Compare All Brokers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
