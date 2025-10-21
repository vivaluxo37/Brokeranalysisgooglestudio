import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  StarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface Broker {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  overall_rating: number;
  trust_rating: number;
  platform_rating: number;
  costs_rating: number;
  service_rating: number;
  
  // Basic Info
  min_deposit?: number;
  min_deposit_currency?: string;
  max_leverage?: number;
  spreads_from?: number;
  commission?: string;
  demo_account?: boolean;
  swap_free?: boolean;
  
  // Regulation
  regulations?: Array<{
    regulator: string;
    license_number?: string;
    country: string;
  }>;
  
  // Platforms
  platforms?: string[];
  mobile_apps?: string[];
  
  // Instruments
  forex_pairs?: number;
  cfds?: number;
  commodities?: number;
  indices?: number;
  crypto?: number;
  stocks?: number;
  instruments_total?: number;
  
  // Costs
  eur_usd_spread?: string;
  gbp_usd_spread?: string;
  usd_jpy_spread?: string;
  inactivity_fee?: number;
  withdrawal_fee?: string;
  
  // Features
  features?: string[];
  pros?: string[];
  cons?: string[];
  
  // Support
  support_languages?: string[];
  support_hours?: string;
  live_chat?: boolean;
  phone_support?: boolean;
  email_support?: boolean;
  
  // Payments
  deposit_methods?: string[];
  withdrawal_methods?: string[];
  
  // Account Types
  account_types?: Array<{
    name: string;
    min_deposit?: number;
    spreads_from?: number;
    commission?: string;
  }>;
  
  cta_url?: string;
  website_url: string;
}

