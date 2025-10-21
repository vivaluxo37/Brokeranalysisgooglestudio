import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';
import UnifiedBrokerCard from '../components/common/UnifiedBrokerCard';
import { unifiedBrokerService } from '../services/unifiedBrokerService';
import { SEOService } from '../services/seoService';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

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

const BrokersPage: React.FC = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<Array<{ slug: string; name: string }>>([]);
  const [regulators, setRegulators] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [filteredBrokers, setFilteredBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrokersData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch real broker data from unified service
        const brokerData = await unifiedBrokerService.getBrokers();
        
        // Transform broker data to match the expected interface
        const processedBrokers: Broker[] = brokerData.map(broker => ({
          id: broker.id,
          name: broker.name,
          slug: broker.id, // Use id as slug for consistency
          logo_url: broker.logoUrl || `/images/brokers/${broker.id}.png`,
          website_url: broker.websiteUrl || '',
          overall_rating: broker.score || 0,
          min_deposit: broker.accessibility?.minDeposit || 0,
          min_deposit_currency: '$',
          max_leverage: parseInt(
            broker.tradingConditions?.maxLeverage?.replace(/[^0-9]/g, '') || '0'
          ),
          spreads_from: parseFloat(
            String(broker.tradingConditions?.spreads?.eurusd || '0').replace(/[^0-9.]/g, '')
          ),
          commission: broker.fees?.trading?.commissionStructure || 'Varies',
          regulated: (broker.regulation?.regulators?.length || 0) > 0,
          regulations: broker.regulation?.regulators?.map(reg => ({
            regulator: reg,
            country: 'Global',
            license_number: ''
          })) || [],
          platforms: broker.technology?.platforms || [],
          instruments_total: 
            (broker.tradableInstruments?.forexPairs || 0) +
            (broker.tradableInstruments?.stocks || 0) +
            (broker.tradableInstruments?.commodities || 0) +
            (broker.tradableInstruments?.indices || 0) +
            (broker.tradableInstruments?.cryptocurrencies || 0),
          pros: broker.pros || [],
          cons: broker.cons || [],
          founded_year: broker.foundingYear,
          headquarters: broker.headquarters || '',
          demo_account: broker.coreInfo?.demoAccount || false,
          swap_free: broker.accountManagement?.islamicAccount?.available || false,
          live_chat: broker.customerSupport?.channels?.includes('Live Chat') || false,
          phone_support: broker.customerSupport?.channels?.includes('Phone') || false,
          features: [],
          cta_text: 'Visit Broker',
          cta_url: broker.websiteUrl || '',
          country_availability: {
            available: [],
            restricted: []
          }
        }));

        setBrokers(processedBrokers);
        setFilteredBrokers(processedBrokers);
        setTotalCount(processedBrokers.length);

        // Extract unique regulators and platforms for filters
        const uniqueRegulators = new Set<string>();
        const uniquePlatforms = new Set<string>();
        
        processedBrokers.forEach(broker => {
          broker.regulations?.forEach(reg => {
            if (reg.regulator) uniqueRegulators.add(reg.regulator);
          });
          broker.platforms?.forEach(platform => {
            if (platform) uniquePlatforms.add(platform);
          });
        });

        // Set up filter options
        setCategories([
          { slug: 'ecn-brokers', name: 'ECN Brokers' },
          { slug: 'stp-brokers', name: 'STP Brokers' },
          { slug: 'market-makers', name: 'Market Makers' },
          { slug: 'mt4-brokers', name: 'MT4 Brokers' },
          { slug: 'mt5-brokers', name: 'MT5 Brokers' },
          { slug: 'low-spread', name: 'Low Spread Brokers' }
        ]);
        
        setRegulators(Array.from(uniqueRegulators).sort());
        setPlatforms(Array.from(uniquePlatforms).sort());

        console.log(`✅ Loaded ${processedBrokers.length} brokers successfully`);

      } catch (err) {
        console.error('💥 Error fetching brokers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load brokers data');
      } finally {
        setLoading(false);
      }
    };

    fetchBrokersData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, brokers]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading brokers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Brokers</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Increased default to 20 for better UX

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

  // Generate SEO data
  const seoConfig = SEOService.generateBrokerListingMeta('all');
  const structuredData = SEOService.generateListingStructuredData('all', filteredBrokers);
  const breadcrumbs = SEOService.generateBreadcrumbs([
    { name: 'Home', url: '/' },
    { name: 'All Brokers' }
  ]);

  return (
    <>
      <MetaTags
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords.join(', ')}
        canonical={seoConfig.canonical}
      />

      <JsonLdSchema data={structuredData} />
      <JsonLdSchema data={breadcrumbs} />

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li className="flex items-center">
                <Link to="/" className="text-blue-600 hover:text-blue-800">
                  Home
                </Link>
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-500">All Brokers</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

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
              to="/compare"
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
                <UnifiedBrokerCard
                  key={broker.id}
                  broker={broker}
                  priority={startIndex + index + 1}
                  variant="compact"
                />
              ))}
            </div>

            {/* Pagination with controls */}
            {totalPages > 1 && (
              <div className="mt-8 space-y-4">
                {/* Items per page selector */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <label htmlFor="items-per-page" className="text-sm text-gray-600">
                      Show:
                    </label>
                    <select
                      id="items-per-page"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1); // Reset to first page when changing items per page
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={10}>10 brokers</option>
                      <option value={20}>20 brokers</option>
                      <option value={30}>30 brokers</option>
                      <option value={50}>50 brokers</option>
                      <option value={100}>100 brokers</option>
                    </select>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredBrokers.length)} of {filteredBrokers.length} brokers
                  </div>
                </div>

                {/* Pagination controls */}
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 border rounded-lg font-medium transition-colors ${
                      currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    title="First page"
                  >
                    ««
                  </button>
                  
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

                    if (pageNum < 1 || pageNum > totalPages) return null;

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
                  
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 border rounded-lg font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    title="Last page"
                  >
                    »»
                  </button>
                </div>

                {/* Go to page input */}
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm text-gray-600">Go to page:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = Math.max(1, Math.min(totalPages, Number(e.target.value)));
                      setCurrentPage(page);
                    }}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-gray-600">of {totalPages}</span>
                </div>
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
    </>
  );
};

export default BrokersPage;