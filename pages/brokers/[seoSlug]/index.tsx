import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRightIcon,
  FunnelIcon,
  StarIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Broker } from '../../../types';
import { useBrokers } from '../../../hooks/useBrokers';
import BrokerCard from '../../../components/directory/BrokerCard';
import MetaTags from '../../../components/common/MetaTags';
import JsonLdSchema from '../../../components/common/JsonLdSchema';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { allSEOPageConfigs, SEOPageConfig, generatePageContent } from '../../../data/seoPageConfigs';
import useMetaDescription from '../../../hooks/useMetaDescription';

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

const SEOBrokerPage: React.FC = () => {
  const { seoSlug } = useParams<{ seoSlug: string }>();
  const { brokers: allBrokers, loading, error } = useBrokers();
  const [filters, setFilters] = useState<FilterState>({
    minDeposit: 0,
    regulation: 'all',
    platforms: [],
    sortBy: 'score',
    sortOrder: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Find the matching SEO configuration
  const config = useMemo(() => {
    const seoPath = `/brokers/${seoSlug}`;
    return allSEOPageConfigs.find(page => page.path === seoPath);
  }, [seoSlug]);

  // Filter brokers based on configuration
  const filteredBrokers = useMemo(() => {
    if (!config) return [];

    let brokers = allBrokers.filter(broker => {
      // Apply configuration filters
      const { filters: configFilters } = config;

      // Regulatory filter
      if (configFilters.regulators && configFilters.regulators.length > 0) {
        const hasRequiredRegulator = configFilters.regulators.some(regulator =>
          broker.regulation.regulators.includes(regulator)
        );
        if (!hasRequiredRegulator) return false;
      }

      // Platform filter
      if (configFilters.platforms && configFilters.platforms.length > 0) {
        const hasRequiredPlatform = configFilters.platforms.some(platform =>
          broker.technology.platforms.includes(platform)
        );
        if (!hasRequiredPlatform) return false;
      }

      // Account type filter
      if (configFilters.accountTypes && configFilters.accountTypes.length > 0) {
        const hasRequiredAccountType = configFilters.accountTypes.some(type =>
          broker.accountTypes.some(account =>
            account.type.toLowerCase().includes(type.toLowerCase())
          )
        );
        if (!hasRequiredAccountType) return false;
      }

      // Deposit filter
      if (configFilters.minDeposit !== undefined) {
        if (broker.accessibility.minDeposit < configFilters.minDeposit) return false;
      }
      if (configFilters.maxDeposit !== undefined) {
        if (broker.accessibility.minDeposit > configFilters.maxDeposit) return false;
      }

      // Leverage filter
      if (configFilters.leverage !== undefined) {
        const leverageMatch = broker.tradingConditions.maxLeverage.match(/1:(\d+)/);
        if (leverageMatch) {
          const leverage = parseInt(leverageMatch[1]);
          if (leverage < configFilters.leverage) return false;
        }
      }

      // Features filter
      if (configFilters.features && configFilters.features.length > 0) {
        const hasRequiredFeatures = configFilters.features.every(feature => {
          switch (feature.toLowerCase()) {
            case 'copytrading':
              return broker.copyTrading || broker.platformFeatures?.copyTrading?.available;
            case 'islamic':
              return broker.isIslamic || broker.accountManagement?.islamicAccount?.available;
            case 'scalping':
              return broker.technology.executionType.includes('ECN') ||
                     broker.tradingConditions.spreads.eurusd < 1.0;
            case 'signals':
              return broker.providesSignals;
            default:
              return true;
          }
        });
        if (!hasRequiredFeatures) return false;
      }

      // Specialties filter
      if (configFilters.specialties && configFilters.specialties.length > 0) {
        const hasSpecialties = configFilters.specialties.some(specialty => {
          switch (specialty.toLowerCase()) {
            case 'crypto':
              return (broker.tradableInstruments?.cryptocurrencies?.total || 0) > 0;
            case 'stocks':
              return (broker.tradableInstruments?.stocks?.total || 0) > 0;
            case 'indices':
              return (broker.tradableInstruments?.indices?.total || 0) > 0;
            case 'commodities':
              return (broker.tradableInstruments?.commodities?.total || 0) > 0;
            default:
              return true;
          }
        });
        if (!hasSpecialties) return false;
      }

      // Regions filter
      if (configFilters.regions && configFilters.regions.length > 0) {
        const servesRegion = configFilters.regions.some(region => {
          switch (region.toLowerCase()) {
            case 'usa':
              return broker.regulation.regulators.includes('NFA');
            case 'uk':
              return broker.regulation.regulators.includes('FCA');
            case 'europe':
              return broker.regulation.regulators.some(r =>
                ['FCA', 'CySEC', 'BaFin', 'FINMA'].includes(r)
              );
            case 'australia':
              return broker.regulation.regulators.includes('ASIC');
            default:
              return true;
          }
        });
        if (!servesRegion) return false;
      }

      return true;
    });

    // Apply user filters
    brokers = brokers.filter(broker => {
      if (filters.minDeposit > 0 && broker.accessibility.minDeposit < filters.minDeposit) {
        return false;
      }
      
      if (filters.regulation !== 'all') {
        if (filters.regulation === 'regulated' && !broker.regulation.regulators.length) {
          return false;
        }
        if (filters.regulation !== 'regulated' && !broker.regulation.regulators.includes(filters.regulation)) {
          return false;
        }
      }

      if (filters.platforms.length > 0) {
        const hasPlatform = filters.platforms.some(platform =>
          broker.technology.platforms.includes(platform)
        );
        if (!hasPlatform) return false;
      }

      return true;
    });

    // Sort brokers
    brokers.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (filters.sortBy) {
        case 'score':
          aValue = a.score || 0;
          bValue = b.score || 0;
          break;
        case 'minDeposit':
          aValue = a.accessibility.minDeposit;
          bValue = b.accessibility.minDeposit;
          break;
        case 'spreads':
          aValue = a.tradingConditions.spreads.eurusd;
          bValue = b.tradingConditions.spreads.eurusd;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return brokers;
  }, [allBrokers, config, filters]);

  // Generate dynamic content based on broker data
  const dynamicContent = useMemo(() => {
    if (!config || !filteredBrokers.length) return null;
    return generatePageContent(config, filteredBrokers);
  }, [config, filteredBrokers]);

  // Generate meta description
  const metaDescription = useMetaDescription({
    type: 'category',
    title: config?.title || '',
    keyFeatures: config?.highlights || [],
    targetAudience: 'forex traders'
  });

  // Generate breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!seoSlug) return [];
    
    return [
      { name: 'Home', url: '/' },
      { name: 'Brokers', url: '/brokers' },
      { 
        name: seoSlug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
          .replace('And', '&')
          .replace('Usa', 'USA')
          .replace('Uk', 'UK'),
        url: `/brokers/${seoSlug}`
      }
    ];
  }, [seoSlug]);

  // Generate key statistics
  const keyStats = useMemo(() => {
    if (!filteredBrokers.length) return null;

    const regulatedCount = filteredBrokers.filter(b => b.regulation.regulators.length > 0).length;
    const avgSpread = filteredBrokers.reduce((sum, b) => sum + b.tradingConditions.spreads.eurusd, 0) / filteredBrokers.length;
    const minDeposit = Math.min(...filteredBrokers.map(b => b.accessibility.minDeposit));
    const avgScore = filteredBrokers.reduce((sum, b) => sum + (b.score || 0), 0) / filteredBrokers.length;

    return {
      totalBrokers: filteredBrokers.length,
      regulatedCount,
      avgSpread: Math.round(avgSpread * 10) / 10,
      minDeposit,
      avgScore: Math.round(avgScore * 10) / 10
    };
  }, [filteredBrokers]);

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
          "description": `${broker.name} - ${config.highlights.join(', ')}`,
          "provider": {
            "@type": "Organization",
            "name": broker.name
          },
          "offers": {
            "@type": "Offer",
            "price": broker.accessibility.minDeposit,
            "priceCurrency": "USD"
          }
        }
      }))
    };
  }, [config, filteredBrokers]);

  // Generate FAQ structured data
  const faqStructuredData = useMemo(() => {
    if (!config?.faqs) return null;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": config.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }, [config]);

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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-4">The page "{seoSlug}" was not found.</p>
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
      <MetaTags
        title={config.title}
        description={metaDescription}
        canonical={`https://brokeranalysis.com/brokers/${seoSlug}`}
        keywords={[...config.highlights, 'forex broker', 'online trading', 'currency trading']}
      />

      {structuredData && <JsonLdSchema data={structuredData} />}
      {faqStructuredData && <JsonLdSchema data={faqStructuredData} />}

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
            </div>
          </div>
        </div>

        {/* Key Statistics */}
        {keyStats && (
          <div className="bg-white dark:bg-gray-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{keyStats.totalBrokers}</div>
                  <div className="text-gray-600 dark:text-gray-400">Brokers Listed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{keyStats.regulatedCount}</div>
                  <div className="text-gray-600 dark:text-gray-400">Regulated</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">${keyStats.minDeposit}</div>
                  <div className="text-gray-600 dark:text-gray-400">Min Deposit</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">{keyStats.avgSpread}</div>
                  <div className="text-gray-600 dark:text-gray-400">Avg Spread</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">{keyStats.avgScore}/10</div>
                  <div className="text-gray-600 dark:text-gray-400">Avg Rating</div>
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

export default SEOBrokerPage;