const ComparePage: React.FC = () => {
  const [allBrokers, setAllBrokers] = useState<Broker[]>([]);
  const [featuredBrokers, setFeaturedBrokers] = useState<Broker[]>([]);
  const [selectedBrokers, setSelectedBrokers] = useState<Broker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBrokers, setFilteredBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrokersData = async () => {
      try {
        setLoading(true);

        // Mock broker data - replace with actual API call
        const mockBrokers: Broker[] = [
          {
            id: '1',
            name: 'IC Markets',
            slug: 'ic-markets',
            logo_url: '/images/brokers/ic-markets.png',
            website_url: 'https://icmarkets.com',
            overall_rating: 4.8,
            trust_rating: 4.9,
            platform_rating: 4.7,
            costs_rating: 4.8,
            service_rating: 4.6,
            min_deposit: 200,
            min_deposit_currency: '$',
            max_leverage: 500,
            spreads_from: 0.0,
            commission: '$3.50 per lot',
            demo_account: true,
            swap_free: true,
            regulations: [
              { regulator: 'ASIC', license_number: '335692', country: 'Australia' },
              { regulator: 'CySEC', license_number: '362/18', country: 'Cyprus' }
            ],
            platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader'],
            forex_pairs: 61,
            cfds: 200,
            commodities: 22,
            indices: 20,
            crypto: 12,
            stocks: 0,
            instruments_total: 232,
            live_chat: true,
            phone_support: true,
            email_support: true,
            support_hours: '24/5',
            cta_url: 'https://icmarkets.com'
          },
          {
            id: '2',
            name: 'Pepperstone',
            slug: 'pepperstone',
            website_url: 'https://pepperstone.com',
            overall_rating: 4.7,
            trust_rating: 4.8,
            platform_rating: 4.9,
            costs_rating: 4.6,
            service_rating: 4.5,
            min_deposit: 200,
            min_deposit_currency: '$',
            max_leverage: 400,
            spreads_from: 0.1,
            commission: '$3.50 per lot',
            demo_account: true,
            swap_free: true,
            regulations: [
              { regulator: 'ASIC', license_number: '414530', country: 'Australia' },
              { regulator: 'FCA', license_number: '684312', country: 'UK' }
            ],
            platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView'],
            forex_pairs: 90,
            cfds: 1100,
            commodities: 25,
            indices: 18,
            crypto: 5,
            stocks: 0,
            instruments_total: 1200,
            live_chat: true,
            phone_support: true,
            email_support: true,
            support_hours: '24/5',
            cta_url: 'https://pepperstone.com'
          },
          {
            id: '3',
            name: 'XM',
            slug: 'xm',
            website_url: 'https://xm.com',
            overall_rating: 4.5,
            trust_rating: 4.6,
            platform_rating: 4.4,
            costs_rating: 4.3,
            service_rating: 4.7,
            min_deposit: 5,
            min_deposit_currency: '$',
            max_leverage: 1000,
            spreads_from: 0.6,
            commission: 'None on standard',
            demo_account: true,
            swap_free: true,
            regulations: [
              { regulator: 'CySEC', license_number: '120/10', country: 'Cyprus' },
              { regulator: 'ASIC', license_number: '443670', country: 'Australia' }
            ],
            platforms: ['MetaTrader 4', 'MetaTrader 5'],
            forex_pairs: 57,
            cfds: 900,
            commodities: 32,
            indices: 24,
            crypto: 31,
            stocks: 0,
            instruments_total: 1000,
            live_chat: true,
            phone_support: true,
            email_support: true,
            support_hours: '24/5',
            cta_url: 'https://xm.com'
          }
        ];

        setAllBrokers(mockBrokers);
        setFeaturedBrokers(mockBrokers.slice(0, 3));
        setFilteredBrokers(mockBrokers);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load brokers data');
      } finally {
        setLoading(false);
      }
    };

    fetchBrokersData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comparison tool...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Comparison</h2>
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

  const addBrokerToComparison = (broker: Broker) => {
    if (selectedBrokers.length < 4 && !selectedBrokers.find(b => b.id === broker.id)) {
      setSelectedBrokers([...selectedBrokers, broker]);
    }
  };

  const removeBrokerFromComparison = (brokerId: string) => {
    setSelectedBrokers(selectedBrokers.filter(b => b.id !== brokerId));
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const sizeClasses = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarSolidIcon key={i} className={`${sizeClasses} text-yellow-400`} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className={`${sizeClasses} text-gray-300`} />
            <StarSolidIcon 
              className={`${sizeClasses} text-yellow-400 absolute top-0 left-0`}
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          </div>
        );
      } else {
        stars.push(<StarIcon key={i} className={`${sizeClasses} text-gray-300`} />);
      }
    }
    return stars;
  };

  const getComparisonValue = (value: any, type: 'boolean' | 'array' | 'number' | 'string' = 'string') => {
    if (value === undefined || value === null) {
      return <span className="text-gray-400">-</span>;
    }

    switch (type) {
      case 'boolean':
        return value ? (
          <CheckIcon className="h-5 w-5 text-green-600 mx-auto" />
        ) : (
          <XMarkIcon className="h-5 w-5 text-red-600 mx-auto" />
        );
      case 'array':
        return Array.isArray(value) ? value.length : 0;
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      default:
        return value;
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Compare Forex Brokers - Side by Side Comparison Tool",
    "description": "Compare the best forex brokers side by side. Detailed comparison of spreads, regulation, platforms, and features.",
    "url": "https://bestforexbrokers.com/compare"
  };

  return (
    <>
      <MetaTags
        title="Compare Forex Brokers 2025 - Side by Side Comparison Tool"
        description="Compare the best forex brokers side by side. Detailed comparison of spreads, regulation, platforms, and features to help you choose the right broker."
        keywords="compare forex brokers, broker comparison, forex broker comparison tool, side by side comparison"
        canonical="https://bestforexbrokers.com/compare"
      />

      <JsonLdSchema data={jsonLd} />

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
                <span className="text-gray-500">Compare Brokers</span>
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
              Compare Forex Brokers
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Compare up to 4 brokers side by side to find the perfect trading platform for your needs.
            </p>
            
            {selectedBrokers.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 inline-block">
                <p className="text-blue-800 text-sm">
                  <strong>{selectedBrokers.length}/4</strong> brokers selected for comparison
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Broker Selection */}
        {selectedBrokers.length < 4 && (
          <div className="mb-12">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Select Brokers to Compare
              </h2>
              
              {/* Search */}
              <div className="relative mb-6">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search brokers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Featured Brokers */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Featured Brokers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredBrokers
                    .filter(broker => !selectedBrokers.find(b => b.id === broker.id))
                    .slice(0, 4)
                    .map((broker) => (
                    <button
                      key={broker.id}
                      onClick={() => addBrokerToComparison(broker)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        {broker.logo_url ? (
                          <img
                            src={broker.logo_url}
                            alt={`${broker.name} logo`}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {broker.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{broker.name}</div>
                          <div className="flex items-center">
                            <div className="flex mr-1">{renderStars(broker.overall_rating)}</div>
                            <span className="text-xs text-gray-500">{broker.overall_rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Min: ${broker.min_deposit || 0}</span>
                        <PlusIcon className="h-4 w-4 text-blue-600" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Results */}
              {searchQuery && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Search Results</h3>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {filteredBrokers
                        .filter(broker => !selectedBrokers.find(b => b.id === broker.id))
                        .map((broker) => (
                        <button
                          key={broker.id}
                          onClick={() => addBrokerToComparison(broker)}
                          className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            {broker.logo_url ? (
                              <img
                                src={broker.logo_url}
                                alt={`${broker.name} logo`}
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                  {broker.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{broker.name}</div>
                              <div className="flex items-center">
                                <div className="flex mr-1">{renderStars(broker.overall_rating)}</div>
                                <span className="text-xs text-gray-500">{broker.overall_rating}</span>
                              </div>
                            </div>
                          </div>
                          <PlusIcon className="h-4 w-4 text-blue-600" />
                        </button>
                      ))}
                      
                      {filteredBrokers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No brokers found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {selectedBrokers.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Header Row */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky left-0 z-10 bg-gray-50 px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-200">
                      Broker
                    </th>
                    {selectedBrokers.map((broker) => (
                      <th key={broker.id} className="px-6 py-4 text-center min-w-48">
                        <div className="flex flex-col items-center space-y-2">
                          <button
                            onClick={() => removeBrokerFromComparison(broker.id)}
                            className="self-end text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                          
                          {broker.logo_url ? (
                            <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden p-1 flex items-center justify-center">
                              <img
                                src={broker.logo_url}
                                alt={`${broker.name} logo`}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold">
                                {broker.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{broker.name}</div>
                            <div className="flex items-center justify-center mt-1">
                              <div className="flex mr-1">{renderStars(broker.overall_rating)}</div>
                              <span className="text-sm text-gray-600">{broker.overall_rating}</span>
                            </div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {/* CTA Row */}
                  <tr className="bg-blue-50">
                    <td className="sticky left-0 z-10 bg-blue-50 px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Visit Broker
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        <a
                          href={broker.cta_url || broker.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Visit {broker.name}
                        </a>
                      </td>
                    ))}
                  </tr>

                  {/* Overall Rating */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Overall Rating
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="flex mr-2">{renderStars(broker.overall_rating, 'md')}</div>
                          <span className="font-semibold text-gray-900">{broker.overall_rating}/5</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Trust Rating */}
                  <tr className="bg-gray-50">
                    <td className="sticky left-0 z-10 bg-gray-50 px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Trust & Safety
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="flex mr-2">{renderStars(broker.trust_rating, 'md')}</div>
                          <span className="font-semibold text-gray-900">{broker.trust_rating}/5</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Basic Info Section */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-bold text-gray-900 border-r border-gray-200 bg-gray-100">
                      BASIC INFORMATION
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 bg-gray-100"></td>
                    ))}
                  </tr>

                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Minimum Deposit
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        <span className="font-semibold">
                          {broker.min_deposit === 0 
                            ? 'No minimum' 
                            : `${broker.min_deposit_currency || '$'}${broker.min_deposit?.toLocaleString() || '-'}`
                          }
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="sticky left-0 z-10 bg-gray-50 px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Max Leverage
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        <span className="font-semibold">
                          {broker.max_leverage ? `${broker.max_leverage}:1` : '-'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Spreads From
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        <span className="font-semibold">
                          {broker.spreads_from !== undefined ? `${broker.spreads_from} pips` : '-'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="sticky left-0 z-10 bg-gray-50 px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Commission
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        {getComparisonValue(broker.commission || 'Varies')}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Demo Account
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        {getComparisonValue(broker.demo_account, 'boolean')}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="sticky left-0 z-10 bg-gray-50 px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Swap-Free Accounts
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        {getComparisonValue(broker.swap_free, 'boolean')}
                      </td>
                    ))}
                  </tr>

                  {/* Regulation Section */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-bold text-gray-900 border-r border-gray-200 bg-gray-100">
                      REGULATION
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 bg-gray-100"></td>
                    ))}
                  </tr>

                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Regulators
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        {broker.regulations && broker.regulations.length > 0 ? (
                          <div className="space-y-1">
                            {broker.regulations.map((reg, idx) => (
                              <div key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-1 mb-1">
                                <ShieldCheckIcon className="h-3 w-3 mr-1" />
                                {reg.regulator}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Platforms Section */}
                  <tr className="bg-gray-50">
                    <td className="sticky left-0 z-10 bg-gray-50 px-6 py-4 font-bold text-gray-900 border-r border-gray-200 bg-gray-100">
                      TRADING PLATFORMS
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 bg-gray-100"></td>
                    ))}
                  </tr>

                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Platforms Available
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        {broker.platforms && broker.platforms.length > 0 ? (
                          <div className="space-y-1">
                            {broker.platforms.map((platform, idx) => (
                              <div key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mb-1">
                                {platform}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Instruments Section */}
                  <tr className="bg-gray-50">
                    <td className="sticky left-0 z-10 bg-gray-50 px-6 py-4 font-bold text-gray-900 border-r border-gray-200 bg-gray-100">
                      TRADING INSTRUMENTS
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 bg-gray-100"></td>
                    ))}
                  </tr>

                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Total Instruments
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        <span className="font-semibold">
                          {broker.instruments_total ? `${broker.instruments_total}+` : '-'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="sticky left-0 z-10 bg-gray-50 px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Forex Pairs
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        {getComparisonValue(broker.forex_pairs)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      CFDs
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        {getComparisonValue(broker.cfds)}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="sticky left-0 z-10 bg-gray-50 px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Cryptocurrencies
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        {getComparisonValue(broker.crypto)}
                      </td>
                    ))}
                  </tr>

                  {/* Support Section */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-bold text-gray-900 border-r border-gray-200 bg-gray-100">
                      CUSTOMER SUPPORT
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 bg-gray-100"></td>
                    ))}
                  </tr>

                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Live Chat
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        {getComparisonValue(broker.live_chat, 'boolean')}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="sticky left-0 z-10 bg-gray-50 px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Phone Support
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        {getComparisonValue(broker.phone_support, 'boolean')}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Support Hours
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        {getComparisonValue(broker.support_hours || '24/5')}
                      </td>
                    ))}
                  </tr>

                  {/* Final CTA Row */}
                  <tr className="bg-blue-50">
                    <td className="sticky left-0 z-10 bg-blue-50 px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Choose Your Broker
                    </td>
                    {selectedBrokers.map((broker) => (
                      <td key={broker.id} className="px-6 py-4 text-center">
                        <div className="space-y-2">
                          <a
                            href={broker.cta_url || broker.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Open Account
                          </a>
                          <Link
                            to={`/broker/${broker.slug}`}
                            className="block text-blue-600 hover:text-blue-700 text-sm transition-colors"
                          >
                            Read Review
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedBrokers.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select Brokers to Compare
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Choose up to 4 brokers from the list above to see a detailed side-by-side comparison.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ComparePage;