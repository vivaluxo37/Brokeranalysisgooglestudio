import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRightIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Broker } from '../../../types';
import { useCachedProgrammaticData } from '../../../hooks/useCachedProgrammaticData';
import BrokerCard from '../../../components/directory/BrokerCard';
import MetaTags, { OptimizedMetaTags } from '../../../components/common/MetaTags';
import JsonLdSchema from '../../../components/common/JsonLdSchema';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { allSEOPageConfigs, SEOPageConfig } from '../../../data/seoPageConfigs';
import { useStructuredData } from '../../../services/structuredDataGenerator';
import { useMetaTagOptimizer } from '../../../services/metaTagOptimizer';
import { useContentGenerator } from '../../../services/contentGenerator';

interface FilterState {
  minDeposit: number;
  regulation: string;
  platforms: string[];
  sortBy: 'score' | 'minDeposit' | 'spreads' | 'name';
  sortOrder: 'asc' | 'desc';
}

// Transform broker data to match BrokerCard interface
const transformBrokerForCard = (broker: Broker) => {
  // Extract regulators for display
  const regulators = broker.security?.regulatedBy?.map(r => r.regulator).slice(0, 3).join(', ') || 
                    broker.regulation?.regulators?.slice(0, 3).join(', ') || 
                    'Regulated';
  
  return {
    id: broker.id, // Keep as string for routing
    name: broker.name,
    overall_rating: broker.score || broker.ratings?.regulation || 0,
    logo_url: broker.logoUrl,
    minimum_deposit: broker.accessibility?.minDeposit ?? broker.accountTypes?.[0]?.minDeposit ?? 0,
    regulation_status: regulators,
    trust_score: broker.ratings?.regulation,
    website: broker.websiteUrl
  };
};

const BrokerCategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [filters, setFilters] = useState<FilterState>({
    minDeposit: 0,
    regulation: 'all',
    platforms: [],
    sortBy: 'score',
    sortOrder: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [structuredData, setStructuredData] = useState<any[]>([]);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [seoOptimized, setSeoOptimized] = useState(false);

  // Advanced SEO hooks
  const { generatePageStructuredData } = useStructuredData();
  const { generateOptimizedMetaTags } = useMetaTagOptimizer();
  const { generateOptimizedContent } = useContentGenerator();

  // Use cached programmatic data
  const {
    data: pageData,
    loading,
    error,
    isFromCache,
    cacheStats,
    performanceStats,
    refresh
  } = useCachedProgrammaticData({
    type: 'category',
    slug: category || '',
    filters: filters,
    enabled: !!category,
    preloadRelated: true
  });

  // Extract data from cached response
  const config = pageData?.config as SEOPageConfig;
  const filteredBrokers = pageData?.brokers || [];
  const pageMetadata = pageData?.metadata;

  // Generate breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!category) return [];
    
    return [
      { name: 'Home', url: '/' },
      { name: 'Best Brokers', url: '/best-brokers' },
      { 
        name: category
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
          .replace('And', '&')
          .replace('Usa', 'USA')
          .replace('Uk', 'UK'),
        url: `/best-brokers/${category}`
      }
    ];
  }, [category]);

  // Generate structured data
  const structuredData = useMemo(() => {
    if (!config || !filteredBrokers.length) return null;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": config.title,
      "description": config.description,
      "numberOfItems": filteredBrokers.length,
      "itemListElement": filteredBrokers.slice(0, 10).map((broker, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "FinancialProduct",
          "name": broker.name,
          "url": `https://brokeranalysis.com/broker/${broker.id}`,
          "description": `${broker.name} forex broker with ${broker.regulation.regulators.join(', ')} regulation`,
          "provider": {
            "@type": "Organization",
            "name": broker.name
          }
        }
      }))
    };
  }, [config, filteredBrokers]);

  // Generate advanced SEO content
  useEffect(() => {
    const generateAdvancedSEO = async () => {
      if (!config || !filteredBrokers.length || seoOptimized) return;

      try {
        // Generate structured data
        const schemas = await generatePageStructuredData(
          'category',
          category || '',
          filteredBrokers,
          config
        );
        setStructuredData(schemas);

        // Generate optimized content
        const content = await generateOptimizedContent(
          'category',
          category || '',
          filteredBrokers,
          config
        );
        setGeneratedContent(content);

        setSeoOptimized(true);
      } catch (error) {
        console.error('Failed to generate advanced SEO content:', error);
      }
    };

    generateAdvancedSEO();
  }, [config, filteredBrokers, category, seoOptimized, generatePageStructuredData, generateOptimizedContent]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Brokers</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h2>
          <p className="text-gray-600 mb-4">The category "{category}" was not found.</p>
          <Link 
            to="/best-brokers" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Best Brokers Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Use optimized meta tags if available, fallback to standard */}
      {seoOptimized ? (
        <OptimizedMetaTags
          pageType="category"
          pageSlug={category || ''}
          brokers={filteredBrokers}
          config={config}
        />
      ) : (
        <MetaTags
          title={config.title}
          description={config.description}
          canonicalUrl={`https://brokeranalysis.com/best-brokers/${category}`}
          keywords={[...config.highlights, 'forex broker', 'online trading', 'currency trading']}
        />
      )}

      {/* Use advanced structured data if available */}
      {structuredData.length > 0 ? (
        <JsonLdSchema schemas={structuredData} />
      ) : (
        itemListSchema && <JsonLdSchema data={itemListSchema} />
      )}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breadcrumbs */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-gray-500 dark:text-gray-400">{crumb.name}</span>
                    ) : (
                      <Link 
                        to={crumb.url} 
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {config.heading}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
                {config.subheading}
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {config.highlights.map((highlight, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-blue-700/50 rounded-full text-sm font-medium"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-center space-x-2">
                  <StarIcon className="h-6 w-6 text-yellow-400" />
                  <span className="text-lg font-semibold">{filteredBrokers.length} Brokers</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <ShieldCheckIcon className="h-6 w-6 text-green-400" />
                  <span className="text-lg font-semibold">Regulated & Safe</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CurrencyDollarIcon className="h-6 w-6 text-blue-300" />
                  <span className="text-lg font-semibold">Best Rates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cache Status & Key Metrics */}
        {pageMetadata && (
          <div className="bg-white dark:bg-gray-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Cache Status & Performance Indicator */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  {/* Cache Status */}
                  <div className="flex items-center space-x-2">
                    {isFromCache ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Cached data • Hit rate: {Math.round(cacheStats.hitRate * 100)}%</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Fresh data • Generated now</span>
                      </>
                    )}
                  </div>
                  
                  {/* Performance Status */}
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      performanceStats.systemHealth === 'good' ? 'bg-green-500' :
                      performanceStats.systemHealth === 'warning' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <span>
                      Load: {performanceStats.recentLoadTime || performanceStats.avgLoadTime}ms
                      {performanceStats.avgLoadTime > 0 && (
                        <span className="text-gray-400"> • Avg: {performanceStats.avgLoadTime}ms</span>
                      )}
                    </span>
                  </div>
                  
                  <button
                    onClick={refresh}
                    className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Refresh data"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{pageMetadata.totalCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Brokers</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredBrokers.filter(b => b.regulation.regulators.length > 0).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Regulated</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">${pageMetadata.minDeposit}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Min Deposit</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">{pageMetadata.avgSpread}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Spread</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-600">{pageMetadata.avgRating}/10</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {filteredBrokers.length} brokers found
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FunnelIcon className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="score">Best Rating</option>
                  <option value="minDeposit">Lowest Deposit</option>
                  <option value="spreads">Tightest Spreads</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Min Deposit
                    </label>
                    <select
                      value={filters.minDeposit}
                      onChange={(e) => setFilters(prev => ({ ...prev, minDeposit: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value={0}>Any Amount</option>
                      <option value={1}>$1+</option>
                      <option value={10}>$10+</option>
                      <option value={50}>$50+</option>
                      <option value={100}>$100+</option>
                      <option value={500}>$500+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Regulation
                    </label>
                    <select
                      value={filters.regulation}
                      onChange={(e) => setFilters(prev => ({ ...prev, regulation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="all">All Brokers</option>
                      <option value="regulated">Regulated Only</option>
                      <option value="FCA">FCA (UK)</option>
                      <option value="ASIC">ASIC (Australia)</option>
                      <option value="CySEC">CySEC (Cyprus)</option>
                      <option value="NFA">NFA (USA)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Platform
                    </label>
                    <select
                      onChange={(e) => {
                        const platform = e.target.value;
                        if (platform && !filters.platforms.includes(platform)) {
                          setFilters(prev => ({ 
                            ...prev, 
                            platforms: [...prev.platforms, platform] 
                          }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="">Select Platform</option>
                      <option value="MT4">MetaTrader 4</option>
                      <option value="MT5">MetaTrader 5</option>
                      <option value="cTrader">cTrader</option>
                      <option value="TradingView">TradingView</option>
                    </select>
                  </div>
                  <div>
                    <button
                      onClick={() => setFilters({
                        minDeposit: 0,
                        regulation: 'all',
                        platforms: [],
                        sortBy: 'score',
                        sortOrder: 'desc'
                      })}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-6"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Brokers Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredBrokers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBrokers.map((broker, index) => (
                <BrokerCard 
                  key={broker.id}
                  broker={transformBrokerForCard(broker)}
                  ranking={index + 1}
                  showRanking={true}
                  showDetailsLink={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FunnelIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No brokers found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your filters to see more results
              </p>
              <button
                onClick={() => setFilters({
                  minDeposit: 0,
                  regulation: 'all',
                  platforms: [],
                  sortBy: 'score',
                  sortOrder: 'desc'
                })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        {config.faqs && config.faqs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {config.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Pages */}
        {config.relatedPages && config.relatedPages.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Related Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.relatedPages.map((page, index) => (
                  <Link
                    key={index}
                    to={page.url}
                    className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {page.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BrokerCategoryPage;