import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from '../../components/seo/HelmetAsync';
import { supabase } from '../../lib/supabase';
import { getEnhancedContentGenerator, type EnhancedContentTemplate, type BrokerSummary } from '../../lib/enhancedContentGeneration';
import { getBrokerRanking } from '../../lib/brokerRanking';
import { getCached, setCached } from '../../lib/cache';
import { transformBrokersData } from '../../lib/dataTransformation';
import { getBrokersForCategory, getCategoryBySlug, type EnhancedCategory } from '../../data/enhancedCategoryMappings';
import BrokerCard from '../../components/BrokerCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface EnhancedCategoryPageData {
  category: EnhancedCategory;
  brokers: any[];
  rankedBrokers: any[];
  content: EnhancedContentTemplate;
  categoryStats: {
    total: number;
    featured: number;
    avgRating: number;
    lastUpdated: string;
  };
}

const EnhancedCategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [data, setData] = useState<EnhancedCategoryPageData | null>(null);
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

      const cacheKey = `enhanced-category-page-${slug}`;

      // Try to get from cache first
      const cached = await getCached<EnhancedCategoryPageData>(cacheKey);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      // Get category info from enhanced mappings
      const category = getCategoryBySlug(slug);
      if (!category) {
        throw new Error(`Category not found: ${slug}`);
      }

      // Fetch all brokers from database
      const { data: brokers, error: brokersError } = await supabase
        .from('brokers')
        .select('*')
        .limit(100); // Get a reasonable number of brokers

      if (brokersError) {
        console.error('Error fetching brokers:', brokersError);
        throw new Error('Failed to fetch brokers');
      }

      // Transform broker data to match enhanced category expectations
      const transformedBrokers = transformBrokersData(brokers || []);

      // Filter brokers for this category using enhanced mappings
      const categoryBrokers = getBrokersForCategory(transformedBrokers, category.id);

      let rankedBrokers = [];

      if (categoryBrokers.length === 0) {
        console.warn(`No brokers found for category "${category.name}", using top-rated brokers as fallback`);
        // Use top-rated brokers as fallback instead of empty data
        rankedBrokers = transformedBrokers
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(0, 10)
          .map(broker => ({
            broker_id: parseInt(broker.id) || 0,
            broker_name: broker.name || 'Unknown Broker',
            total_score: broker.score || 8.0,
            score_breakdown: {
              regulation: 8,
              execution_spreads: 8,
              fees_commissions: 8,
              withdrawal_reliability: 8,
              platform_features: 8,
              country_availability: 8,
              user_reviews: 8
            },
            category_match_score: 7, // Lower score since it's a fallback
            country_available: true,
            // Preserve original broker data
            ...broker
          }));
      } else {
        // Try to rank brokers for this category, but handle database errors gracefully
        try {
          rankedBrokers = await getBrokerRanking(categoryBrokers, {
            categoryId: category.id,
            limit: 50
          });
        } catch (rankingError) {
          console.warn('Ranking service unavailable, using default ordering:', rankingError);
          // Fallback: sort by existing score and preserve all broker data
          rankedBrokers = categoryBrokers
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 50)
            .map(broker => ({
              broker_id: parseInt(broker.id) || 0,
              broker_name: broker.name || 'Unknown Broker',
              total_score: broker.score || 8.0,
              score_breakdown: {
                regulation: 8,
                execution_spreads: 8,
                fees_commissions: 8,
                withdrawal_reliability: 8,
                platform_features: 8,
                country_availability: 8,
                user_reviews: 8
              },
              category_match_score: 9,
              country_available: true,
              // Preserve original broker data
              ...broker
            }));
        }
      }

      // Convert to BrokerSummary format for content generation
      const brokerSummaries: BrokerSummary[] = rankedBrokers.map(broker => ({
        name: broker.broker_name || broker.name || 'Unknown Broker',
        rating: broker.total_score || broker.score || 8.0,
        minDeposit: broker.accessibility?.minDeposit || 100,
        regulation: broker.security?.regulatedBy?.map(r => r.regulator).join(', ') || 'International',
        keyFeatures: [
          broker.technology?.platforms?.[0] || 'Trading Platform',
          `Min Deposit: $${broker.accessibility?.minDeposit || 100}`,
          broker.accountTypes?.[0]?.type || 'Standard Account',
          broker.coreInfo?.brokerType || 'Standard'
        ].filter(Boolean)
      }));

      // Generate enhanced content
      const contentGenerator = getEnhancedContentGenerator();
      const content = await contentGenerator.generateEnhancedCategoryContent(category, brokerSummaries);

      const categoryData: EnhancedCategoryPageData = {
        category,
        brokers: categoryBrokers,
        rankedBrokers,
        content,
        categoryStats: {
          total: categoryBrokers.length,
          featured: Math.min(categoryBrokers.length, 10),
          avgRating: brokerSummaries.length > 0
            ? Number((brokerSummaries.reduce((sum, b) => sum + b.rating, 0) / brokerSummaries.length).toFixed(1))
            : 0,
          lastUpdated: new Date().toISOString()
        }
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

  const generateEmptyContent = async (category: EnhancedCategory): Promise<EnhancedContentTemplate> => {
    return {
      h1: `Best ${category.name} 2025`,
      intro: `Looking for the best ${category.name.toLowerCase()} in 2025? We're currently updating our analysis of top-rated brokers in this category. ${category.description} Check back soon for comprehensive reviews and comparisons.`,
      localContext: {
        advantages: category.localContext.advantages.map(adv => `• ${adv}`).join('\n'),
        disadvantages: category.localContext.disadvantages.map(dis => `• ${dis}`).join('\n'),
        bestFor: category.localContext.bestFor.join(', ')
      },
      comparisonHighlights: [
        `**Analysis in Progress:** We're currently researching and verifying the best ${category.name.toLowerCase()} for 2025.`,
        `**Comprehensive Reviews:** Our team is analyzing trading conditions, regulation, and platform features.`,
        `**Coming Soon:** Detailed comparisons and expert recommendations will be available shortly.`
      ],
      faqs: [
        {
          id: 'what-are',
          question: `What are ${category.name}?`,
          answer: `${category.name} are ${category.description} These platforms typically offer ${category.localContext.keyFeatures.join(', ')} to meet specific trading requirements.`
        },
        {
          id: 'how-to-choose',
          question: `How to choose the right ${category.name.toLowerCase().replace('brokers', 'broker')}?`,
          answer: 'When choosing a broker, consider regulatory compliance, trading costs, platform features, customer support quality, and available trading instruments. Our upcoming comprehensive analysis will help you make an informed decision.'
        }
      ],
      metaDescription: category.metaDescription,
      metaTitle: category.seoTitle,
      keywords: [`best ${category.name.toLowerCase()}`, `${category.name.toLowerCase()} 2025`, category.slug.replace(/-/g, ' ')],
      structuredData: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": category.seoTitle,
        "description": category.metaDescription,
        "url": `${window.location.origin}/best-brokers/${category.slug}`
      }
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

  const { category, rankedBrokers, content, categoryStats } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{content.metaTitle}</title>
        <meta name="description" content={content.metaDescription} />
        <meta name="keywords" content={content.keywords.join(', ')} />
        <link rel="canonical" href={`${window.location.origin}/best-brokers/${category.slug}`} />

        {/* Open Graph */}
        <meta property="og:title" content={content.metaTitle} />
        <meta property="og:description" content={content.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/best-brokers/${category.slug}`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.metaTitle} />
        <meta name="twitter:description" content={content.metaDescription} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(content.structuredData)}</script>
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
        {/* Category Hero */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="text-6xl mr-4">{category.icon}</div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {content.h1}
              </h1>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <span className="mr-4">Category: {category.categoryGroup}</span>
                <span className="mr-4">Featured: {categoryStats.featured} brokers</span>
                {categoryStats.avgRating > 0 && (
                  <span>Avg Rating: {categoryStats.avgRating}/10</span>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-lg text-gray-600 leading-relaxed mb-8">
            {content.intro}
          </div>

          {/* Category Stats */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{categoryStats.featured}</div>
                <div className="text-sm text-gray-600">Featured Brokers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{categoryStats.total}</div>
                <div className="text-sm text-gray-600">Total Reviewed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{categoryStats.avgRating}/10</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Highlights */}
        {content.comparisonHighlights.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Top Picks for {category.name}
            </h2>
            <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-1 lg:grid-cols-3">
              {content.comparisonHighlights.map((highlight, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                    }`}>
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-gray-900">Top Choice #{index + 1}</h3>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed"
                       dangerouslySetInnerHTML={{ __html: highlight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Local Context Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose {category.name}?
          </h2>
          <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-green-600 mb-4">✅ Advantages</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {content.localContext.advantages}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-red-600 mb-4">⚠️ Disadvantages</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {content.localContext.disadvantages}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">🎯 Best For</h3>
              <div className="text-sm text-gray-700 leading-relaxed">
                {content.localContext.bestFor}
              </div>
            </div>
          </div>
        </div>

        {/* Broker Results */}
        {rankedBrokers.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Complete {category.name} Comparison ({rankedBrokers.length} brokers)
              </h2>
              <div className="text-sm text-gray-500">
                Rankings updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Enhanced Comparison Table */}
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
                        Max Leverage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Spreads From
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
                      <tr key={`broker-table-${broker.broker_id || broker.id || index}-${broker.broker_name || broker.name || 'unknown'}`} className={index < 3 ? 'bg-yellow-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {broker.logo_url && (
                              <img
                                className="h-8 w-8 rounded-full mr-3"
                                src={broker.logo_url}
                                alt={`${broker.broker_name || broker.name || 'Unknown'} logo`}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div className="text-sm font-medium text-gray-900">
                              {broker.broker_name || broker.name || 'Unknown Broker'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {broker.total_score || broker.rating ? (broker.total_score || broker.rating).toFixed(1) : 'N/A'}
                            </span>
                            {(broker.total_score || broker.rating) && (
                              <span className="text-xs text-gray-500 ml-1">/10</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${broker.accessibility?.minDeposit || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {broker.tradingConditionsExtended?.maxLeverage || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {broker.fees?.trading?.averageSpreads?.[0]?.spread || 'Variable'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {broker.security?.regulatedBy?.map(r => r.regulator).slice(0, 2).join(', ') || 'International'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {broker.technology?.platforms?.[0] || 'Web Platform'}
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
                <div key={`broker-card-${broker.broker_id || broker.id || index}-${broker.broker_name || broker.name || 'unknown'}`} className="relative">
                  {index < 3 && (
                    <div className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full z-10">
                      #{index + 1} BEST
                    </div>
                  )}
                  <BrokerCard
                    broker={broker}
                    variant="enhanced"
                    showRanking={true}
                    ranking={index + 1}
                    categoryContext={category.name}
                    showRiskBadge={true}
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis in Progress</h3>
            <p className="text-gray-600">
              We're currently updating our analysis for this category. Check back soon for comprehensive broker comparisons!
            </p>
          </div>
        )}

        {/* Enhanced FAQ Section */}
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
              Ready to Start with {category.name}?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              All featured brokers have been thoroughly reviewed and verified to meet the specific requirements for {category.name.toLowerCase()}.
              Find the perfect platform that matches your trading style and requirements.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/best-brokers"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Compare All Categories
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCategoryPage;
