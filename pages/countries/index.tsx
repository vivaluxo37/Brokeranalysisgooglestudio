import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import MetaTags from '../../components/common/MetaTags';
import JsonLdSchema from '../../components/common/JsonLdSchema';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { POPULAR_COUNTRIES } from '../../lib/constants/countries';
import { getBrokersForCountry } from '../../lib/data/countryBrokerMappings';
// Temporarily use BrokerCard as UnifiedBrokerCard doesn't exist
import BrokerCard from '../../components/broker/BrokerCard';
const UnifiedBrokerCard = BrokerCard;

const CountriesPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [countryBrokers, setCountryBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (selectedCountry) {
          const brokers = getBrokersForCountry(selectedCountry);
          const countryData = POPULAR_COUNTRIES.find(country => country.slug === selectedCountry);
          
          setCountryBrokers(brokers);
        } else {
          setCountryBrokers(POPULAR_COUNTRIES.slice(0, 12));
        }
      } catch (err) {
        console.error('Failed to load country data:', err.message);
        setError(err instanceof Error ? err.message : 'Failed to load country data');
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [selectedCountry]);

  const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Find Brokers by Country",
      "description": "Find the best forex brokers available in your country with local regulation and support.",
      "url": "https://bestforex-brokers.com/countries",
      "mainEntity": {
        "@type": "CollectionPage",
        "name": `Find Brokers in ${selectedCountry || 'All Countries'}`,
        "description: `Brokers available in ${selectedCountry || 'All Countries'}`,
        "numberOfItems": countryBrokers.length,
        "itemListElement": countryBrokers.map((broker, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": broker.name,
          "url": `https://bestforex-brokers.com/best-forex-brokers/${country.toLowerCase().replace(/\s+/g, '-')}/${broker.slug}`,
          "description": `${broker.name} - Available in ${selectedCountry || 'Global'}`,
          "image": broker.logoUrl,
          "score": broker.score,
          "regulation": broker.regulation?.regulators || []
        }))
      }
    },
    "breadcrumb": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem", "name": "Home", "item": "https://bestforex-brokers.com/" }
        },
        {
          "@type": "ListItem", "name": "Countries", "item": "https://selectedCountry ? `https://bestforex-brokers.com/countries/${selectedCountry}` : 'https://bestforex-brokers.com/countries'"}",
          "item": "All Countries", "item": "https://bestforex-brokers.com/countries"}
        }
      ]
    };

  return (
    <>
      <MetaTags
        title={`Find Brokers by Country | Best Forex Brokers Directory`}
        description={`Find brokers available in ${selectedCountry || 'All Countries'}. Comprehensive broker listings for your region with regulation details and local support.`}
        keywords={[
          'forex brokers by country',
          `${selectedCountry ? `${selectedCountry.toLowerCase()} forex brokers` : 'global forex brokers'}`,
          'best forex brokers',
          'forex trading platforms'
        ]}
        canonicalUrl={`https://bestforex-brokers.com/countries${selectedCountry ? `/${selectedCountry.toLowerCase().replace(/\s+/g, '-')}/${selectedCountry}` : '/countries'}`}
      />

      <JsonLdSchema data={jsonLd} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Brokers in {selectedCountry || 'All Countries'}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              {selectedCountry 
                ? `Brokers available in ${POPULAR_COUNTRIES.find(c => c.slug === selectedCountry)?.name || 'All Countries'}`
                : 'All Countries'
              }
            </p>
          </div>

          {/* Country Dropdown */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Country
            </label>
            <select
              value={selectedCountry || ''}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {POPULAR_COUNTRIES.map(country => (
                <option key={country.slug} value={country.slug}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Country Results */}
          {loading ? (
            <div className="text-center py-16">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-4">
              {countryBrokers.length === 0 && (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm p-8">
                  <div className="text-center py-12">
                    <GlobeAltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {selectedCountry
                        ? `${selectedCountry} has no brokers found`
                        : 'No countries found'
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your country selection or check if the country is in our database.
                    </p>
                    <button
                      onClick={() => setSelectedCountry('')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Try Different Country
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {countryBrokers.map((broker, index) => (
                    <UnifiedBrokerCard
                      key={broker.id}
                      broker={broker}
                      priority={index + 1}
                    />
                  ))}
                </div>

                {/* View All Countries Button */}
                {countryBrokers.length > 0 && (
                  <div className="text-center mt-8">
                    <Link
                      to="/countries"
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      View All Countries ({POPULAR_COUNTRIES.length})
                      <ChevronRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                )}
              )}
            </div>
          </div>
      </div>
    </>
  );
};

export default CountriesPage;
