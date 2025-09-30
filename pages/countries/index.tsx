import { GetStaticProps } from 'next';
import Link from 'next/link';
import { 
  GlobeAltIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import MainLayout from '@/components/layout/MainLayout';

interface Country {
  code: string;
  name: string;
  slug: string;
  flag_emoji: string;
  broker_count: number;
  regulated_broker_count: number;
  top_brokers: string[];
  regulatory_body?: string;
  is_popular: boolean;
}

interface Region {
  name: string;
  slug: string;
  description: string;
  total_countries: number;
  total_brokers: number;
  countries: Country[];
  color: string;
}

interface CountriesPageProps {
  regions: Region[];
  totalCountries: number;
  totalBrokers: number;
  popularCountries: Country[];
}

export default function CountriesPage({ 
  regions, 
  totalCountries, 
  totalBrokers, 
  popularCountries 
}: CountriesPageProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Forex Brokers by Country - Global Coverage",
    "description": "Browse forex brokers by country and region. Find licensed brokers operating in your jurisdiction worldwide.",
    "url": "https://bestforexbrokers.com/countries",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": totalCountries,
      "itemListElement": popularCountries.slice(0, 10).map((country, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://bestforexbrokers.com/countries/${country.slug}`,
        "name": country.name
      }))
    }
  };

  return (
    <MainLayout
      title="Forex Brokers by Country 2025 - Global Directory"
      description="Browse forex brokers by country and region. Find licensed brokers operating in your jurisdiction across the globe."
      keywords="forex brokers by country, international brokers, regulated brokers, global forex trading"
      canonical="https://bestforexbrokers.com/countries"
      breadcrumbs={[{ label: 'Countries' }]}
      jsonLd={jsonLd}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <GlobeAltIcon className="h-16 w-16 mx-auto mb-6 text-green-100" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Brokers by Country
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Find forex brokers licensed and operating in your country. 
              Browse {totalBrokers} brokers across {totalCountries} countries worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                  <span className="text-lg font-semibold">{totalCountries} Countries</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                  <span className="text-lg font-semibold">{totalBrokers} Brokers</span>
                </div>
              </div>
              <Link
                href="/brokers"
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                View All Brokers
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Popular Countries */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Popular Trading Destinations
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            These countries have the most active forex trading markets and broker presence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularCountries.map((country) => (
              <Link
                key={country.code}
                href={`/countries/${country.slug}`}
                className="group block bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{country.flag_emoji}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {country.name}
                      </h3>
                      {country.regulatory_body && (
                        <p className="text-sm text-gray-500">{country.regulatory_body}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Brokers</span>
                    <span className="font-medium text-gray-900">{country.broker_count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Regulated</span>
                    <span className="font-medium text-green-600">{country.regulated_broker_count}</span>
                  </div>
                </div>
                
                {country.top_brokers.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Top brokers:</p>
                    <div className="flex flex-wrap gap-1">
                      {country.top_brokers.slice(0, 2).map((broker) => (
                        <span
                          key={broker}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {broker}
                        </span>
                      ))}
                      {country.top_brokers.length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          +{country.top_brokers.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div className="space-y-12">
          {regions.map((region) => (
            <div key={region.slug} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Region Header */}
              <div className={`${region.color} text-white p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{region.name}</h3>
                    <p className="text-white/90">{region.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{region.total_countries}</div>
                    <div className="text-white/90 text-sm">Countries</div>
                  </div>
                </div>
              </div>

              {/* Countries Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {region.countries.map((country) => (
                    <Link
                      key={country.code}
                      href={`/countries/${country.slug}`}
                      className="group flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <span className="text-2xl mr-4">{country.flag_emoji}</span>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {country.name}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">
                            {country.broker_count} brokers
                          </span>
                          {country.regulated_broker_count > 0 && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              {country.regulated_broker_count} regulated
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <BuildingOffice2Icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Regulatory Compliance</h3>
            <p className="text-gray-600 text-sm">
              All brokers are verified for regulatory compliance in their respective jurisdictions.
            </p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <GlobeAltIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Coverage</h3>
            <p className="text-gray-600 text-sm">
              Find brokers operating in your country with local support and regulations.
            </p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <UserGroupIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Expertise</h3>
            <p className="text-gray-600 text-sm">
              Connect with brokers that understand local market conditions and requirements.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-2xl p-12 mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Looking for Something Specific?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find your country? Browse our complete broker directory or search for specific regulatory requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/brokers"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse All Brokers
            </Link>
            <Link
              href="/categories/regulated-brokers"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View Regulated Brokers
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // TODO: Fetch actual country and region data from database
  // For now, we'll use mock data
  const mockCountries: Country[] = [
    {
      code: 'US',
      name: 'United States',
      slug: 'united-states',
      flag_emoji: '🇺🇸',
      broker_count: 45,
      regulated_broker_count: 32,
      top_brokers: ['OANDA', 'Interactive Brokers', 'TD Ameritrade'],
      regulatory_body: 'CFTC, NFA',
      is_popular: true
    },
    {
      code: 'UK',
      name: 'United Kingdom',
      slug: 'united-kingdom',
      flag_emoji: '🇬🇧',
      broker_count: 67,
      regulated_broker_count: 54,
      top_brokers: ['IG', 'CMC Markets', 'Plus500'],
      regulatory_body: 'FCA',
      is_popular: true
    },
    {
      code: 'AU',
      name: 'Australia',
      slug: 'australia',
      flag_emoji: '🇦🇺',
      broker_count: 38,
      regulated_broker_count: 31,
      top_brokers: ['IC Markets', 'Pepperstone', 'FP Markets'],
      regulatory_body: 'ASIC',
      is_popular: true
    },
    {
      code: 'DE',
      name: 'Germany',
      slug: 'germany',
      flag_emoji: '🇩🇪',
      broker_count: 29,
      regulated_broker_count: 25,
      top_brokers: ['Admiral Markets', 'XTB', 'eToro'],
      regulatory_body: 'BaFin',
      is_popular: true
    },
    {
      code: 'CY',
      name: 'Cyprus',
      slug: 'cyprus',
      flag_emoji: '🇨🇾',
      broker_count: 156,
      regulated_broker_count: 142,
      top_brokers: ['XM', 'HotForex', 'FxPro'],
      regulatory_body: 'CySEC',
      is_popular: true
    },
    {
      code: 'JP',
      name: 'Japan',
      slug: 'japan',
      flag_emoji: '🇯🇵',
      broker_count: 23,
      regulated_broker_count: 23,
      top_brokers: ['GMO Click', 'DMMFX', 'SBI FXTrade'],
      regulatory_body: 'JFSA',
      is_popular: true
    },
    {
      code: 'SG',
      name: 'Singapore',
      slug: 'singapore',
      flag_emoji: '🇸🇬',
      broker_count: 34,
      regulated_broker_count: 28,
      top_brokers: ['Saxo Bank', 'IG', 'FXCM'],
      regulatory_body: 'MAS',
      is_popular: true
    },
    {
      code: 'CH',
      name: 'Switzerland',
      slug: 'switzerland',
      flag_emoji: '🇨🇭',
      broker_count: 18,
      regulated_broker_count: 16,
      top_brokers: ['Dukascopy', 'Swissquote', 'Bank Vontobel'],
      regulatory_body: 'FINMA',
      is_popular: true
    }
  ];

  const mockRegions: Region[] = [
    {
      name: 'Europe',
      slug: 'europe',
      description: 'Major financial centers with strong regulatory frameworks',
      total_countries: 12,
      total_brokers: 234,
      color: 'bg-gradient-to-r from-blue-600 to-blue-700',
      countries: [
        mockCountries.find(c => c.code === 'UK')!,
        mockCountries.find(c => c.code === 'DE')!,
        mockCountries.find(c => c.code === 'CY')!,
        mockCountries.find(c => c.code === 'CH')!,
        {
          code: 'FR',
          name: 'France',
          slug: 'france',
          flag_emoji: '🇫🇷',
          broker_count: 21,
          regulated_broker_count: 18,
          top_brokers: ['IG France', 'Admiral Markets'],
          regulatory_body: 'AMF',
          is_popular: false
        },
        {
          code: 'IT',
          name: 'Italy',
          slug: 'italy',
          flag_emoji: '🇮🇹',
          broker_count: 19,
          regulated_broker_count: 15,
          top_brokers: ['Plus500', 'eToro'],
          regulatory_body: 'CONSOB',
          is_popular: false
        }
      ]
    },
    {
      name: 'Asia Pacific',
      slug: 'asia-pacific',
      description: 'Dynamic markets with growing retail trading participation',
      total_countries: 8,
      total_brokers: 156,
      color: 'bg-gradient-to-r from-green-600 to-green-700',
      countries: [
        mockCountries.find(c => c.code === 'AU')!,
        mockCountries.find(c => c.code === 'JP')!,
        mockCountries.find(c => c.code === 'SG')!,
        {
          code: 'HK',
          name: 'Hong Kong',
          slug: 'hong-kong',
          flag_emoji: '🇭🇰',
          broker_count: 42,
          regulated_broker_count: 35,
          top_brokers: ['Saxo Bank', 'Interactive Brokers'],
          regulatory_body: 'SFC',
          is_popular: false
        },
        {
          code: 'NZ',
          name: 'New Zealand',
          slug: 'new-zealand',
          flag_emoji: '🇳🇿',
          broker_count: 16,
          regulated_broker_count: 12,
          top_brokers: ['Pepperstone', 'IC Markets'],
          regulatory_body: 'FMA',
          is_popular: false
        }
      ]
    },
    {
      name: 'North America',
      slug: 'north-america',
      description: 'Mature markets with stringent regulatory oversight',
      total_countries: 3,
      total_brokers: 78,
      color: 'bg-gradient-to-r from-purple-600 to-purple-700',
      countries: [
        mockCountries.find(c => c.code === 'US')!,
        {
          code: 'CA',
          name: 'Canada',
          slug: 'canada',
          flag_emoji: '🇨🇦',
          broker_count: 28,
          regulated_broker_count: 22,
          top_brokers: ['OANDA', 'Interactive Brokers'],
          regulatory_body: 'IIROC',
          is_popular: false
        },
        {
          code: 'MX',
          name: 'Mexico',
          slug: 'mexico',
          flag_emoji: '🇲🇽',
          broker_count: 5,
          regulated_broker_count: 3,
          top_brokers: ['OANDA'],
          regulatory_body: 'CNBV',
          is_popular: false
        }
      ]
    },
    {
      name: 'Middle East & Africa',
      slug: 'middle-east-africa',
      description: 'Emerging markets with Islamic finance options',
      total_countries: 6,
      total_brokers: 89,
      color: 'bg-gradient-to-r from-orange-600 to-red-600',
      countries: [
        {
          code: 'AE',
          name: 'United Arab Emirates',
          slug: 'united-arab-emirates',
          flag_emoji: '🇦🇪',
          broker_count: 34,
          regulated_broker_count: 28,
          top_brokers: ['AvaTrade', 'Admiral Markets'],
          regulatory_body: 'ADGM, DFSA',
          is_popular: false
        },
        {
          code: 'ZA',
          name: 'South Africa',
          slug: 'south-africa',
          flag_emoji: '🇿🇦',
          broker_count: 22,
          regulated_broker_count: 18,
          top_brokers: ['HotForex', 'XM'],
          regulatory_body: 'FSCA',
          is_popular: false
        },
        {
          code: 'BH',
          name: 'Bahrain',
          slug: 'bahrain',
          flag_emoji: '🇧🇭',
          broker_count: 15,
          regulated_broker_count: 13,
          top_brokers: ['FxPro', 'FXTM'],
          regulatory_body: 'CBB',
          is_popular: false
        }
      ]
    }
  ];

  const popularCountries = mockCountries.filter(c => c.is_popular);
  const totalCountries = mockCountries.length + mockRegions.reduce((sum, region) => 
    sum + region.countries.filter(c => !mockCountries.some(mc => mc.code === c.code)).length, 0
  );
  const totalBrokers = mockCountries.reduce((sum, country) => sum + country.broker_count, 0);

  return {
    props: {
      regions: mockRegions,
      totalCountries,
      totalBrokers,
      popularCountries
    },
    revalidate: 3600 // Revalidate every hour
  };
};