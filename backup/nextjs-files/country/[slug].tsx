import { GetStaticPaths, GetStaticProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CheckIcon, XMarkIcon, ExclamationTriangleIcon, GlobeAltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import MainLayout from '@/components/layout/MainLayout';
import BrokerCard from '@/components/common/BrokerCard';
import { COUNTRIES, getCountryBySlug, POPULAR_COUNTRIES } from '@/lib/constants/countries';

interface CountryPageProps {
  country: any;
  brokers: Array<{
    broker: any;
    availability: 'available' | 'restricted' | 'unknown';
    verificationStatus: 'verified' | 'pending' | 'failed';
    lastChecked: string;
    evidenceUrl?: string;
  }>;
  totalCount: number;
  relatedCountries: any[];
  seoContent: {
    title: string;
    description: string;
    keywords: string;
    h1: string;
    introText: string;
    regulatoryInfo: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export default function CountryPage({ 
  country, 
  brokers, 
  totalCount, 
  relatedCountries,
  seoContent 
}: CountryPageProps) {
  const router = useRouter();
  const [filterByAvailability, setFilterByAvailability] = useState<'all' | 'available' | 'restricted'>('available');
  const [sortBy, setSortBy] = useState<'rating' | 'min_deposit' | 'spreads'>('rating');

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const breadcrumbs = [
    { label: 'Countries', href: '/countries' },
    { label: country.name }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": seoContent.title,
    "description": seoContent.description,
    "url": `https://bestforexbrokers.com/country/${country.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": totalCount,
      "itemListElement": brokers
        .filter(b => filterByAvailability === 'all' || b.availability === filterByAvailability)
        .map((brokerData, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://bestforexbrokers.com/broker/${brokerData.broker.slug}`,
          "name": brokerData.broker.name
        }))
    },
    "about": {
      "@type": "Country",
      "name": country.name,
      "identifier": country.code
    }
  };

  const filteredBrokers = brokers.filter(b => 
    filterByAvailability === 'all' || b.availability === filterByAvailability
  );

  const getAvailabilityBadge = (availability: string, verificationStatus: string) => {
    if (availability === 'available') {
      return (
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckIcon className="h-3 w-3 mr-1" />
            Available
          </span>
          {verificationStatus === 'verified' && (
            <span className="text-xs text-green-600" title="Verified through official sources">
              <ShieldCheckIcon className="h-3 w-3" />
            </span>
          )}
        </div>
      );
    } else if (availability === 'restricted') {
      return (
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XMarkIcon className="h-3 w-3 mr-1" />
            Restricted
          </span>
          {verificationStatus === 'verified' && (
            <span className="text-xs text-red-600" title="Verified through official sources">
              <ShieldCheckIcon className="h-3 w-3" />
            </span>
          )}
        </div>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
          Unknown
        </span>
      );
    }
  };

  return (
    <MainLayout
      title={seoContent.title}
      description={seoContent.description}
      keywords={seoContent.keywords}
      canonical={`https://bestforexbrokers.com/country/${country.slug}`}
      breadcrumbs={breadcrumbs}
      jsonLd={jsonLd}
    >
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <span className="text-6xl mr-4">{country.flag}</span>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {seoContent.h1}
                </h1>
                <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                  <GlobeAltIcon className="h-4 w-4 mr-1" />
                  {country.region} • {country.currency}
                </div>
              </div>
            </div>
            
            <p className="text-xl text-gray-600 mb-6">
              {seoContent.introText}
            </p>
            
            {/* Country Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-1">Languages</h3>
                <p className="text-gray-600 text-sm">
                  {country.commonLanguages.join(', ')}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-1">Currency</h3>
                <p className="text-gray-600 text-sm">{country.currency}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-1">Regulation Level</h3>
                <p className={`text-sm font-medium ${
                  country.isHighRegulated ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {country.isHighRegulated ? 'Highly Regulated' : 'Standard'}
                </p>
              </div>
            </div>

            {/* Regulatory Notice */}
            {country.regulatoryNotes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="font-medium text-blue-900 mb-1">Regulatory Information</h4>
                    <p className="text-blue-800 text-sm">{country.regulatoryNotes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Filter Brokers</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterByAvailability('available')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterByAvailability === 'available'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Available ({brokers.filter(b => b.availability === 'available').length})
                </button>
                <button
                  onClick={() => setFilterByAvailability('restricted')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterByAvailability === 'restricted'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Restricted ({brokers.filter(b => b.availability === 'restricted').length})
                </button>
                <button
                  onClick={() => setFilterByAvailability('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterByAvailability === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({brokers.length})
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="min_deposit">Lowest Min Deposit</option>
                <option value="spreads">Tightest Spreads</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredBrokers.length} Brokers Found
            </h2>
            <div className="text-sm text-gray-500">
              Last updated: {brokers[0]?.lastChecked || 'Recently'}
            </div>
          </div>

          <div className="space-y-6">
            {filteredBrokers.map((brokerData, index) => (
              <div key={brokerData.broker.id} className="relative">
                <BrokerCard
                  broker={brokerData.broker}
                  showCountryBadge={country.code}
                  priority={index + 1}
                />
                
                {/* Verification Status */}
                <div className="absolute top-4 right-4">
                  <div className="flex flex-col items-end space-y-1">
                    {getAvailabilityBadge(brokerData.availability, brokerData.verificationStatus)}
                    
                    {brokerData.verificationStatus === 'pending' && (
                      <div className="text-xs text-yellow-600 flex items-center">
                        <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                        Verification pending
                      </div>
                    )}
                    
                    {brokerData.evidenceUrl && (
                      <a
                        href={brokerData.evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 underline"
                      >
                        View Evidence
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBrokers.length === 0 && (
            <div className="text-center py-12">
              <GlobeAltIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No brokers found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filter settings to see more results.
              </p>
            </div>
          )}
        </div>

        {/* Related Countries */}
        <div className="bg-gray-50 p-8 rounded-lg mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Other {country.region} Countries
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedCountries.map((relatedCountry) => (
              <Link
                key={relatedCountry.slug}
                href={`/country/${relatedCountry.slug}`}
                className="group bg-white p-4 rounded-lg hover:bg-blue-50 transition-colors text-center border border-gray-200"
              >
                <div className="text-2xl mb-2">{relatedCountry.flag}</div>
                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-xs">
                  {relatedCountry.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Country Specific Information */}
        {seoContent.regulatoryInfo && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Trading Regulations in {country.name}
            </h2>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {seoContent.regulatoryInfo}
              </p>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {country.commonPaymentMethods && country.commonPaymentMethods.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Common Payment Methods in {country.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {country.commonPaymentMethods.map((method) => (
                <span
                  key={method}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {seoContent.faqs && seoContent.faqs.length > 0 && (
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {seoContent.faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths for all countries
  const paths = COUNTRIES.map((country) => ({
    params: { slug: country.slug }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const country = getCountryBySlug(slug);

  if (!country) {
    return {
      notFound: true
    };
  }

  // TODO: Fetch actual broker data with country availability
  // For now, we'll use mock data
  const brokers = [
    {
      broker: {
        id: '1',
        name: 'IC Markets',
        slug: 'ic-markets',
        overall_rating: 4.8,
        min_deposit: 200,
        min_deposit_currency: '$',
        max_leverage: 500,
        spreads_from: 0.0,
        regulations: [
          { regulator: 'ASIC', license_number: '335692' }
        ],
        platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader'],
        instruments_count: 232,
        pros: ['Raw spreads from 0.0 pips', 'Excellent execution'],
        cons: ['High minimum deposit'],
        cta_text: 'Visit IC Markets',
        cta_url: 'https://icmarkets.com',
        country_availability: {
          available: [country.code],
          restricted: []
        }
      },
      availability: 'available' as const,
      verificationStatus: 'verified' as const,
      lastChecked: '2024-01-15',
      evidenceUrl: 'https://example.com/evidence'
    },
    {
      broker: {
        id: '2',
        name: 'Example Restricted Broker',
        slug: 'example-restricted',
        overall_rating: 4.2,
        min_deposit: 100,
        min_deposit_currency: '$',
        max_leverage: 200,
        spreads_from: 0.8,
        regulations: [
          { regulator: 'CySEC', license_number: '123/45' }
        ],
        platforms: ['MetaTrader 4'],
        instruments_count: 150,
        pros: ['Low minimum deposit'],
        cons: ['Restricted in some countries'],
        cta_text: 'Visit Broker',
        cta_url: 'https://example.com',
        country_availability: {
          available: [],
          restricted: [country.code]
        }
      },
      availability: 'restricted' as const,
      verificationStatus: 'verified' as const,
      lastChecked: '2024-01-15'
    }
  ];

  // Get related countries from the same region
  const relatedCountries = COUNTRIES
    .filter(c => c.region === country.region && c.slug !== country.slug)
    .slice(0, 6);

  const seoContent = {
    title: country.seoTitle,
    description: country.metaDescription,
    keywords: country.keywords.join(', '),
    h1: `Best Forex Brokers in ${country.name} 2025`,
    introText: `Find the best forex brokers available for ${country.name} traders. Compare regulation, spreads, and features from brokers that accept ${country.name} clients.`,
    regulatoryInfo: country.regulatoryNotes || `Trading regulations in ${country.name} vary by broker and instrument type. Always verify that your chosen broker is properly regulated and authorized to provide services in ${country.name}.`,
    faqs: [
      {
        question: `Which forex brokers accept clients from ${country.name}?`,
        answer: `Several reputable forex brokers accept clients from ${country.name}. The availability depends on the broker's licensing and regulatory compliance. We verify each broker's availability through official sources and terms of service.`
      },
      {
        question: `Are forex brokers in ${country.name} regulated?`,
        answer: country.regulatoryNotes || `Regulation varies by broker. Some brokers serving ${country.name} clients are regulated by local authorities, while others may be regulated by international bodies. Always verify the regulatory status before opening an account.`
      },
      {
        question: `What payment methods are available for ${country.name} traders?`,
        answer: `Common payment methods for ${country.name} traders include ${country.commonPaymentMethods?.slice(0, 3).join(', ')}. Availability depends on the specific broker and may include additional local payment options.`
      }
    ]
  };

  return {
    props: {
      country,
      brokers,
      totalCount: brokers.length,
      relatedCountries,
      seoContent
    },
    revalidate: 3600 // Revalidate every hour
  };
};