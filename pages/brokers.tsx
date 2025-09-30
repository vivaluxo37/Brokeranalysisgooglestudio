import { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  XMarkIcon,
  CheckIcon
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
  country_availability?: {
    available?: string[];
    restricted?: string[];
  };
}

interface BrokersPageProps {
  brokers: Broker[];
  totalCount: number;
  categories: Array<{
    slug: string;
    name: string;
  }>;
  regulators: string[];
  platforms: string[];
}

interface FilterState {
  search: string;
  category: string;
  minDeposit: string;
  maxLeverage: string;
  regulation: string;
  platforms: string[];
  features: string[];
  rating: number;
  sortBy: string;
  country: string;
}

export default function BrokersPage({ 
  brokers, 
  totalCount, 
  categories, 
  regulators, 
  platforms 
}: BrokersPageProps) {
  const router = useRouter();
  const [filteredBrokers, setFilteredBrokers] = useState<Broker[]>(brokers);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    minDeposit: '',
    maxLeverage: '',
    regulation: '',
    platforms: [],
    features: [],
    rating: 0,
    sortBy: 'rating',
    country: ''
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
        broker.headquarters?.toLowerCase().includes(searchTerm) ||
        broker.pros?.some(pro => pro.toLowerCase().includes(searchTerm)) ||
        broker.features?.some(feature => feature.toLowerCase().includes(searchTerm))
      );
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

    // Regulation filter
    if (filters.regulation) {
      filtered = filtered.filter(broker =>
        broker.regulations?.some(reg => 
          reg.regulator.toLowerCase() === filters.regulation.toLowerCase()
        )
      );
    }

    // Platform filter
    if (filters.platforms.length > 0) {
      filtered = filtered.filter(broker =>
        broker.platforms && filters.platforms.some(platform =>
          broker.platforms!.includes(platform)
        )
      );
    }

    // Features filter
    if (filters.features.length > 0) {
      filtered = filtered.filter(broker => {
        const brokerFeatures = [
          ...(broker.features || []),
          broker.demo_account && 'Demo Account',
          broker.swap_free && 'Swap-Free Accounts',
          broker.live_chat && 'Live Chat',
          broker.phone_support && 'Phone Support'
        ].filter(Boolean);
        
        return filters.features.some(feature =>
          brokerFeatures.includes(feature)
        );
      });
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
        case 'founded_year':
          return (b.founded_year || 0) - (a.founded_year || 0);
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

  const handleArrayFilterChange = (key: 'platforms' | 'features', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minDeposit: '',
      maxLeverage: '',
      regulation: '',
      platforms: [],
      features: [],
      rating: 0,
      sortBy: 'rating',
      country: ''
    });
  };

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'sortBy') return false;
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== 0;
    }).length;
  };

  // Pagination
  const totalPages = Math.ceil(filteredBrokers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBrokers = filteredBrokers.slice(startIndex, endIndex);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Forex Brokers Directory - Complete List",
    "description": "Browse and compare all forex brokers. Filter by regulation, spreads, platforms, and more.",
    "url": "https://bestforexbrokers.com/brokers",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": totalCount,
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
      title="All Forex Brokers 2025 - Complete Directory & Reviews"
      description="Browse and compare all forex brokers. Filter by regulation, spreads, platforms, and more. Find the perfect broker for your trading needs."
      keywords="forex brokers directory, all forex brokers, broker comparison, forex broker reviews, trading platforms"
      canonical="https://bestforexbrokers.com/brokers"
      breadcrumbs={[{ label: 'All Brokers' }]}
      jsonLd={jsonLd}
    >
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Forex Brokers
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Browse our complete directory of {totalCount} forex brokers. 
              Use filters to find the perfect broker for your trading needs.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search brokers by name, country, or features..."
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
                <option value="name">Name A-Z</option>
                <option value="min_deposit">Lowest Min Deposit</option>
                <option value="max_leverage">Highest Leverage</option>
                <option value="founded_year">Newest First</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                {/* Regulation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regulation
                  </label>
                  <select
                    value={filters.regulation}
                    onChange={(e) => handleFilterChange('regulation', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Regulators</option>
                    {regulators.map((regulator) => (
                      <option key={regulator} value={regulator}>
                        {regulator}
                      </option>
                    ))}
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

              {/* Platform Filters */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Trading Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform}
                      onClick={() => handleArrayFilterChange('platforms', platform)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.platforms.includes(platform)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {platform}
                      {filters.platforms.includes(platform) && (
                        <XMarkIcon className="inline-block h-3 w-3 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Filters */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Features
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Demo Account', 'Swap-Free Accounts', 'Live Chat', 'Phone Support', 'Mobile App', 'Copy Trading', 'Social Trading', 'Islamic Accounts'].map((feature) => (
                    <button
                      key={feature}
                      onClick={() => handleArrayFilterChange('features', feature)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.features.includes(feature)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {feature}
                      {filters.features.includes(feature) && (
                        <XMarkIcon className="inline-block h-3 w-3 ml-1" />
                      )}
                    </button>
                  ))}
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
              {filteredBrokers.length === totalCount 
                ? `Showing all ${totalCount} brokers` 
                : `Showing ${filteredBrokers.length} of ${totalCount} brokers`
              }
            </p>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            <Link
              href="/compare"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Compare Brokers
            </Link>
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

                {/* Page Numbers */}
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }

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
          /* No Results */
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No brokers found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Try adjusting your search terms or filters to find more brokers.
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

export const getStaticProps: GetStaticProps = async () => {
  // TODO: Fetch actual broker data from database
  // For now, we'll use mock data
  const mockBrokers: Broker[] = [
    {
      id: '1',
      name: 'IC Markets',
      slug: 'ic-markets',
      logo_url: '/images/brokers/ic-markets.png',
      website_url: 'https://icmarkets.com',
      overall_rating: 4.8,
      min_deposit: 200,
      min_deposit_currency: '$',
      max_leverage: 500,
      spreads_from: 0.0,
      commission: '$3.50 per lot',
      regulated: true,
      regulations: [
        { regulator: 'ASIC', license_number: '335692', country: 'Australia' },
        { regulator: 'CySEC', license_number: '362/18', country: 'Cyprus' }
      ],
      platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader'],
      instruments_total: 232,
      pros: ['Raw spreads from 0.0 pips', 'Excellent execution speeds'],
      cons: ['Higher minimum deposit'],
      founded_year: 2007,
      headquarters: 'Sydney, Australia',
      demo_account: true,
      swap_free: true,
      live_chat: true,
      phone_support: true,
      features: ['ECN Execution', 'Raw Spreads'],
      cta_text: 'Visit IC Markets',
      cta_url: 'https://icmarkets.com'
    },
    {
      id: '2',
      name: 'Pepperstone',
      slug: 'pepperstone',
      website_url: 'https://pepperstone.com',
      overall_rating: 4.7,
      min_deposit: 200,
      min_deposit_currency: '$',
      max_leverage: 400,
      spreads_from: 0.1,
      commission: '$3.50 per lot',
      regulated: true,
      regulations: [
        { regulator: 'ASIC', license_number: '414530', country: 'Australia' },
        { regulator: 'FCA', license_number: '684312', country: 'UK' }
      ],
      platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView'],
      instruments_total: 1200,
      pros: ['TradingView integration', 'Fast execution'],
      cons: ['Limited educational resources'],
      founded_year: 2010,
      headquarters: 'Melbourne, Australia',
      demo_account: true,
      swap_free: true,
      live_chat: true,
      phone_support: true,
      features: ['TradingView', 'Copy Trading'],
      cta_text: 'Visit Pepperstone',
      cta_url: 'https://pepperstone.com'
    },
    {
      id: '3',
      name: 'XM',
      slug: 'xm',
      website_url: 'https://xm.com',
      overall_rating: 4.5,
      min_deposit: 5,
      min_deposit_currency: '$',
      max_leverage: 1000,
      spreads_from: 0.6,
      commission: 'None on standard',
      regulated: true,
      regulations: [
        { regulator: 'CySEC', license_number: '120/10', country: 'Cyprus' },
        { regulator: 'ASIC', license_number: '443670', country: 'Australia' }
      ],
      platforms: ['MetaTrader 4', 'MetaTrader 5'],
      instruments_total: 1000,
      pros: ['Very low minimum deposit', 'Excellent education'],
      cons: ['Higher spreads on standard account'],
      founded_year: 2009,
      headquarters: 'Cyprus',
      demo_account: true,
      swap_free: true,
      live_chat: true,
      phone_support: true,
      features: ['Educational Resources', 'Multilingual Support'],
      cta_text: 'Visit XM',
      cta_url: 'https://xm.com'
    }
  ];

  const categories = [
    { slug: 'ecn-brokers', name: 'ECN Brokers' },
    { slug: 'market-makers', name: 'Market Makers' },
    { slug: 'stp-brokers', name: 'STP Brokers' }
  ];

  const regulators = ['ASIC', 'FCA', 'CySEC', 'CFTC', 'BaFin', 'FINMA'];
  const platforms = ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView', 'Proprietary'];

  return {
    props: {
      brokers: mockBrokers,
      totalCount: mockBrokers.length,
      categories,
      regulators,
      platforms
    },
    revalidate: 3600 // Revalidate every hour
  };
};