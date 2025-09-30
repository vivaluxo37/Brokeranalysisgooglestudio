import { GetStaticProps, GetStaticPaths } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import MainLayout from '@/components/layout/MainLayout';
import BrokerCard from '@/components/common/BrokerCard';

interface Broker {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  overall_rating: number;
  min_deposit?: number;
  min_deposit_currency?: string;
  max_leverage?: number;
  spreads_from?: number;
  commission?: string;
  regulated?: boolean;
  regulations?: Array<{
    regulator: string;
    license_number?: string;
    country: string;
  }>;
  platforms?: string[];
  instruments_total?: number;
  pros?: string[];
  cons?: string[];
  cta_text?: string;
  cta_url?: string;
  website_url: string;
  founded_year?: number;
  headquarters?: string;
  demo_account?: boolean;
  swap_free?: boolean;
  live_chat?: boolean;
  phone_support?: boolean;
  features?: string[];
  accepts_country: boolean;
  local_support?: boolean;
}

interface Country {
  code: string;
  name: string;
  slug: string;
  flag_emoji: string;
  description: string;
  long_description: string;
  regulatory_body: string;
  regulatory_body_full_name: string;
  regulatory_website?: string;
  broker_count: number;
  regulated_broker_count: number;
  timezone: string;
  currency: string;
  language: string;
  market_hours: string;
  key_facts: string[];
  regulatory_requirements: string[];
  trading_restrictions?: string[];
}

interface CountryPageProps {
  country: Country;
  brokers: Broker[];
  regulatedBrokers: Broker[];
  nearbyCountries: Array<{
    code: string;
    name: string;
    slug: string;
    flag_emoji: string;
    broker_count: number;
  }>;
}

interface FilterState {
  search: string;
  regulated: string;
  minDeposit: string;
  maxLeverage: string;
  rating: number;
  sortBy: string;
}

