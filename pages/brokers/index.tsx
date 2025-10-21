import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, StarIcon, FilterIcon } from '@heroicons/react/24/outline';
import MetaTags from '../../components/common/MetaTags';
import JsonLdSchema from '../../components/common/JsonLdSchema';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { brokers } from '../../data/brokers';
import BrokerCard from '../../components/brokers/BrokerCard';
import { getBrokersForCountry } from '../../lib/data/countryBrokerMappings';
import { POPULAR_CATEGORIES } from '../../lib/constants/categories';
import { POPULAR_COUNTRIES } from '../../lib/constants/countries';

const BrokersPage: React.FC = () => {
  const [filteredBrokers, setFilteredBrokers] = useState(brokers);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'min_deposit'>('rating');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilteredBrokers(brokers);
  }, []);

  const handleCategoryFilter = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
  };

  const handleCountryFilter = (countrySlug: string) => {
    setSelectedCountry(countrySlug);
  };

  const handleSort = (sortType: 'rating' | 'name' | 'min_deposit') => {
    setSortBy(sortType);
    
    let sorted = [...filteredBrokers];
    
    switch (sortType) {
      case 'rating':
        sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'min_deposit':
        sorted.sort((a, b) => {
          const aMin = a.accessibility?.minDeposit || Infinity;
          const bMin = b.accessibility?.minDeposit || Infinity;
          return aMin - bMin;
        });
        break;
    }
    
    setFilteredBrokers(sorted);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = brokers.filter(broker => 
      broker.name.toLowerCase().includes(term.toLowerCase()) ||
      broker.description?.toLowerCase().includes(term.toLowerCase()) ||
      broker.regulation?.regulators?.some(reg => 
        reg.toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredBrokers(filtered);
  };

  const getFilteredBrokers = () => {
    let result = [...filteredBrokers];
    
    if (selectedCategory) {
      const categoryBrokers = brokers.filter(broker => 
        broker.categories?.some(cat => cat.slug === selectedCategory)
      );
      result = categoryBrokers.length > 0 ? categoryBrokers : result;
    }
    
    if (selectedCountry) {
      const countryBrokers = getBrokersForCountry(selectedCountry)
        .map(brokerId => brokers.find(b => b.id === brokerId))
        .filter(Boolean);
      result = countryBrokers.length > 0 ? countryBrokers : result;
    }
    
    if (searchTerm) {
      const searchBrokers = filteredBrokers.filter(broker => 
        broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      result = searchBrokers;
    }
    
    return result;
  };

  const displayBrokers = getFilteredBrokers();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "All Forex Brokers",
    "description": "Comprehensive list of all forex brokers with detailed comparisons and reviews. Find the perfect trading platform.",
    "url": "https://bestforexbrokers.com/brokers",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": displayBrokers.length,
      "itemListElement": displayBrokers.map((broker, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": broker.name,
        "url": `https://bestforexbrokers.com/broker/${broker.id}`,
        "description": broker.description || `${broker.name} - ${broker.summary || 'No summary available'}`,
        "image": broker.logoUrl
      }))
    },
    "breadcrumb": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "name": "Home",
            "item": "https://bestforebrokers.com/"
          },
          {
            "@type": "ListItem",
            "name": "Brokers",
            "item": "https://bestforexbrokers.com/brokers"
          }
        ]
      ]
  };

  return (
    <>
      <MetaTags
        title="All Forex Brokers - Compare & Find the Best Trading Platform"
        description="Complete directory of forex brokers with detailed comparisons, reviews, and expert analysis. Compare spreads, regulation, platforms, and features to find your perfect trading platform."
        keywords={[
          'forex brokers',
          'all brokers',
          'broker comparison',
          'trading platforms',
          'forex reviews',
          'best trading platform'
        ]}
      />

      <JsonLdSchema data={jsonLd} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              All Forex Brokers
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Compare all forex brokers side by side with detailed analysis and expert reviews.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Brokers
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {POPULAR_CATEGORIES.map(category => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Countries</option>
                  {POPULAR_COUNTRIES.map(country => (
                    <option key={country.slug} value={country.slug}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rating">Rating (High to Low)</option>
                  <option value="name">Name (A to Z)</option>
                  <option value="min_deposit">Min Deposit (Low to High)</option>
                </select>
              </div>

              {/* Reset Filters */}
              <div className="lg:col-span-1 flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedCountry('');
                    setSearchTerm('');
                    setSortBy('rating');
                  }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-16">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {displayBrokers.length} of {brokers.length} brokers
              </div>

              {displayBrokers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <div className="text-center py-12">
                    <FilterIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No brokers found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or search terms.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        setSelectedCountry('');
                        setSearchTerm('');
                        setSortBy('rating');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayBrokers.map((broker) => (
                    <BrokerCard
                      key={broker.id}
                      broker={broker}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BrokersPage;
