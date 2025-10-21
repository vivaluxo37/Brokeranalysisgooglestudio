import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  StarIcon, 
  CheckIcon, 
  XMarkIcon, 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import BrokerCard from '../../../components/brokers/BrokerCard';
import MetaTags from '../../../components/common/MetaTags';
import JsonLdSchema from '../../../components/common/JsonLdSchema';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

interface BrokerPageProps {
  broker: {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
    website_url: string;
    founded_year?: number;
    headquarters?: string;
    overview: string;
    
    // Ratings
    overall_rating: number;
    trust_rating: number;
    platform_rating: number;
    costs_rating: number;
    service_rating: number;
    features_rating: number;
    
    // Basic Info
    min_deposit?: number;
    min_deposit_currency?: string;
    max_leverage?: number;
    spreads_from?: number;
    commission?: string;
    swap_free?: boolean;
    demo_account?: boolean;
    
    // Regulation
    regulated?: boolean;
    regulations?: Array<{
      regulator: string;
      license_number?: string;
      country: string;
      website?: string;
    }>;
    
    // Platforms & Tools
    platforms?: string[];
    trading_tools?: string[];
    mobile_apps?: Array<{
      platform: string;
      ios_rating?: number;
      android_rating?: number;
    }>;
    
    // Account Types
    account_types?: Array<{
      name: string;
      min_deposit?: number;
      spreads_from?: number;
      commission?: string;
      description?: string;
    }>;
    
    // Instruments
    forex_pairs?: number;
    cfds?: number;
    commodities?: number;
    indices?: number;
    crypto?: number;
    stocks?: number;
    instruments_total?: number;
    
    // Costs
    eur_usd_spread?: number;
    gbp_usd_spread?: number;
    usd_jpy_spread?: number;
    overnight_fees?: string;
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
    deposit_time?: string;
    withdrawal_time?: string;
    
    // Education & Research
    education_resources?: string[];
    research_tools?: string[];
    market_analysis?: boolean;
    webinars?: boolean;
    
    // Country availability
    country_availability?: {
      available?: string[];
      restricted?: string[];
    };
    
    // Promotions
    current_promotions?: Array<{
      title: string;
      description: string;
      terms?: string;
      expiry?: string;
    }>;
    
    // Reviews & Testimonials
    user_reviews?: Array<{
      rating: number;
      title: string;
      comment: string;
      author: string;
      date: string;
      verified?: boolean;
    }>;
    
    // Meta
    last_updated: string;
    cta_text?: string;
    cta_url?: string;
  };
  similarBrokers: any[];
  seoContent: {
    title: string;
    description: string;
    keywords: string;
    h1: string;
    review_summary: string;
    bottom_line: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
}

const BrokerDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [broker, setBroker] = useState<any>(null);
  const [similarBrokers, setSimilarBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'platforms' | 'costs' | 'accounts' | 'support' | 'reviews'>('overview');
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  useEffect(() => {
    if (!slug) {
      setError('No broker slug provided');
      setLoading(false);
      return;
    }

    // Fetch broker data
    const fetchBrokerData = async () => {
      try {
        setLoading(true);
        // For now, use mock data based on slug
        if (['ic-markets', 'pepperstone', 'xm'].includes(slug)) {
          const mockBroker = {
            id: '1',
            name: slug === 'ic-markets' ? 'IC Markets' : slug === 'pepperstone' ? 'Pepperstone' : 'XM',
            slug: slug,
            logo_url: `/images/brokers/${slug}.png`,
            website_url: `https://${slug}.com`,
            founded_year: 2007,
            headquarters: 'Sydney, Australia',
            overview: 'Leading ECN forex broker offering raw spreads and institutional-grade execution.',
            overall_rating: 4.8,
            trust_rating: 4.9,
            platform_rating: 4.7,
            costs_rating: 4.8,
            service_rating: 4.6,
            features_rating: 4.7,
            min_deposit: 200,
            min_deposit_currency: '$',
            max_leverage: 500,
            spreads_from: 0.0,
            commission: '$3.50 per lot',
            swap_free: true,
            demo_account: true,
            regulated: true,
            regulations: [
              { regulator: 'ASIC', license_number: '335692', country: 'Australia' },
              { regulator: 'CySEC', license_number: '362/18', country: 'Cyprus' }
            ],
            platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader'],
            trading_tools: ['Economic Calendar', 'VPS', 'Autochartist'],
            mobile_apps: [
              { platform: 'MetaTrader 4 Mobile', ios_rating: 4.5, android_rating: 4.3 }
            ],
            account_types: [
              {
                name: 'Standard Account',
                min_deposit: 200,
                spreads_from: 1.0,
                commission: 'None'
              }
            ],
            forex_pairs: 61,
            cfds: 200,
            commodities: 22,
            indices: 20,
            crypto: 12,
            stocks: 0,
            instruments_total: 232,
            eur_usd_spread: '0.1 pips',
            gbp_usd_spread: '0.4 pips',
            usd_jpy_spread: '0.1 pips',
            overnight_fees: 'Standard swap rates',
            inactivity_fee: 0,
            withdrawal_fee: 'Free',
            features: ['ECN Execution', 'Raw Spreads'],
            pros: ['Raw spreads from 0.0 pips', 'Excellent execution speeds'],
            cons: ['Higher minimum deposit', 'Limited educational resources'],
            support_languages: ['English', 'Spanish', 'Italian'],
            support_hours: '24/5',
            live_chat: true,
            phone_support: true,
            email_support: true,
            deposit_methods: ['Credit Card', 'Bank Wire', 'PayPal'],
            withdrawal_methods: ['Credit Card', 'Bank Wire', 'PayPal'],
            deposit_time: 'Instant',
            withdrawal_time: '1-3 business days',
            education_resources: ['Trading Guides', 'Market Analysis'],
            research_tools: ['Economic Calendar', 'Market News'],
            market_analysis: true,
            webinars: true,
            current_promotions: [
              {
                title: 'Welcome Bonus - Trade $1000 Risk-Free',
                description: 'New clients can trade up to $1000 risk-free',
                expiry: '2024-12-31'
              }
            ],
            user_reviews: [
              {
                rating: 5,
                title: 'Excellent execution and spreads',
                comment: 'Great service with tight spreads.',
                author: 'John D.',
                date: '2024-01-15',
                verified: true
              }
            ],
            last_updated: '2024-01-20',
            cta_text: 'Visit Broker',
            cta_url: `https://${slug}.com`
          };

          setBroker(mockBroker);
          setSimilarBrokers([
            {
              id: '2',
              name: 'Pepperstone',
              slug: 'pepperstone',
              overall_rating: 4.7,
              min_deposit: 200,
              logo_url: '/images/brokers/pepperstone.png',
              website_url: 'https://pepperstone.com'
            }
          ]);
        } else {
          setError('Broker not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load broker data');
      } finally {
        setLoading(false);
      }
    };

    fetchBrokerData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !broker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Broker</h2>
          <p className="text-gray-600 mb-4">{error || 'Broker not found'}</p>
          <Link
            to="/best-brokers"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Best Brokers
          </Link>
        </div>
      </div>
    );
  }

  const seoContent = {
    title: `${broker.name} Review 2025 - Detailed Analysis & Rating`,
    description: `Comprehensive ${broker.name} review 2025. Analysis of spreads, platforms, regulation, and features.`,
    keywords: `${broker.name.toLowerCase()} review, ${broker.name.toLowerCase()} broker, forex broker review`,
    h1: `${broker.name} Review 2025`,
    review_summary: `${broker.name} is a highly-rated ECN broker offering institutional-grade trading conditions.`,
    bottom_line: `${broker.name} stands out as one of the top ECN brokers in the industry.`,
    faqs: [
      {
        question: `Is ${broker.name} regulated?`,
        answer: `Yes, ${broker.name} is regulated by multiple top-tier authorities.`
      },
      {
        question: `What is the minimum deposit at ${broker.name}?`,
        answer: `The minimum deposit at ${broker.name} is $${broker.min_deposit}.`
      }
    ]
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Brokers', url: '/brokers' },
    { name: broker.name }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "FinancialService",
      "name": broker.name,
      "url": broker.website_url,
      "description": broker.overview,
      "address": broker.headquarters,
      "foundingDate": broker.founded_year?.toString()
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": broker.overall_rating,
      "bestRating": 5
    },
    "author": {
      "@type": "Organization",
      "name": "Best Forex Brokers"
    },
    "datePublished": broker.last_updated,
    "reviewBody": seoContent.review_summary
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    };

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarSolidIcon key={i} className={`${sizeClasses[size]} text-yellow-400`} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className={`${sizeClasses[size]} text-gray-300`} />
            <StarSolidIcon 
              className={`${sizeClasses[size]} text-yellow-400 absolute top-0 left-0`}
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          </div>
        );
      } else {
        stars.push(
          <StarIcon key={i} className={`${sizeClasses[size]} text-gray-300`} />
        );
      }
    }
    return stars;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: DocumentTextIcon },
    { id: 'platforms', label: 'Platforms', icon: DevicePhoneMobileIcon },
    { id: 'costs', label: 'Costs & Fees', icon: CurrencyDollarIcon },
    { id: 'accounts', label: 'Accounts', icon: ChartBarIcon },
    { id: 'support', label: 'Support', icon: GlobeAltIcon },
    { id: 'reviews', label: 'Reviews', icon: StarIcon }
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-100';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-100';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <>
      <MetaTags
        title={seoContent.title}
        description={seoContent.description}
        canonical={`https://brokeranalysis.com/broker/${broker.slug}`}
        keywords={seoContent.keywords.split(', ')}
      />

      <JsonLdSchema data={jsonLd} />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="text-gray-400 mx-2">/</span>}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-gray-500">{crumb.name}</span>
                    ) : (
                      <Link
                        to={crumb.url}
                        className="text-blue-600 hover:text-blue-800"
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
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              {/* Broker Info */}
              <div className="flex-1">
                <div className="flex items-start space-x-6 mb-6">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    {broker.logo_url ? (
                      <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border flex items-center justify-center">
                        <img
                          src={broker.logo_url}
                          alt={`${broker.name} logo`}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">
                          {broker.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                {/* Header Info */}
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {seoContent.h1}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    {/* Overall Rating */}
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(broker.overall_rating, 'lg')}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRatingColor(broker.overall_rating)}`}>
                        {broker.overall_rating.toFixed(1)}/5
                      </span>
                    </div>

                    {/* Founded */}
                    {broker.founded_year && (
                      <span className="text-sm text-gray-500">
                        Founded {broker.founded_year}
                      </span>
                    )}

                    {/* Headquarters */}
                    {broker.headquarters && (
                      <span className="text-sm text-gray-500">
                        🏢 {broker.headquarters}
                      </span>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {broker.min_deposit !== undefined && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">
                          {broker.min_deposit === 0 
                            ? 'No Min' 
                            : `${broker.min_deposit_currency || '$'}${broker.min_deposit.toLocaleString()}`
                          }
                        </div>
                        <div className="text-xs text-gray-500">Min Deposit</div>
                      </div>
                    )}

                    {broker.spreads_from !== undefined && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{broker.spreads_from}</div>
                        <div className="text-xs text-gray-500">Spreads From</div>
                      </div>
                    )}

                    {broker.max_leverage !== undefined && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{broker.max_leverage}:1</div>
                        <div className="text-xs text-gray-500">Max Leverage</div>
                      </div>
                    )}

                    {broker.instruments_total && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{broker.instruments_total}+</div>
                        <div className="text-xs text-gray-500">Instruments</div>
                      </div>
                    )}
                  </div>

                  {/* Regulation Badges */}
                  {broker.regulations && broker.regulations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {broker.regulations.map((reg) => (
                        <div
                          key={reg.regulator}
                          className="inline-flex items-center px-3 py-2 rounded-lg bg-green-100 text-green-800 text-sm font-medium"
                          title={reg.license_number ? `License: ${reg.license_number}` : undefined}
                        >
                          <ShieldCheckIcon className="h-4 w-4 mr-2" />
                          {reg.regulator} ({reg.country})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
                <div className="text-center mb-4">
                  <div className="text-lg font-semibold mb-2">Start Trading Today</div>
                  <div className="text-blue-100 text-sm">
                    Join thousands of traders who chose {broker.name}
                  </div>
                </div>

                {broker.current_promotions && broker.current_promotions.length > 0 && (
                  <div className="bg-yellow-400 text-yellow-900 p-3 rounded-lg mb-4 text-center">
                    <div className="font-semibold text-sm">🎉 Limited Offer</div>
                    <div className="text-xs">{broker.current_promotions[0].title}</div>
                  </div>
                )}

                <div className="space-y-3">
                  <a
                    href={broker.cta_url || broker.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-white text-blue-600 text-center py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    {broker.cta_text || 'Visit Broker'}
                  </a>
                  
                  {broker.demo_account && (
                    <button className="block w-full border-2 border-white text-white text-center py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                      Try Demo Account
                    </button>
                  )}
                </div>

                <div className="mt-4 text-xs text-blue-100 text-center">
                  Risk Warning: Trading involves risk of loss
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Review Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-3">Our Review Summary</h2>
                <p className="text-blue-800 leading-relaxed">{seoContent.review_summary}</p>
              </div>

              {/* Rating Breakdown */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Trust & Safety</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(broker.trust_rating)}</div>
                      <span className="font-semibold">{broker.trust_rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Platforms & Tools</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(broker.platform_rating)}</div>
                      <span className="font-semibold">{broker.platform_rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Costs & Fees</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(broker.costs_rating)}</div>
                      <span className="font-semibold">{broker.costs_rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Customer Service</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(broker.service_rating)}</div>
                      <span className="font-semibold">{broker.service_rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Features</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(broker.features_rating)}</div>
                      <span className="font-semibold">{broker.features_rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {broker.pros && broker.pros.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                      <CheckIcon className="h-5 w-5 mr-2" />
                      Pros
                    </h3>
                    <ul className="space-y-2">
                      {broker.pros.map((pro, index) => (
                        <li key={index} className="flex items-start text-green-800">
                          <CheckIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {broker.cons && broker.cons.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                      <XMarkIcon className="h-5 w-5 mr-2" />
                      Cons
                    </h3>
                    <ul className="space-y-2">
                      {broker.cons.map((con, index) => (
                        <li key={index} className="flex items-start text-red-800">
                          <XMarkIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Instruments */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Instruments</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {broker.forex_pairs && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{broker.forex_pairs}</div>
                      <div className="text-sm text-gray-600">Forex Pairs</div>
                    </div>
                  )}
                  {broker.cfds && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{broker.cfds}</div>
                      <div className="text-sm text-gray-600">CFDs</div>
                    </div>
                  )}
                  {broker.commodities && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{broker.commodities}</div>
                      <div className="text-sm text-gray-600">Commodities</div>
                    </div>
                  )}
                  {broker.indices && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{broker.indices}</div>
                      <div className="text-sm text-gray-600">Indices</div>
                    </div>
                  )}
                  {broker.crypto && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{broker.crypto}</div>
                      <div className="text-sm text-gray-600">Crypto</div>
                    </div>
                  )}
                  {broker.stocks && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{broker.stocks}</div>
                      <div className="text-sm text-gray-600">Stocks</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'platforms' && (
            <div className="space-y-8">
              {/* Trading Platforms */}
              {broker.platforms && broker.platforms.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Platforms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {broker.platforms.map((platform) => (
                      <div key={platform} className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">{platform}</h4>
                        <div className="text-sm text-gray-600">
                          Professional trading platform with advanced features
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Apps */}
              {broker.mobile_apps && broker.mobile_apps.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mobile Applications</h3>
                  <div className="space-y-4">
                    {broker.mobile_apps.map((app) => (
                      <div key={app.platform} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-900">{app.platform}</h4>
                          <div className="text-sm text-gray-600">Available for iOS and Android</div>
                        </div>
                        <div className="flex space-x-4 text-sm">
                          {app.ios_rating && (
                            <div className="text-center">
                              <div className="font-semibold">📱 {app.ios_rating}/5</div>
                              <div className="text-gray-500">iOS</div>
                            </div>
                          )}
                          {app.android_rating && (
                            <div className="text-center">
                              <div className="font-semibold">🤖 {app.android_rating}/5</div>
                              <div className="text-gray-500">Android</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trading Tools */}
              {broker.trading_tools && broker.trading_tools.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Tools</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {broker.trading_tools.map((tool) => (
                      <div key={tool} className="p-3 bg-blue-50 text-blue-800 rounded-lg text-center text-sm font-medium">
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'costs' && (
            <div className="space-y-8">
              {/* Spreads */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Typical Spreads</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {broker.eur_usd_spread && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{broker.eur_usd_spread}</div>
                      <div className="text-sm text-gray-600">EUR/USD</div>
                    </div>
                  )}
                  {broker.gbp_usd_spread && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{broker.gbp_usd_spread}</div>
                      <div className="text-sm text-gray-600">GBP/USD</div>
                    </div>
                  )}
                  {broker.usd_jpy_spread && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{broker.usd_jpy_spread}</div>
                      <div className="text-sm text-gray-600">USD/JPY</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fees */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fees & Charges</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Commission</span>
                    <span className="text-gray-600">{broker.commission || 'Varies by account'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Overnight Fees</span>
                    <span className="text-gray-600">{broker.overnight_fees || 'Standard swap rates'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Inactivity Fee</span>
                    <span className="text-gray-600">
                      {broker.inactivity_fee ? `$${broker.inactivity_fee}` : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Withdrawal Fee</span>
                    <span className="text-gray-600">{broker.withdrawal_fee || 'Varies'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="space-y-8">
              {broker.account_types && broker.account_types.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {broker.account_types.map((account) => (
                    <div key={account.name} className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{account.name}</h3>
                      {account.description && (
                        <p className="text-gray-600 mb-4">{account.description}</p>
                      )}
                      
                      <div className="space-y-3">
                        {account.min_deposit !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Min Deposit:</span>
                            <span className="font-semibold">
                              {account.min_deposit === 0 ? 'No minimum' : `$${account.min_deposit.toLocaleString()}`}
                            </span>
                          </div>
                        )}
                        
                        {account.spreads_from !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Spreads From:</span>
                            <span className="font-semibold">{account.spreads_from} pips</span>
                          </div>
                        )}
                        
                        {account.commission && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Commission:</span>
                            <span className="font-semibold">{account.commission}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-8">
              {/* Support Channels */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Support</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`text-center p-4 rounded-lg ${broker.live_chat ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-400'}`}>
                    <div className="text-2xl mb-2">💬</div>
                    <div className="font-medium">Live Chat</div>
                    <div className="text-sm">{broker.live_chat ? 'Available' : 'Not Available'}</div>
                  </div>
                  
                  <div className={`text-center p-4 rounded-lg ${broker.phone_support ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-400'}`}>
                    <div className="text-2xl mb-2">📞</div>
                    <div className="font-medium">Phone</div>
                    <div className="text-sm">{broker.phone_support ? 'Available' : 'Not Available'}</div>
                  </div>
                  
                  <div className={`text-center p-4 rounded-lg ${broker.email_support ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-400'}`}>
                    <div className="text-2xl mb-2">✉️</div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm">{broker.email_support ? 'Available' : 'Not Available'}</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 text-blue-800 rounded-lg">
                    <div className="text-2xl mb-2">🕐</div>
                    <div className="font-medium">Hours</div>
                    <div className="text-sm">{broker.support_hours || '24/5'}</div>
                  </div>
                </div>
              </div>

              {/* Languages */}
              {broker.support_languages && broker.support_languages.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {broker.support_languages.map((language) => (
                      <span key={language} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {broker.user_reviews && broker.user_reviews.length > 0 ? (
                <div className="space-y-6">
                  {broker.user_reviews.map((review, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="font-semibold text-gray-900">{review.rating}/5</span>
                            {review.verified && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckIcon className="h-3 w-3 mr-1" />
                                Verified
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900">{review.title}</h4>
                        </div>
                        <div className="text-sm text-gray-500">{review.date}</div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{review.comment}</p>
                      
                      <div className="text-sm text-gray-500">
                        by {review.author}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <StarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">Be the first to review this broker</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Line */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Bottom Line</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              {seoContent.bottom_line}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={broker.cta_url || broker.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Visit {broker.name}
              </a>
              <Link
                to="/compare"
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Compare Brokers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Brokers */}
      {similarBrokers && similarBrokers.length > 0 && (
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Brokers You May Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarBrokers.slice(0, 3).map((similarBroker, index) => (
                <BrokerCard
                  key={similarBroker.id}
                  broker={similarBroker}
                  priority={index + 4}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      {seoContent.faqs && seoContent.faqs.length > 0 && (
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {seoContent.faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default BrokerDetailPage;