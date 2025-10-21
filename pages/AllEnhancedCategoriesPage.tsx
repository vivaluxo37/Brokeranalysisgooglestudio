import React, { useState, useEffect } from 'react';
import { Helmet } from '../components/seo/HelmetAsync';
import { Link } from 'react-router-dom';
import EnhancedCategoryGrid from '../components/EnhancedCategoryGrid';
import { enhancedCategories, categoryGroups, getBrokersForCategory } from '../data/enhancedCategoryMappings';
import { brokers } from '../data/brokers';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AllEnhancedCategoriesPage: React.FC = () => {
  const [categoryBrokerCounts, setCategoryBrokerCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalCategories = enhancedCategories.length;
  const groupCounts = {
    general: enhancedCategories.filter(cat => cat.categoryGroup === 'general').length,
    execution: enhancedCategories.filter(cat => cat.categoryGroup === 'execution').length,
    strategy: enhancedCategories.filter(cat => cat.categoryGroup === 'strategy').length,
    feature: enhancedCategories.filter(cat => cat.categoryGroup === 'feature').length
  };

  useEffect(() => {
    const calculateBrokerCounts = () => {
      try {
        setLoading(true);
        const counts: Record<string, number> = {};

        console.log('Calculating broker counts for', enhancedCategories.length, 'categories');
        console.log('Available brokers:', brokers.length);

        enhancedCategories.forEach(category => {
          try {
            const categoryBrokers = getBrokersForCategory(brokers, category.id);
            counts[category.id] = categoryBrokers.length;
            console.log(`Category "${category.name}" (${category.id}): ${categoryBrokers.length} brokers`);
          } catch (categoryError) {
            console.error(`Error calculating brokers for category ${category.name}:`, categoryError);
            counts[category.id] = 0;
          }
        });

        setCategoryBrokerCounts(counts);
        setError(null);
      } catch (err) {
        console.error('Error calculating broker counts:', err);
        setError('Failed to load broker data');
      } finally {
        setLoading(false);
      }
    };

    calculateBrokerCounts();
  }, []);

  const groupInfo = {
    general: {
      name: 'General Broker Types',
      description: 'Comprehensive broker categories suitable for all trading styles and experience levels.',
      icon: '🌐',
      color: 'blue'
    },
    execution: {
      name: 'Execution Types',
      description: 'Brokers classified by their order execution methods, from ECN to instant execution.',
      icon: '⚡',
      color: 'green'
    },
    strategy: {
      name: 'Trading Strategies',
      description: 'Specialized brokers optimized for specific trading strategies like scalping, swing trading, and algorithmic trading.',
      icon: '📈',
      color: 'purple'
    },
    feature: {
      name: 'Features & Account Types',
      description: 'Brokers categorized by specific features, account types, and regulatory characteristics.',
      icon: '🎯',
      color: 'orange'
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Calculating broker counts for all categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Categories</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>All Forex Broker Categories 2025 | Complete Guide to Trading Platforms</title>
        <meta name="description" content="Explore 39+ forex broker categories in 2025. Find brokers by execution type, trading strategy, platform, and features. ECN, MT4, Islamic, beginner-friendly, and more." />
        <meta name="keywords" content="forex broker categories, ECN brokers, MT4 brokers, Islamic accounts, scalping brokers, beginner brokers, high leverage brokers, 2025" />
        <link rel="canonical" href={`${window.location.origin}/best-brokers/all-categories`} />

        {/* Open Graph */}
        <meta property="og:title" content="All Forex Broker Categories 2025 | Complete Guide" />
        <meta property="og:description" content="Find the perfect forex broker by exploring 39+ specialized categories. From ECN to Islamic accounts, discover platforms that match your trading style." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/best-brokers/all-categories`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="All Forex Broker Categories 2025" />
        <meta name="twitter:description" content="Discover 39+ forex broker categories. Find ECN, MT4, Islamic, and specialty brokers for your trading style." />
      </Helmet>

      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/best-brokers" className="text-blue-600 hover:text-blue-800">
              Best Brokers
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">All Categories</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            All Forex Broker Categories 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover the perfect forex broker by exploring {totalCategories} specialized categories.
            From execution methods to trading strategies, find platforms that match your exact requirements and trading style.
          </p>
        </div>

        {/* Category Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {Object.entries(groupInfo).map(([key, info]) => {
            const categoriesInGroup = enhancedCategories.filter(cat => cat.categoryGroup === key);
            const totalBrokersInGroup = categoriesInGroup.reduce((sum, cat) => sum + (categoryBrokerCounts[cat.id] || 0), 0);

            return (
              <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{info.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{info.name}</h3>
                    <div className="text-sm text-gray-500">
                      {groupCounts[key as keyof typeof groupCounts]} categories • {totalBrokersInGroup} brokers
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{info.description}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Navigation */}
        <div className="bg-blue-50 rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { id: 'ecn-brokers', name: 'ECN Brokers' },
              { id: 'metatrader4-mt4', name: 'MT4 Brokers' },
              { id: 'islamic-swap-free', name: 'Islamic Accounts' },
              { id: 'scalping', name: 'Scalping Brokers' },
              { id: 'no-minimum-deposit', name: 'For Beginners' },
              { id: 'high-leverage', name: 'High Leverage' }
            ].map((cat) => (
              <Link
                key={cat.id}
                to={`/best-brokers/${cat.id}`}
                className="block bg-white rounded-lg p-4 text-center hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {categoryBrokerCounts[cat.id] || 0} brokers
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Categories Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Explore All Broker Categories
          </h2>
          <EnhancedCategoryGrid showAll={true} brokerCounts={categoryBrokerCounts} />
        </div>

        {/* How to Choose Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Choose the Right Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Consider Your Trading Style</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Scalpers:</strong> Look for ECN brokers with tight spreads</li>
                <li>• <strong>Swing Traders:</strong> Consider brokers with competitive overnight rates</li>
                <li>• <strong>Algorithmic Traders:</strong> Choose brokers with API access and low latency</li>
                <li>• <strong>Beginners:</strong> Start with educational brokers and demo accounts</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Platform Preferences</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>MT4 Users:</strong> Find brokers with full MT4 support</li>
                <li>• <strong>MT5 Traders:</strong> Look for multi-asset MT5 brokers</li>
                <li>• <strong>Chart Enthusiasts:</strong> Consider TradingView-integrated brokers</li>
                <li>• <strong>Mobile Traders:</strong> Choose brokers with strong mobile apps</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Regulatory Considerations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Regulatory Considerations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Top-Tier Regulation</h3>
              <p className="text-sm text-gray-600">
                FCA, ASIC, NFA regulated brokers offer maximum investor protection but may have lower leverage.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🌊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Offshore Options</h3>
              <p className="text-sm text-gray-600">
                International brokers offer higher leverage but with different regulatory oversight.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚖️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Mixed Regulation</h3>
              <p className="text-sm text-gray-600">
                Many brokers hold multiple licenses, balancing protection with trading flexibility.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Perfect Broker?
            </h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto text-blue-100">
              Explore our comprehensive categories, compare top-rated brokers, and start your trading journey with confidence.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/best-brokers"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse by Category
              </Link>
              <Link
                to="/broker-matcher"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Get Personalized Match
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllEnhancedCategoriesPage;