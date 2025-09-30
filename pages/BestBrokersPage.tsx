import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, TrophyIcon, StarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import SEOHead from '../components/seo/SEOHead';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CategoryGrid from '../components/directory/CategoryGrid';
import BrokerCard from '../components/directory/BrokerCard';
import { 
  BROKER_CATEGORIES, 
  getCategoriesByType, 
  POPULAR_CATEGORIES,
  CategoryConfig 
} from '../lib/constants/categories';
import { 
  COUNTRIES, 
  POPULAR_COUNTRIES, 
  CountryConfig 
} from '../lib/constants/countries';

interface FeaturedBroker {
  id: number;
  name: string;
  overall_rating: number;
  logo_url?: string;
  minimum_deposit: number;
  regulation_status: string;
}

const BestBrokersPage: React.FC = () => {
  const [featuredBrokers, setFeaturedBrokers] = useState<FeaturedBroker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use static categories from constants
  const categories = BROKER_CATEGORIES;

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);
      
      // For now, just use mock featured brokers since we don't have real data
      const mockBrokers = [
        {
          id: 1,
          name: 'IG Markets',
          overall_rating: 4.8,
          logo_url: 'https://example.com/ig-logo.png',
          minimum_deposit: 250,
          regulation_status: 'FCA, ASIC, CYSEC'
        },
        {
          id: 2,
          name: 'XM Group',
          overall_rating: 4.5,
          logo_url: 'https://example.com/xm-logo.png',
          minimum_deposit: 5,
          regulation_status: 'CYSEC, ASIC, FCA'
        },
        {
          id: 3,
          name: 'Plus500',
          overall_rating: 4.2,
          logo_url: 'https://example.com/plus500-logo.png',
          minimum_deposit: 100,
          regulation_status: 'FCA, CYSEC, ASIC'
        }
      ];
      
      setFeaturedBrokers(mockBrokers);
      
    } catch (err) {
      console.error('Error loading page data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Group categories by type using the constants
  const categoryGroups = {
    general: getCategoriesByType('general'),
    execution: getCategoriesByType('execution'),
    strategy: getCategoriesByType('strategy'),
    features: getCategoriesByType('features')
  };

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Best Brokers Directory 2025',
    description: 'Comprehensive directory of the best forex and trading brokers in 2025. Compare categories, features, and find brokers for your country.',
    url: window.location.href,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: window.location.origin
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Best Brokers',
          item: window.location.href
        }
      ]
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Broker Categories',
      numberOfItems: categories.length,
      itemListElement: categories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: category.name,
        description: category.description,
        url: `${window.location.origin}/best-brokers/${category.slug}`
      }))
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Loading Best Brokers Directory..."
          description="Loading the best brokers directory..."
        />
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Error - Best Brokers Directory"
          description="Error loading the best brokers directory"
        />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={loadPageData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Best Brokers Directory 2025 — Compare Top Trading Brokers | BrokerAnalysis"
        description="Find the best forex and trading brokers in 2025. Compare by category, features, regulation, and country availability. Expert analysis and rankings."
        keywords={['best brokers', 'forex brokers', 'trading brokers', 'broker comparison', 'broker directory', '2025']}
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Best Brokers<br />
              <span className="text-blue-200">Directory 2025</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Comprehensive directory of top-rated forex and trading brokers. Find brokers by 
              category, features, regulation, and country availability.
            </p>
            
            {/* Quick Navigation */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <a 
                href="#categories"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
              >
                Browse Categories
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="#featured"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
              >
                Top Rated Brokers
              </a>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrophyIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{categories.length}+ Categories</h3>
                <p className="text-blue-100 text-sm">Comprehensive broker classification</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheckIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Verified Rankings</h3>
                <p className="text-blue-100 text-sm">Data-driven scoring and analysis</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <StarIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">80+ Countries</h3>
                <p className="text-blue-100 text-sm">Country-specific availability checks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Brokers Section */}
      {featuredBrokers.length > 0 && (
        <section id="featured" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Top Rated Brokers 2025
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our highest-rated brokers based on regulation, costs, platforms, and user satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredBrokers.map((broker, index) => (
                <BrokerCard
                  key={broker.id}
                  broker={broker}
                  priority={index + 1}
                  showRanking={true}
                />
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/brokers"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View All Brokers
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Brokers by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover brokers that match your specific trading style, platform preferences, and requirements.
            </p>
          </div>

          {/* General Broker Types */}
          {categoryGroups.general.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">General Broker Types</h3>
              <CategoryGrid categories={categoryGroups.general} />
            </div>
          )}

          {/* Execution Types */}
          {categoryGroups.execution.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Execution Types</h3>
              <CategoryGrid categories={categoryGroups.execution} />
            </div>
          )}

          {/* Trading Strategies */}
          {categoryGroups.strategy.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Trading Strategies</h3>
              <CategoryGrid categories={categoryGroups.strategy} />
            </div>
          )}

          {/* Features & Platforms */}
          {categoryGroups.features.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Features & Platforms</h3>
              <CategoryGrid categories={categoryGroups.features} />
            </div>
          )}
        </div>
      </section>

      {/* Country Directory Teaser */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Brokers for Your Country
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get country-specific broker recommendations with verified availability, 
            local regulation, and payment methods.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {['🇺🇸 USA', '🇬🇧 UK', '🇦🇺 Australia', '🇩🇪 Germany', '🇫🇷 France', '🇯🇵 Japan'].map((country) => (
              <div key={country} className="bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                <span className="font-medium text-gray-900">{country}</span>
              </div>
            ))}
          </div>
          
          <Link
            to="/countries"
            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            View All Countries
            <ChevronRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Use our advanced tools to find the perfect broker for your trading needs, 
            compare features, and get started with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/broker-matcher"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
            >
              Broker Matcher Tool
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/compare"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors inline-flex items-center justify-center"
            >
              Compare Brokers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BestBrokersPage;