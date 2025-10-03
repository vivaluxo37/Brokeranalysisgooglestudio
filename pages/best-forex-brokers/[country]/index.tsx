import React, { useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ChevronRightIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import SEOHead from '../../../components/seo/SEOHead';
import BrokerCard from '../../../components/brokers/BrokerCard';
import { brokers } from '../../../data/brokers';
import { Broker } from '../../../types';

// Country data structure
interface CountryData {
  name: string;
  slug: string;
  flag: string;
  description: string;
  population: string;
  currency: string;
  timezone: string;
  regulatoryBody: string;
  regulatoryBodyFull: string;
  regulatoryWebsite?: string;
  keyFacts: string[];
  tradingRestrictions?: string[];
  localPaymentMethods: string[];
  marketHours: string;
  language: string;
}

// Country configurations
const COUNTRY_DATA: Record<string, CountryData> = {
  'united-states': {
    name: 'United States',
    slug: 'united-states',
    flag: '🇺🇸',
    description: 'The United States has one of the most regulated forex markets globally, with strict oversight by the NFA and CFTC.',
    population: '331 million',
    currency: 'USD',
    timezone: 'UTC-5 to UTC-8',
    regulatoryBody: 'NFA',
    regulatoryBodyFull: 'National Futures Association',
    regulatoryWebsite: 'https://www.nfa.futures.org',
    keyFacts: [
      'Maximum leverage limited to 50:1 for major pairs',
      'FIFO (First In, First Out) rule mandatory',
      'No hedging allowed',
      'Strict segregation of client funds',
      'Maximum $50,000 SIPC protection'
    ],
    tradingRestrictions: [
      'Leverage capped at 50:1 for major pairs, 20:1 for minor pairs',
      'Hedging prohibited',
      'FIFO execution required'
    ],
    localPaymentMethods: ['ACH Transfer', 'Wire Transfer', 'Debit Cards', 'Check'],
    marketHours: '5:00 PM EST Sunday - 5:00 PM EST Friday',
    language: 'English'
  },
  'united-kingdom': {
    name: 'United Kingdom',
    slug: 'united-kingdom',
    flag: '🇬🇧',
    description: 'The UK maintains high regulatory standards through the FCA, offering strong consumer protection and negative balance protection.',
    population: '67 million',
    currency: 'GBP',
    timezone: 'UTC+0',
    regulatoryBody: 'FCA',
    regulatoryBodyFull: 'Financial Conduct Authority',
    regulatoryWebsite: 'https://www.fca.org.uk',
    keyFacts: [
      'Leverage limited to 30:1 for major pairs (ESMA rules)',
      'Negative balance protection mandatory',
      'FSCS protection up to £85,000',
      'Strict capital adequacy requirements',
      'Product intervention powers for CFDs'
    ],
    tradingRestrictions: [
      'Leverage capped at 30:1 for retail clients',
      'Negative balance protection required',
      'Marketing restrictions on CFDs'
    ],
    localPaymentMethods: ['Faster Payments', 'BACS', 'Debit Cards', 'Bank Transfer'],
    marketHours: '10:00 PM GMT Sunday - 10:00 PM GMT Friday',
    language: 'English'
  },
  'australia': {
    name: 'Australia',
    slug: 'australia',
    flag: '🇦🇺',
    description: 'Australia offers a well-regulated forex environment under ASIC oversight with strong consumer protections.',
    population: '25.7 million',
    currency: 'AUD',
    timezone: 'UTC+8 to UTC+11',
    regulatoryBody: 'ASIC',
    regulatoryBodyFull: 'Australian Securities and Investments Commission',
    regulatoryWebsite: 'https://www.asic.gov.au',
    keyFacts: [
      'Leverage limited to 30:1 for major pairs',
      'Negative balance protection for retail clients',
      'Strong licensing requirements',
      'Compensation scheme available',
      'Regular broker audits'
    ],
    tradingRestrictions: [
      'Leverage restrictions for retail clients',
      'Product intervention powers',
      'Cooling-off period for new clients'
    ],
    localPaymentMethods: ['BPAY', 'POLi', 'Bank Transfer', 'Credit Cards'],
    marketHours: '7:00 AM AEST Monday - 7:00 AM AEST Saturday',
    language: 'English'
  },
  'germany': {
    name: 'Germany',
    slug: 'germany',
    flag: '🇩🇪',
    description: 'Germany follows EU regulations with additional BaFin oversight, providing comprehensive trader protection.',
    population: '83 million',
    currency: 'EUR',
    timezone: 'UTC+1',
    regulatoryBody: 'BaFin',
    regulatoryBodyFull: 'Federal Financial Supervisory Authority',
    regulatoryWebsite: 'https://www.bafin.de',
    keyFacts: [
      'ESMA leverage limits apply (30:1 major pairs)',
      'Negative balance protection mandatory',
      'EU investor compensation',
      'MiFID II compliance required',
      'Strong consumer protection laws'
    ],
    tradingRestrictions: [
      'ESMA leverage restrictions',
      'Marketing restrictions on high-risk products',
      'Professional client classification available'
    ],
    localPaymentMethods: ['SEPA Transfer', 'Sofortüberweisung', 'Giropay', 'Credit Cards'],
    marketHours: '11:00 PM CET Sunday - 11:00 PM CET Friday',
    language: 'German, English'
  },
  'canada': {
    name: 'Canada',
    slug: 'canada',
    flag: '🇨🇦',
    description: 'Canada maintains provincial regulation with IIROC oversight, offering moderate leverage and strong protections.',
    population: '38 million',
    currency: 'CAD',
    timezone: 'UTC-3.5 to UTC-8',
    regulatoryBody: 'IIROC',
    regulatoryBodyFull: 'Investment Industry Regulatory Organization of Canada',
    regulatoryWebsite: 'https://www.iiroc.ca',
    keyFacts: [
      'Leverage up to 50:1 for major pairs',
      'Provincial securities regulation',
      'CIPF investor protection',
      'Strong compliance requirements',
      'Regular dealer audits'
    ],
    tradingRestrictions: [
      'Leverage limits vary by province',
      'Know Your Client requirements',
      'Suitability assessments mandatory'
    ],
    localPaymentMethods: ['Interac e-Transfer', 'Wire Transfer', 'Certified Cheque'],
    marketHours: '6:00 PM EST Sunday - 6:00 PM EST Friday',
    language: 'English, French'
  }
};

interface FilterState {
  search: string;
  regulated: string;
  minDeposit: string;
  maxLeverage: string;
  rating: number;
  platforms: string[];
}

const CountryPage: React.FC = () => {
  const { country } = useParams<{ country: string }>();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    regulated: 'all',
    minDeposit: 'all',
    maxLeverage: 'all',
    rating: 0,
    platforms: []
  });

  // Get country data
  const countryData = useMemo(() => {
    if (!country) return null;
    return COUNTRY_DATA[country] || null;
  }, [country]);

  // Filter and sort brokers for this country
  const countryBrokers = useMemo(() => {
    if (!countryData) return [];

    // Filter brokers based on country-specific criteria
    let filtered = brokers.filter(broker => {
      // Check if broker serves this country (basic logic - can be enhanced)
      const regulators = broker.regulation.regulators;
      
      switch (countryData.regulatoryBody) {
        case 'NFA':
          return regulators.includes('NFA') || regulators.includes('CFTC');
        case 'FCA':
          return regulators.includes('FCA');
        case 'ASIC':
          return regulators.includes('ASIC');
        case 'BaFin':
          return regulators.includes('BaFin') || regulators.includes('CySEC');
        case 'IIROC':
          return regulators.includes('IIROC') || regulators.includes('CSA');
        default:
          return true; // Default to showing all brokers
      }
    });

    // Apply user filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(broker =>
        broker.name.toLowerCase().includes(searchTerm) ||
        broker.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.regulated !== 'all') {
      if (filters.regulated === 'yes') {
        filtered = filtered.filter(broker => broker.regulation.regulators.length > 0);
      }
    }

    if (filters.minDeposit !== 'all') {
      const maxDeposit = parseInt(filters.minDeposit);
      filtered = filtered.filter(broker => broker.accessibility.minDeposit <= maxDeposit);
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(broker => broker.score >= filters.rating);
    }

    if (filters.platforms.length > 0) {
      filtered = filtered.filter(broker =>
        filters.platforms.some(platform => broker.technology.platforms.includes(platform))
      );
    }

    // Sort by score
    return filtered.sort((a, b) => b.score - a.score);
  }, [countryData, filters]);

  // Generate breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!countryData) return [];

    return [
      { name: 'Home', url: '/' },
      { name: 'Countries', url: '/countries' },
      { name: `Best Brokers in ${countryData.name}`, url: `/best-forex-brokers/${countryData.slug}` }
    ];
  }, [countryData]);

  // If no country data found, redirect to 404
  if (!countryData) {
    return <Navigate to="/404" replace />;
  }

  // Generate FAQ data
  const faqs = [
    {
      question: `What are the best forex brokers in ${countryData.name}?`,
      answer: `The best forex brokers for ${countryData.name} residents are those regulated by ${countryData.regulatoryBodyFull} (${countryData.regulatoryBody}) and offer competitive trading conditions, reliable platforms, and excellent customer service in ${countryData.language}.`
    },
    {
      question: `Is forex trading legal in ${countryData.name}?`,
      answer: `Yes, forex trading is legal in ${countryData.name} and is regulated by ${countryData.regulatoryBodyFull}. Traders should only use brokers that are properly licensed and regulated.`
    },
    {
      question: `What leverage is available for ${countryData.name} traders?`,
      answer: countryData.tradingRestrictions && countryData.tradingRestrictions.length > 0 
        ? `${countryData.name} traders are subject to leverage restrictions: ${countryData.tradingRestrictions[0]}`
        : `Leverage availability depends on your broker and account type. Check with your chosen broker for specific leverage offerings in ${countryData.name}.`
    },
    {
      question: `What payment methods are available in ${countryData.name}?`,
      answer: `Popular payment methods in ${countryData.name} include: ${countryData.localPaymentMethods.join(', ')}. Most regulated brokers will offer several of these options.`
    }
  ];

  // Generate comprehensive structured data using the service
  const schemas = React.useMemo(() => {
    const { SchemaUtils } = require('../../../services/structuredData');
    return SchemaUtils.forCountryPage(
      {
        name: countryData.name,
        slug: countryData.slug,
        description: countryData.description
      },
      countryBrokers,
      breadcrumbs,
      faqs
    );
  }, [countryData, countryBrokers, breadcrumbs, faqs]);

  const title = `Best Forex Brokers in ${countryData.name} 2025 - ${countryData.regulatoryBody} Regulated`;
  const description = `Compare the best forex brokers for ${countryData.name} residents. Find ${countryData.regulatoryBody}-regulated brokers with competitive spreads, reliable platforms, and excellent support in ${countryData.language}.`;

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        canonical={`https://brokeranalysis.com/best-forex-brokers/${countryData.slug}`}
        structuredData={schemas}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breadcrumbs */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4 text-sm">
              {breadcrumbs.map((item, index) => (
                <div key={item.url} className="flex items-center">
                  {index > 0 && (
                    <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
                  )}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-gray-500 dark:text-gray-400">{item.name}</span>
                  ) : (
                    <Link 
                      to={item.url}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <span className="text-6xl mr-4">{countryData.flag}</span>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Best Forex Brokers in {countryData.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    {countryData.regulatoryBody}-Regulated Brokers for 2025
                  </p>
                </div>
              </div>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                {countryData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Country Info Cards */}
        <div className="bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <GlobeAltIcon className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {countryData.population}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Population</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {countryData.currency}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Currency</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ClockIcon className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {countryData.timezone}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Timezone</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-8 w-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {countryData.regulatoryBody}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Regulator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-gray-800 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {countryBrokers.length} Brokers Available in {countryData.name}
              </h2>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search brokers..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <select
                  value={filters.regulated}
                  onChange={(e) => setFilters(prev => ({ ...prev, regulated: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Brokers</option>
                  <option value="yes">Regulated Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Brokers List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {countryBrokers.length > 0 ? (
            <div className="grid gap-6">
              {countryBrokers.map((broker, index) => (
                <div key={broker.id} className="relative">
                  <div className="absolute -left-4 -top-4 z-10">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                      ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'}
                    `}>
                      {index + 1}
                    </div>
                  </div>
                  <BrokerCard broker={broker} showRanking={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No brokers found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>

        {/* Regulatory Information */}
        <div className="bg-white dark:bg-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Regulatory Environment
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <BuildingOffice2Icon className="h-6 w-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {countryData.regulatoryBodyFull} ({countryData.regulatoryBody})
                      </h4>
                      {countryData.regulatoryWebsite && (
                        <a 
                          href={countryData.regulatoryWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          Visit Official Website →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                  Key Regulatory Facts
                </h4>
                <ul className="space-y-2">
                  {countryData.keyFacts.map((fact, index) => (
                    <li key={index} className="flex items-start">
                      <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Trading Information
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Market Hours
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {countryData.marketHours}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Local Payment Methods
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {countryData.localPaymentMethods.map((method, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {countryData.tradingRestrictions && countryData.tradingRestrictions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Trading Restrictions
                      </h4>
                      <ul className="space-y-1">
                        {countryData.tradingRestrictions.map((restriction, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300 text-sm">
                            • {restriction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 dark:bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <details key={index} className="mb-4">
                  <summary className="cursor-pointer bg-white dark:bg-gray-800 p-4 rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700">
                    {faq.question}
                  </summary>
                  <div className="p-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border-l border-r border-b border-gray-200 dark:border-gray-700 rounded-b-lg">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CountryPage;