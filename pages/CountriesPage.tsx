import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import SEOHead from '../components/seo/SEOHead';
import { COUNTRIES, POPULAR_COUNTRIES, CountryConfig } from '../lib/constants/countries';

const CountriesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Filter countries based on search and region
  const filteredCountries = COUNTRIES.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  // Get unique regions
  const regions = Array.from(new Set(COUNTRIES.map(country => country.region))).sort();

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Countries with Available Brokers',
    description: 'Complete list of countries where forex and CFD brokers accept clients. Find brokers available in your country.',
    url: typeof window !== 'undefined' ? window.location.href : 'https://brokeranalysis.com/countries',
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
          item: typeof window !== 'undefined' ? window.location.href : 'https://brokeranalysis.com/countries'
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Forex Brokers by Country — Find Brokers Available in Your Location | BrokerAnalysis"
        description="Comprehensive directory of countries where forex and CFD brokers accept clients. Find regulated brokers available in your country with local support."
        keywords={['forex brokers by country', 'country specific brokers', 'regulated brokers', 'local brokers', 'broker availability']}
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <div className="h-16 w-16 mx-auto bg-blue-200 rounded-full flex items-center justify-center mb-4">
              <GlobeAltIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Brokers by
            <span className="block text-blue-200">Country</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Discover brokers available in your country with local regulation, support, and payment methods.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{COUNTRIES.length}+</div>
              <div className="text-blue-200 text-sm">Countries Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{regions.length}</div>
              <div className="text-blue-200 text-sm">Global Regions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-blue-200 text-sm">Broker-Country Pairs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Countries */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Countries</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Most searched countries with high broker availability
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {POPULAR_COUNTRIES.slice(0, 12).map(country => (
              <Link
                key={country.slug}
                to={`/best-forex-brokers/${country.slug}`}
                className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all text-center"
              >
                <div className="text-4xl mb-3">{country.flag}</div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
                  {country.name}
                </h3>
                <p className="text-sm text-gray-500">View Brokers</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Countries</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse all {COUNTRIES.length} countries where brokers accept clients
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {/* Countries Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCountries.map(country => (
              <Link
                key={country.slug}
                to={`/best-forex-brokers/${country.slug}`}
                className="group block p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">{country.flag}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {country.name}
                    </h3>
                    <p className="text-sm text-gray-500">{country.code}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {country.region}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">
                  Find regulated brokers accepting clients from {country.name}
                </p>
              </Link>
            ))}
          </div>

          {filteredCountries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No countries found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Country Matters</h2>
            <p className="text-xl text-gray-600">
              Choosing the right broker for your location is crucial for a safe trading experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Regulation & Safety</h3>
              <p className="text-gray-600">
                Brokers must be licensed in your jurisdiction to offer services. Local regulation 
                provides investor protection and recourse in case of disputes.
              </p>
            </div>

            <div className="bg-green-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Methods</h3>
              <p className="text-gray-600">
                Local payment methods like bank transfers, local cards, and e-wallets 
                make deposits and withdrawals faster and more cost-effective.
              </p>
            </div>

            <div className="bg-purple-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Support</h3>
              <p className="text-gray-600">
                Local customer support in your language and timezone ensures you get 
                help when you need it most during market hours.
              </p>
            </div>

            <div className="bg-orange-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tax Considerations</h3>
              <p className="text-gray-600">
                Understanding local tax implications of trading profits and choosing 
                brokers that provide appropriate tax documentation is essential.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CountriesPage;