export default function CountryPage({ 
  country, 
  brokers, 
  regulatedBrokers, 
  nearbyCountries 
}: CountryPageProps) {
  const [filteredBrokers, setFilteredBrokers] = useState<Broker[]>(brokers);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    regulated: '',
    minDeposit: '',
    maxLeverage: '',
    rating: 0,
    sortBy: 'rating'
  });

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let filtered = [...brokers];

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(broker =>
        broker.name.toLowerCase().includes(searchTerm) ||
        broker.headquarters?.toLowerCase().includes(searchTerm)
      );
    }

    // Regulation filter
    if (filters.regulated === 'true') {
      filtered = filtered.filter(broker => broker.regulated);
    } else if (filters.regulated === 'false') {
      filtered = filtered.filter(broker => !broker.regulated);
    }

    // Min deposit filter
    if (filters.minDeposit) {
      const [min, max] = filters.minDeposit.split('-').map(Number);
      filtered = filtered.filter(broker => {
        if (!broker.min_deposit) return filters.minDeposit === '0';
        if (max) {
          return broker.min_deposit >= min && broker.min_deposit <= max;
        }
        return broker.min_deposit >= min;
      });
    }

    // Leverage filter
    if (filters.maxLeverage) {
      const leverage = parseInt(filters.maxLeverage);
      filtered = filtered.filter(broker => 
        broker.max_leverage && broker.max_leverage >= leverage
      );
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(broker => broker.overall_rating >= filters.rating);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'min_deposit':
          return (a.min_deposit || 0) - (b.min_deposit || 0);
        case 'max_leverage':
          return (b.max_leverage || 0) - (a.max_leverage || 0);
        case 'regulation':
          return (b.regulated ? 1 : 0) - (a.regulated ? 1 : 0);
        case 'rating':
        default:
          return b.overall_rating - a.overall_rating;
      }
    });

    setFilteredBrokers(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      regulated: '',
      minDeposit: '',
      maxLeverage: '',
      rating: 0,
      sortBy: 'rating'
    });
  };

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'sortBy') return false;
      return value !== '' && value !== 0;
    }).length;
  };

  // Pagination
  const totalPages = Math.ceil(filteredBrokers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBrokers = filteredBrokers.slice(startIndex, startIndex + itemsPerPage);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Forex Brokers in ${country.name}`,
    "description": country.description,
    "url": `https://bestforexbrokers.com/countries/${country.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": brokers.length,
      "itemListElement": brokers.slice(0, 10).map((broker, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://bestforexbrokers.com/broker/${broker.slug}`,
        "name": broker.name
      }))
    }
  };

  return (
    <MainLayout
      title={`Best Forex Brokers in ${country.name} 2025 - Licensed & Regulated`}
      description={`Find the best forex brokers operating in ${country.name}. Compare regulated brokers, spreads, platforms, and more from ${brokers.length} licensed providers.`}
      keywords={`forex brokers ${country.name.toLowerCase()}, ${country.regulatory_body}, regulated brokers, ${country.name.toLowerCase()} trading`}
      canonical={`https://bestforexbrokers.com/countries/${country.slug}`}
      breadcrumbs={[
        { label: 'Countries', href: '/countries' },
        { label: country.name }
      ]}
      jsonLd={jsonLd}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <span className="text-6xl mb-6 block">{country.flag_emoji}</span>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Forex Brokers in {country.name}
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              {country.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                  <span className="text-lg font-semibold">{country.broker_count} Brokers</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                  <span className="text-lg font-semibold">{country.regulated_broker_count} Regulated</span>
                </div>
              </div>
              <Link
                href="/compare"
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Compare Brokers
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Country Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About Forex Trading in {country.name}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {country.long_description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Facts</h3>
                  <ul className="space-y-2">
                    {country.key_facts.map((fact, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span className="text-gray-600">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Trading Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Regulator:</span>
                      <span className="font-medium">{country.regulatory_body}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timezone:</span>
                      <span className="font-medium">{country.timezone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Currency:</span>
                      <span className="font-medium">{country.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Language:</span>
                      <span className="font-medium">{country.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market Hours:</span>
                      <span className="font-medium">{country.market_hours}</span>
                    </div>
                  </div>
                </div>
              </div>

              {country.regulatory_requirements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Regulatory Requirements</h3>
                  <ul className="space-y-2">
                    {country.regulatory_requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <ShieldCheckIcon className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5 mr-3" />
                        <span className="text-gray-600">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {country.trading_restrictions && country.trading_restrictions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Trading Restrictions</h3>
                  <ul className="space-y-2">
                    {country.trading_restrictions.map((restriction, index) => (
                      <li key={index} className="flex items-start">
                        <InformationCircleIcon className="flex-shrink-0 w-5 h-5 text-orange-500 mt-0.5 mr-3" />
                        <span className="text-gray-600">{restriction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Regulator Info */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About {country.regulatory_body_full_name}
              </h3>
              <p className="text-gray-600 mb-4">
                The {country.regulatory_body_full_name} ({country.regulatory_body}) is the primary 
                financial regulator in {country.name}, ensuring that forex brokers operate 
                under strict compliance standards to protect retail traders.
              </p>
              {country.regulatory_website && (
                <a
                  href={country.regulatory_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Visit {country.regulatory_body} Website
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Brokers</span>
                  <span className="font-semibold text-gray-900">{country.broker_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Regulated Brokers</span>
                  <span className="font-semibold text-green-600">{country.regulated_broker_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Regulatory Coverage</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round((country.regulated_broker_count / country.broker_count) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Top Regulated Brokers */}
            {regulatedBrokers.length > 0 && (
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Regulated Brokers
                </h3>
                <div className="space-y-3">
                  {regulatedBrokers.slice(0, 5).map((broker, index) => (
                    <Link
                      key={broker.id}
                      href={`/broker/${broker.slug}`}
                      className="block p-3 bg-white rounded-lg border border-green-200 hover:border-green-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{broker.name}</span>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">
                            {broker.overall_rating}
                          </span>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(broker.overall_rating) ? 'text-yellow-400' : 'text-gray-200'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Countries */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Countries</h3>
              <div className="space-y-3">
                {nearbyCountries.map((nearbyCountry) => (
                  <Link
                    key={nearbyCountry.code}
                    href={`/countries/${nearbyCountry.slug}`}
                    className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <span className="text-2xl mr-3">{nearbyCountry.flag_emoji}</span>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{nearbyCountry.name}</span>
                      <div className="text-sm text-gray-500">{nearbyCountry.broker_count} brokers</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search brokers in ${country.name}...`}
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                  {getActiveFilterCount()}
                </span>
              )}
              <ChevronDownIcon className={`h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="regulation">Regulated First</option>
                <option value="name">Name A-Z</option>
                <option value="min_deposit">Lowest Min Deposit</option>
                <option value="max_leverage">Highest Leverage</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Regulation Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regulation Status
                  </label>
                  <select
                    value={filters.regulated}
                    onChange={(e) => handleFilterChange('regulated', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Brokers</option>
                    <option value="true">Regulated Only</option>
                    <option value="false">Non-Regulated</option>
                  </select>
                </div>

                {/* Min Deposit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Deposit
                  </label>
                  <select
                    value={filters.minDeposit}
                    onChange={(e) => handleFilterChange('minDeposit', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Any Amount</option>
                    <option value="0">No Minimum</option>
                    <option value="1-100">$1 - $100</option>
                    <option value="101-500">$101 - $500</option>
                    <option value="501-1000">$501 - $1,000</option>
                    <option value="1001-5000">$1,001 - $5,000</option>
                    <option value="5000">$5,000+</option>
                  </select>
                </div>

                {/* Leverage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Leverage
                  </label>
                  <select
                    value={filters.maxLeverage}
                    onChange={(e) => handleFilterChange('maxLeverage', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Any Leverage</option>
                    <option value="30">30:1+</option>
                    <option value="100">100:1+</option>
                    <option value="200">200:1+</option>
                    <option value="400">400:1+</option>
                    <option value="500">500:1+</option>
                    <option value="1000">1000:1+</option>
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={3}>3+ Stars</option>
                    <option value={3.5}>3.5+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {getActiveFilterCount() > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Clear all filters ({getActiveFilterCount()})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredBrokers.length} Brokers Found
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing {Math.min(currentBrokers.length, itemsPerPage)} of {filteredBrokers.length} brokers
            </p>
          </div>
        </div>

        {/* Broker Grid */}
        {currentBrokers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {currentBrokers.map((broker, index) => (
                <BrokerCard
                  key={broker.id}
                  broker={broker}
                  priority={startIndex + index + 1}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                    currentPage === 1
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No brokers found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Try adjusting your search terms or filters to find more brokers in {country.name}.
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // TODO: Fetch actual country slugs from database
  const countryData = [
    'united-states',
    'united-kingdom', 
    'australia',
    'germany',
    'cyprus',
    'japan',
    'singapore',
    'switzerland',
    'canada',
    'france'
  ];

  const paths = countryData.map((slug) => ({
    params: { slug }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  // TODO: Fetch actual data from database
  const mockCountries: { [key: string]: Country } = {
    'united-states': {
      code: 'US',
      name: 'United States',
      slug: 'united-states',
      flag_emoji: '🇺🇸',
      description: 'Find regulated forex brokers operating in the United States under CFTC and NFA oversight.',
      long_description: 'The United States has one of the most stringent regulatory environments for forex trading. The Commodity Futures Trading Commission (CFTC) and National Futures Association (NFA) ensure that only compliant brokers can serve US residents. US forex brokers must maintain significant capital reserves and follow strict operational guidelines.',
      regulatory_body: 'CFTC/NFA',
      regulatory_body_full_name: 'Commodity Futures Trading Commission',
      regulatory_website: 'https://cftc.gov',
      broker_count: 45,
      regulated_broker_count: 32,
      timezone: 'EST/EDT',
      currency: 'USD',
      language: 'English',
      market_hours: '5:00 PM Sunday - 5:00 PM Friday EST',
      key_facts: [
        'Highly regulated market with strict compliance requirements',
        'Major currency pairs with tight spreads available',
        'Maximum leverage limited to 50:1 for major pairs',
        'Segregated client funds mandatory',
        'FIFO (First In, First Out) rule applies'
      ],
      regulatory_requirements: [
        'Brokers must be registered with CFTC and NFA',
        'Minimum capital requirements of $20 million',
        'Segregated client funds in US banks',
        'Regular financial reporting and audits',
        'Compliance with anti-money laundering regulations'
      ],
      trading_restrictions: [
        'Maximum leverage 50:1 for major currency pairs',
        'Maximum leverage 20:1 for minor currency pairs',
        'FIFO rule - positions must be closed in order opened',
        'Hedging restrictions apply',
        'Limited availability of certain exotic pairs'
      ]
    },
    'united-kingdom': {
      code: 'UK',
      name: 'United Kingdom',
      slug: 'united-kingdom',
      flag_emoji: '🇬🇧',
      description: 'Discover FCA-regulated forex brokers serving UK residents with comprehensive investor protection.',
      long_description: 'The United Kingdom maintains a robust regulatory framework through the Financial Conduct Authority (FCA). UK brokers must adhere to strict capital requirements, segregate client funds, and participate in the Financial Services Compensation Scheme (FSCS) providing up to £85,000 protection per client.',
      regulatory_body: 'FCA',
      regulatory_body_full_name: 'Financial Conduct Authority',
      regulatory_website: 'https://fca.org.uk',
      broker_count: 67,
      regulated_broker_count: 54,
      timezone: 'GMT/BST',
      currency: 'GBP',
      language: 'English',
      market_hours: '10:00 PM Sunday - 10:00 PM Friday GMT',
      key_facts: [
        'FCA regulation ensures high standards of consumer protection',
        'FSCS compensation up to £85,000 per client',
        'Strong capital adequacy requirements',
        'Comprehensive product disclosure requirements',
        'Active enforcement and monitoring'
      ],
      regulatory_requirements: [
        'FCA authorization and ongoing supervision',
        'Segregated client money rules',
        'Participation in FSCS compensation scheme',
        'Regular capital adequacy reporting',
        'Treating Customers Fairly principles'
      ],
      trading_restrictions: [
        'Leverage restrictions under ESMA rules (30:1 for major pairs)',
        'Negative balance protection for retail clients',
        'Margin close-out at 50% of initial margin',
        'Restrictions on bonus incentives',
        'Enhanced risk warnings required'
      ]
    }
    // Add other countries as needed
  };

  const country = mockCountries[slug];
  
  if (!country) {
    return {
      notFound: true
    };
  }

  // Mock broker data for this country
  const mockBrokers: Broker[] = [
    {
      id: '1',
      name: 'OANDA',
      slug: 'oanda',
      logo_url: '/images/brokers/oanda.png',
      website_url: 'https://oanda.com',
      overall_rating: 4.6,
      min_deposit: 0,
      min_deposit_currency: '$',
      max_leverage: slug === 'united-states' ? 50 : 200,
      spreads_from: 0.8,
      commission: 'None on standard',
      regulated: true,
      regulations: [
        { regulator: country.regulatory_body, license_number: '123456', country: country.name }
      ],
      platforms: ['OANDA Trade', 'MetaTrader 4'],
      instruments_total: 70,
      pros: ['No minimum deposit', 'Excellent research'],
      cons: ['Limited cryptocurrency pairs'],
      founded_year: 1996,
      headquarters: slug === 'united-states' ? 'New York, USA' : 'London, UK',
      demo_account: true,
      swap_free: false,
      live_chat: true,
      phone_support: true,
      features: ['Advanced Charting', 'Economic Calendar'],
      cta_text: 'Visit OANDA',
      cta_url: 'https://oanda.com',
      accepts_country: true,
      local_support: true
    }
    // Add more mock brokers as needed
  ];

  const regulatedBrokers = mockBrokers.filter(b => b.regulated);

  const nearbyCountries = [
    { code: 'CA', name: 'Canada', slug: 'canada', flag_emoji: '🇨🇦', broker_count: 28 },
    { code: 'MX', name: 'Mexico', slug: 'mexico', flag_emoji: '🇲🇽', broker_count: 5 }
  ];

  return {
    props: {
      country,
      brokers: mockBrokers,
      regulatedBrokers,
      nearbyCountries
    },
    revalidate: 3600 // Revalidate every hour
  };
};