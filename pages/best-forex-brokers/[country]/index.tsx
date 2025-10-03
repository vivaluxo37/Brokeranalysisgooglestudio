import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRightIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  StarIcon,
  CheckCircleIcon,
  BanknotesIcon,
  ScaleIcon,
  ChatBubbleLeftRightIcon,
  FunnelIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Broker } from '../../../types';
import { useBrokers } from '../../../hooks/useBrokers';
import BrokerCard from '../../../components/directory/BrokerCard';
import MetaTags from '../../../components/common/MetaTags';
import JsonLdSchema from '../../../components/common/JsonLdSchema';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { getCountryBySlug, CountryConfig } from '../../../lib/constants/countries';

interface FilterState {
  search: string;
  regulated: string;
  minDeposit: string;
  maxLeverage: string;
  rating: number;
  sortBy: string;
}

const CountryBrokerPage: React.FC = () => {
  const { country } = useParams<{ country: string }>();
  const { brokers: allBrokers, loading, error } = useBrokers();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    regulated: 'all',
    minDeposit: 'all',
    maxLeverage: 'all',
    rating: 0,
    sortBy: 'rating'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get country configuration
  const countryConfig = useMemo(() => {
    if (!country) return null;
    return getCountryBySlug(country);
  }, [country]);

  // Filter brokers for the specific country
  const filteredBrokers = useMemo(() => {
    if (!countryConfig) return [];

    let brokers = allBrokers.filter(broker => {
      // Check if broker serves this country
      // This is a simplified check - in a real implementation, you'd query the broker_country_availability table
      const servesCountry = checkBrokerAvailability(broker, countryConfig);
      if (!servesCountry) return false;

      // Apply user filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (!broker.name.toLowerCase().includes(searchTerm)) return false;
      }

      if (filters.regulated !== 'all') {
        if (filters.regulated === 'yes' && !broker.regulation.regulators.length) {
          return false;
        }
        if (filters.regulated === 'no' && broker.regulation.regulators.length) {
          return false;
        }
      }

      if (filters.minDeposit !== 'all') {
        const minDeposit = parseInt(filters.minDeposit);
        if (broker.accessibility.minDeposit > minDeposit) return false;
      }

      if (filters.maxLeverage !== 'all') {
        const maxLeverage = parseInt(filters.maxLeverage);
        const brokerLeverage = parseInt(broker.tradingConditions.maxLeverage.replace(/[^\d]/g, ''));
        if (brokerLeverage < maxLeverage) return false;
      }

      if (filters.rating > 0) {
        if ((broker.score || 0) < filters.rating) return false;
      }

      return true;
    });

    // Sort brokers
    brokers.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return (b.score || 0) - (a.score || 0);
        case 'deposit':
          return a.accessibility.minDeposit - b.accessibility.minDeposit;
        case 'spreads':
          return a.tradingConditions.spreads.eurusd - b.tradingConditions.spreads.eurusd;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return brokers;
  }, [allBrokers, countryConfig, filters]);

  // Helper function to check broker availability (simplified)
  const checkBrokerAvailability = (broker: Broker, country: CountryConfig): boolean => {
    // This is a simplified implementation
    // In a real app, this would query the broker_country_availability table
    
    // Check regulatory compatibility
    const countryRegulators = getCountryRegulators(country.code);
    const hasCompatibleRegulation = broker.regulation.regulators.some(reg => 
      countryRegulators.includes(reg) || isGloballyAccepted(reg)
    );

    // Check if broker explicitly excludes this country
    if (broker.restrictions?.excludedCountries?.includes(country.code)) {
      return false;
    }

    return hasCompatibleRegulation;
  };

  // Helper function to get country regulators
  const getCountryRegulators = (countryCode: string): string[] => {
    const regulatorMap: Record<string, string[]> = {
      'US': ['NFA', 'CFTC'],
      'GB': ['FCA'],
      'AU': ['ASIC'],
      'DE': ['BaFin'],
      'CY': ['CySEC'],
      'CH': ['FINMA'],
      'CA': ['IIROC'],
      'JP': ['FSA'],
      'SG': ['MAS']
    };
    return regulatorMap[countryCode] || [];
  };

  // Helper function to check globally accepted regulators
  const isGloballyAccepted = (regulator: string): boolean => {
    const globalRegulators = ['FCA', 'ASIC', 'CySEC', 'NFA', 'BaFin', 'FINMA'];
    return globalRegulators.includes(regulator);
  };

  // Generate country-specific content
  const countryContent = useMemo(() => {
    if (!countryConfig) return null;

    return {
      heroIntro: generateHeroIntro(countryConfig, filteredBrokers.length),
      localRelevance: generateLocalRelevance(countryConfig),
      faqs: generateCountryFAQs(countryConfig),
      regulatoryInfo: generateRegulatoryInfo(countryConfig)
    };
  }, [countryConfig, filteredBrokers.length]);

  // Content generation functions
  const generateHeroIntro = (country: CountryConfig, brokerCount: number) => {
    return `Discover the ${brokerCount} best forex brokers available in ${country.name}. Our comprehensive analysis covers regulated brokers with competitive spreads, reliable platforms, and excellent customer support for ${country.demonym || 'local'} traders.`;
  };

  const generateLocalRelevance = (country: CountryConfig) => {
    return [
      {
        icon: ShieldCheckIcon,
        title: 'Regulation & Safety',
        description: `All featured brokers comply with ${country.name}'s financial regulations and offer investor protection.`
      },
      {
        icon: BanknotesIcon,
        title: 'Local Payment Methods',
        description: `Support for popular payment methods in ${country.name} including bank transfers and local e-wallets.`
      },
      {
        icon: ChatBubbleLeftRightIcon,
        title: 'Local Support',
        description: `Customer support in ${country.language || 'local language'} during ${country.name} business hours.`
      },
      {
        icon: ScaleIcon,
        title: 'Tax Considerations',
        description: `Understanding of ${country.name} tax implications for forex trading and compliance requirements.`
      }
    ];
  };

  const generateCountryFAQs = (country: CountryConfig) => {
    return [
      {
        question: `Is forex trading legal in ${country.name}?`,
        answer: `Yes, forex trading is legal in ${country.name}. Traders should use regulated brokers that comply with local financial regulations for maximum protection.`
      },
      {
        question: `What is the maximum leverage available in ${country.name}?`,
        answer: `Leverage limits vary by broker and regulatory jurisdiction. Professional traders may access higher leverage than retail clients, subject to local regulations.`
      },
      {
        question: `How are forex profits taxed in ${country.name}?`,
        answer: `Forex trading profits may be subject to capital gains tax or income tax in ${country.name}. Consult with a local tax advisor for specific guidance on your situation.`
      },
      {
        question: `Which payment methods work best for ${country.name} traders?`,
        answer: `Most brokers accept bank transfers, credit/debit cards, and popular e-wallets. Some also support local payment methods specific to ${country.name}.`
      }
    ];
  };

  const generateRegulatoryInfo = (country: CountryConfig) => {
    const regulators = getCountryRegulators(country.code);
    if (!regulators.length) return null;

    return {
      title: `${country.name} Forex Regulation`,
      regulator: regulators[0],
      description: `Forex trading in ${country.name} is regulated by ${regulators.join(' and ')}, ensuring trader protection and market integrity.`
    };
  };

  // Generate breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!countryConfig) return [];
    
    return [
      { name: 'Home', url: '/' },
      { name: 'Best Forex Brokers', url: '/best-brokers' },
      { 
        name: `${countryConfig.name} Brokers`,
        url: `/best-forex-brokers/${country}`
      }
    ];
  }, [countryConfig, country]);

  // Generate structured data
  const structuredData = useMemo(() => {
    if (!countryConfig || !filteredBrokers.length) return null;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `Best Forex Brokers in ${countryConfig.name}`,
      "description": `Top-rated forex brokers available to traders in ${countryConfig.name}`,
      "numberOfItems": filteredBrokers.length,
      "itemListElement": filteredBrokers.slice(0, 10).map((broker, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "FinancialProduct",
          "name": broker.name,
          "url": `https://brokeranalysis.com/broker/${broker.id}`,
          "description": `${broker.name} forex broker available in ${countryConfig.name}`,
          "provider": {
            "@type": "Organization",
            "name": broker.name
          }
        }
      }))
    };
  }, [countryConfig, filteredBrokers]);

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

  if (!countryConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Country Not Found</h2>
          <p className="text-gray-600 mb-4">The country "{country}" was not found.</p>
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
        title={`Best Forex Brokers in ${countryConfig.name} 2025 | Top ${filteredBrokers.length} Regulated Brokers`}
        description={`Compare the ${filteredBrokers.length} best forex brokers available in ${countryConfig.name}. Regulated brokers with competitive spreads, reliable platforms, and local support for ${countryConfig.demonym || 'local'} traders.`}
        canonical={`https://brokeranalysis.com/best-forex-brokers/${country}`}
        keywords={[
          `forex brokers ${countryConfig.name}`,
          `${countryConfig.name} forex trading`,
          `regulated brokers ${countryConfig.name}`,
          'forex trading platform',
          'currency trading'
        ]}
      />

      {structuredData && <JsonLdSchema data={structuredData} />}

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
            <div className="flex items-center mb-6">
              <span className="text-6xl mr-4">{countryConfig.flag}</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  Best Forex Brokers in {countryConfig.name}
                </h1>
                <p className="text-xl text-blue-100 mt-2">
                  2025 Edition - {filteredBrokers.length} Top Regulated Brokers
                </p>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-4xl">
              {countryContent?.heroIntro}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{filteredBrokers.length}</div>
                <div className="text-blue-200">Brokers Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {filteredBrokers.filter(b => b.regulation.regulators.length > 0).length}
                </div>
                <div className="text-blue-200">Regulated Brokers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  ${Math.min(...filteredBrokers.map(b => b.accessibility.minDeposit))}
                </div>
                <div className="text-blue-200">Minimum Deposit</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {Math.min(...filteredBrokers.map(b => b.tradingConditions.spreads.eurusd)).toFixed(1)}
                </div>
                <div className="text-blue-200">Lowest Spread</div>
              </div>
            </div>
          </div>
        </div>

        {/* Local Relevance Section */}
        {countryContent?.localRelevance && (
          <div className="bg-white dark:bg-gray-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Why Choose These Brokers for {countryConfig.name}?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {countryContent.localRelevance.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="mx-auto h-12 w-12 text-blue-600 mb-4">
                      <item.icon className="h-12 w-12" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {item.description}
                    </p>
                  </div>
                ))}
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
                  {filteredBrokers.length} brokers available in {countryConfig.name}
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
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="rating">Best Rating</option>
                  <option value="deposit">Lowest Deposit</option>
                  <option value="spreads">Tightest Spreads</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      placeholder="Broker name..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Regulation
                    </label>
                    <select
                      value={filters.regulated}
                      onChange={(e) => setFilters(prev => ({ ...prev, regulated: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="all">All Brokers</option>
                      <option value="yes">Regulated Only</option>
                      <option value="no">Unregulated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Min Deposit
                    </label>
                    <select
                      value={filters.minDeposit}
                      onChange={(e) => setFilters(prev => ({ ...prev, minDeposit: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="all">Any Amount</option>
                      <option value="1">$1+</option>
                      <option value="10">$10+</option>
                      <option value="100">$100+</option>
                      <option value="500">$500+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Leverage
                    </label>
                    <select
                      value={filters.maxLeverage}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxLeverage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="all">Any Leverage</option>
                      <option value="50">1:50+</option>
                      <option value="100">1:100+</option>
                      <option value="500">1:500+</option>
                    </select>
                  </div>
                  <div>
                    <button
                      onClick={() => setFilters({
                        search: '',
                        regulated: 'all',
                        minDeposit: 'all',
                        maxLeverage: 'all',
                        rating: 0,
                        sortBy: 'rating'
                      })}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-6"
                    >
                      Reset
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
              <GlobeAltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No brokers found for {countryConfig.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your filters or check back later for new brokers
              </p>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        {countryContent?.faqs && (
          <div className="bg-white dark:bg-gray-800 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Forex Trading in {countryConfig.name} - FAQ
              </h2>
              <div className="space-y-6">
                {countryContent.faqs.map((faq, index) => (
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

        {/* Regulatory Information */}
        {countryContent?.regulatoryInfo && (
          <div className="bg-blue-50 dark:bg-blue-900/20 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <ShieldCheckIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {countryContent.regulatoryInfo.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {countryContent.regulatoryInfo.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CountryBrokerPage;