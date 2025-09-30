import { GetStaticProps, GetStaticPaths } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  XMarkIcon,
  InformationCircleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CogIcon,
  AcademicCapIcon,
  DevicePhoneMobileIcon
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
}

interface Category {
  slug: string;
  name: string;
  description: string;
  long_description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  broker_count: number;
  benefits: string[];
  considerations: string[];
}

interface CategoryPageProps {
  category: Category;
  brokers: Broker[];
  relatedCategories: Array<{
    slug: string;
    name: string;
    broker_count: number;
  }>;
}

interface FilterState {
  search: string;
  minDeposit: string;
  maxLeverage: string;
  regulation: string;
  rating: number;
  sortBy: string;
}

const categoryIcons: { [key: string]: React.ComponentType<any> } = {
  'ecn-brokers': ChartBarIcon,
  'market-makers': CurrencyDollarIcon,
  'stp-brokers': GlobeAltIcon,
  'regulated-brokers': ShieldCheckIcon,
  'social-trading': UserGroupIcon,
  'micro-account': CogIcon,
  'educational-brokers': AcademicCapIcon,
  'mobile-trading': DevicePhoneMobileIcon
};

export default function CategoryPage({ category, brokers, relatedCategories }: CategoryPageProps) {
  const [filteredBrokers, setFilteredBrokers] = useState<Broker[]>(brokers);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    minDeposit: '',
    maxLeverage: '',
    regulation: '',
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
      minDeposit: '',
      maxLeverage: '',
      regulation: '',
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

  const IconComponent = category.icon;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} - Best Forex Brokers`,
    "description": category.description,
    "url": `https://bestforexbrokers.com/categories/${category.slug}`,
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
      title={`${category.name} 2025 - Best ${category.name} Forex Brokers`}
      description={`Find the best ${category.name.toLowerCase()} for forex trading. Compare features, spreads, regulation, and more from ${brokers.length} top brokers.`}
      keywords={`${category.name.toLowerCase()}, ${category.slug}, forex brokers, trading platforms`}
      canonical={`https://bestforexbrokers.com/categories/${category.slug}`}
      breadcrumbs={[
        { label: 'Categories', href: '/categories' },
        { label: category.name }
      ]}
      jsonLd={jsonLd}
    >
      {/* Header */}
      <div className={`${category.gradient} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-lg">
                <IconComponent className="h-12 w-12" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Best {category.name}
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              {category.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <span className="text-lg font-semibold">{category.broker_count} Brokers</span>
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
        {/* Category Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About {category.name}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {category.long_description}
              </p>
              
              {category.benefits.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                  <ul className="space-y-2">
                    {category.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {category.considerations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Considerations</h3>
                  <ul className="space-y-2">
                    {category.considerations.map((consideration, index) => (
                      <li key={index} className="flex items-start">
                        <InformationCircleIcon className="flex-shrink-0 w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                        <span className="text-gray-600">{consideration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Related Categories */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Categories</h3>
              <div className="space-y-3">
                {relatedCategories.map((relatedCategory) => (
                  <Link
                    key={relatedCategory.slug}
                    href={`/categories/${relatedCategory.slug}`}
                    className="block p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{relatedCategory.name}</span>
                      <span className="text-sm text-gray-500">{relatedCategory.broker_count}</span>
                    </div>
                  </Link>
                ))}
              </div>
              
              <Link
                href="/categories"
                className="block mt-4 text-center text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Categories
              </Link>
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
                  placeholder={`Search ${category.name.toLowerCase()}...`}
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
                    <option value="ASIC">ASIC</option>
                    <option value="FCA">FCA</option>
                    <option value="CySEC">CySEC</option>
                    <option value="CFTC">CFTC</option>
                    <option value="BaFin">BaFin</option>
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
              {filteredBrokers.length} {category.name} Found
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
              Try adjusting your search terms or filters to find more {category.name.toLowerCase()}.
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
  // TODO: Fetch actual category slugs from database
  const categoryData = [
    'ecn-brokers',
    'market-makers', 
    'stp-brokers',
    'regulated-brokers',
    'social-trading',
    'micro-account',
    'educational-brokers',
    'mobile-trading'
  ];

  const paths = categoryData.map((slug) => ({
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
  const mockCategories: { [key: string]: Category } = {
    'ecn-brokers': {
      slug: 'ecn-brokers',
      name: 'ECN Brokers',
      description: 'Electronic Communication Network brokers offering direct market access with tight spreads and transparent pricing.',
      long_description: 'ECN (Electronic Communication Network) brokers provide traders with direct access to the interbank market through an electronic trading network. This model offers transparent pricing, tight spreads, and allows traders to see market depth. ECN brokers typically charge a commission per trade rather than marking up spreads.',
      icon: categoryIcons['ecn-brokers'],
      color: 'bg-blue-600',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
      broker_count: 45,
      benefits: [
        'Direct market access with transparent pricing',
        'Tight spreads, often starting from 0 pips',
        'No conflicts of interest as brokers don\'t take opposite trades',
        'Access to market depth and Level II pricing',
        'Faster execution speeds'
      ],
      considerations: [
        'Commission charges in addition to spreads',
        'Higher minimum deposits typically required',
        'More suitable for active traders',
        'May have wider spreads during low liquidity periods'
      ]
    },
    'market-makers': {
      slug: 'market-makers',
      name: 'Market Makers',
      description: 'Brokers that provide liquidity by taking the opposite side of your trades, often with fixed spreads.',
      long_description: 'Market maker brokers provide liquidity to their clients by taking the opposite side of trades. They typically offer fixed spreads and may not charge separate commissions. While this model can create potential conflicts of interest, many market makers are well-regulated and provide excellent trading conditions.',
      icon: categoryIcons['market-makers'],
      color: 'bg-green-600',
      gradient: 'bg-gradient-to-br from-green-500 to-green-700',
      broker_count: 38,
      benefits: [
        'Fixed spreads provide cost certainty',
        'No commission charges on most accounts',
        'Lower minimum deposits typically accepted',
        'Good for beginners and casual traders',
        'Guaranteed liquidity even in volatile markets'
      ],
      considerations: [
        'Potential conflicts of interest',
        'Spreads may be wider than ECN brokers',
        'Less transparency in pricing',
        'May experience requotes during high volatility'
      ]
    },
    'stp-brokers': {
      slug: 'stp-brokers',
      name: 'STP Brokers',
      description: 'Straight Through Processing brokers that route orders directly to liquidity providers without dealing desk intervention.',
      long_description: 'STP (Straight Through Processing) brokers route client orders directly to liquidity providers such as banks, financial institutions, and ECNs without manual intervention. This model combines elements of both ECN and market maker models, offering competitive spreads while maintaining execution transparency.',
      icon: categoryIcons['stp-brokers'],
      color: 'bg-purple-600',
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-700',
      broker_count: 52,
      benefits: [
        'Direct routing to multiple liquidity providers',
        'Competitive variable spreads',
        'No dealing desk intervention',
        'Fast order execution',
        'Access to institutional liquidity'
      ],
      considerations: [
        'Spreads can vary based on market conditions',
        'May experience wider spreads during news events',
        'Execution speed depends on liquidity provider response',
        'Some brokers may still have conflicts of interest'
      ]
    }
    // Add other categories as needed
  };

  const category = mockCategories[slug];
  
  if (!category) {
    return {
      notFound: true
    };
  }

  // Mock broker data for this category
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
        { regulator: 'ASIC', license_number: '335692', country: 'Australia' }
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
    }
    // Add more mock brokers as needed
  ];

  const relatedCategories = [
    { slug: 'stp-brokers', name: 'STP Brokers', broker_count: 52 },
    { slug: 'regulated-brokers', name: 'Highly Regulated', broker_count: 67 },
    { slug: 'micro-account', name: 'Micro Accounts', broker_count: 41 }
  ];

  return {
    props: {
      category,
      brokers: mockBrokers,
      relatedCategories
    },
    revalidate: 3600 // Revalidate every hour
  };
};