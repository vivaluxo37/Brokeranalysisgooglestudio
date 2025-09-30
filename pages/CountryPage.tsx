import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRightIcon, GlobeAltIcon, ShieldCheckIcon, StarIcon } from '@heroicons/react/24/outline';
import SEOHead from '../components/seo/SEOHead';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import BrokerCard from '../components/directory/BrokerCard';
import { 
  COUNTRIES, 
  getCountryBySlug, 
  CountryConfig 
} from '../lib/constants/countries';

interface FeaturedBroker {
  id: number;
  name: string;
  overall_rating: number;
  logo_url?: string;
  minimum_deposit: number;
  regulation_status: string;
  website?: string;
}

const CountryPage: React.FC = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const [country, setCountry] = useState<CountryConfig | null>(null);
  const [brokers, setBrokers] = useState<FeaturedBroker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPageData();
  }, [countrySlug]);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!countrySlug) {
        throw new Error('Country slug is required');
      }

      const countryData = getCountryBySlug(countrySlug);
      if (!countryData) {
        throw new Error('Country not found');
      }

      setCountry(countryData);

      // Mock brokers for this country - in a real app, you'd fetch from your API
      const mockBrokers: FeaturedBroker[] = [
        {
          id: 1,
          name: 'IG Markets',
          overall_rating: 4.8,
          logo_url: 'https://example.com/ig-logo.png',
          minimum_deposit: 250,
          regulation_status: 'FCA, ASIC, CYSEC',
          website: 'https://www.ig.com'
        },
        {
          id: 2,
          name: 'XM Group',
          overall_rating: 4.5,
          logo_url: 'https://example.com/xm-logo.png',
          minimum_deposit: 5,
          regulation_status: 'CYSEC, ASIC, FCA',
          website: 'https://www.xm.com'
        },
        {
          id: 3,
          name: 'Plus500',
          overall_rating: 4.2,
          logo_url: 'https://example.com/plus500-logo.png',
          minimum_deposit: 100,
          regulation_status: 'FCA, CYSEC, ASIC',
          website: 'https://www.plus500.com'
        }
      ];

      setBrokers(mockBrokers);

    } catch (err) {
      console.error('Error loading country page data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // JSON-LD structured data
  const jsonLd = country ? {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${country.name} Forex Brokers`,
    description: country.metaDescription,
    url: typeof window !== 'undefined' ? window.location.href : `https://brokeranalysis.com/best-forex-brokers/${country.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: typeof window !== 'undefined' ? window.location.origin : 'https://brokeranalysis.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Countries',
          item: typeof window !== 'undefined' ? `${window.location.origin}/countries` : 'https://brokeranalysis.com/countries'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: country.name,
          item: typeof window !== 'undefined' ? window.location.href : `https://brokeranalysis.com/best-forex-brokers/${country.slug}`
        }
      ]
    }
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Loading Country Brokers..."
          description="Loading country-specific broker information..."
        />
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Country Not Found"
          description="The requested country page could not be found."
        />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Country Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The requested country could not be found.'}</p>
          <Link
            to="/countries"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse All Countries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={country.seoTitle}
        description={country.metaDescription}
        keywords={country.keywords}
        jsonLd={jsonLd}
      />

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <Link to="/countries" className="text-gray-500 hover:text-gray-700">
              Countries
            </Link>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{country.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl mr-4">{country.flag}</span>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold">
                  {country.name}<br />
                  <span className="text-blue-200">Forex Brokers</span>
                </h1>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {country.description}
            </p>
            
            {/* Quick Navigation */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <a 
                href="#brokers"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
              >
                View Available Brokers
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="#info"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
              >
                Country Information
              </a>
            </div>

            {/* Country Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GlobeAltIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{brokers.length} Available Brokers</h3>
                <p className="text-blue-100 text-sm">Licensed and regulated brokers</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheckIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Regulated Market</h3>
                <p className="text-blue-100 text-sm">Strong regulatory framework</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <StarIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">High Quality Service</h3>
                <p className="text-blue-100 text-sm">Top-rated broker platforms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Brokers Section */}
      <section id="brokers" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best Brokers Available in {country.name}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These brokers are verified to accept clients from {country.name} and comply with local regulations.
            </p>
          </div>

          {brokers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brokers.map((broker, index) => (
                <BrokerCard
                  key={broker.id}
                  broker={broker}
                  priority={index + 1}
                  showRanking={true}
                  countryContext={country.name}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No brokers currently available for {country.name}</p>
            </div>
          )}
        </div>
      </section>

      {/* Country Information Section */}
      <section id="info" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trading in {country.name}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Important information for traders in {country.name}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Regulatory Environment</h3>
              <p className="text-gray-600 leading-relaxed">
                {country.name} maintains a well-regulated financial services sector with strong oversight
                of forex and CFD brokers. All recommended brokers are properly licensed and regulated
                to serve clients in this jurisdiction.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Methods</h3>
              <p className="text-gray-600 leading-relaxed">
                Most brokers accepting clients from {country.name} support local payment methods
                including bank transfers, credit/debit cards, and popular e-wallets for convenient
                funding and withdrawals.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tax Considerations</h3>
              <p className="text-gray-600 leading-relaxed">
                Trading profits may be subject to taxation in {country.name}. We recommend consulting
                with a local tax professional to understand your obligations and ensure compliance
                with local tax laws.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Local Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Many brokers offer customer support in local languages and during business hours
                suitable for {country.name} traders. Look for brokers with dedicated local support teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Choose from our recommended brokers that accept clients from {country.name} 
            and start your trading journey with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#brokers"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
            >
              Compare Brokers
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </a>
            <Link
              to="/best-brokers"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors inline-flex items-center justify-center"
            >
              Browse All Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CountryPage;