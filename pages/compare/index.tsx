import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowPathIcon, ArrowRightIcon, ScaleIcon } from '@heroicons/react/24/outline';
import MetaTags from '../../components/common/MetaTags';
import JsonLdSchema from '../../components/common/JsonLdSchema';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { brokers } from '../../data/brokers';
import ComparisonWidget from '../../components/common/ComparisonWidget';
import BrokerCard from '../../components/brokers/BrokerCard';

const ComparePage: React.FC = () => {
  const [selectedBrokers, setSelectedBrokers] = useState<string[]>([]);
  const [allBrokers] = useState(brokers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load all brokers for comparison
    setAllBrokers(brokers);
  }, []);

  const handleBrokerSelect = (brokerId: string) => {
    if (selectedBrokers.includes(brokerId)) {
      setSelectedBrokers(selectedBrokers.filter(id => id !== brokerId));
    } else {
      setSelectedBrokers([...selectedBrokers, brokerId]);
    }
  };

  const getRecommendedPairs = () => {
    // Find recommended pairs based on regulatory overlap and complementary features
    const pairs = [
      { primary: 'pepperstone', secondary: 'ic-markets', reason: 'Both ECN brokers with low spreads' },
      { primary: 'ig', secondary: 'cmc-markets', reason: 'FCA-regulated with advanced platforms' },
      { primary: 'oanda', secondary: 'forex-com', reason: 'US-focused brokers' },
      { primary: 'saxo-bank', secondary: 'swissquote', reason: 'Premium Swiss banking services' },
      { primary: 'fxpro', secondary: 'avatrade', reason: 'Both offer Islamic accounts' }
    ];
    
    return pairs.filter(pair => 
      allBrokers.some(b => b.id === pair.primary) && 
      allBrokers.some(b => b.id === pair.secondary)
    );
  };

  const availableBrokers = selectedBrokers.length === 0 ? allBrokers : 
    allBrokers.filter(broker => !selectedBrokers.includes(broker.id));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Compare Forex Brokers - Side by Side Comparison Tool",
    "description": "Compare forex brokers side by side. Make informed decisions with detailed comparisons of spreads, features, and regulatory status.",
    "url": "https://bestforexbrokers.com/compare",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "Broker Comparison Tool"
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
            "name": "Compare",
            "item": "https://bestforebrokers.com/compare"
          }
        ]
      ]
    };

  return (
    <>
      <MetaTags
        title="Compare Forex Brokers - Side by Side Comparison Tool"
        description="Compare forex brokers side by side with detailed comparisons of spreads, features, and regulatory status. Make informed trading decisions with our comprehensive comparison tool."
        keywords={[
          'compare forex brokers',
          'forex broker comparison',
          'side by side comparison',
          'broker comparison tool',
          'trading platform comparison'
        ]}
      />

      <JsonLdSchema data={jsonLd} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Compare Forex Brokers
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Compare forex brokers side by side with detailed analysis of spreads, 
              features, and regulatory status.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {selectedBrokers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <div className="text-center py-12">
                    <ScaleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Brokers Selected</h3>
                    <p className="text-gray-600 mb-4">
                      Select brokers to start comparing their features and pricing.
                    </p>
                    <Link
                      to="/brokers"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Brokers
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Selected Brokers */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Selected Brokers ({selectedBrokers.length}/2)
                    </h2>
                    <div className="space-y-4">
                      {selectedBrokers.map((brokerId, index) => {
                        const broker = allBrokers.find(b => b.id === brokerId);
                        return (
                          <div key={brokerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-bold">
                                  {broker.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{broker.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {broker.accessibility?.minDeposit 
                                    ? `$${broker.accessibility.minDeposit || '0'}`
                                    : 'Not specified'}
                                </p>
                              </div>
                              <button
                                onClick={() => handleBrokerSelect(brokerId)}
                                className="px-3 py-1 text-red-600 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comparison Widget */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <ComparisonWidget
                      brokers={selectedBrokers.map(id => 
                        allBrokers.find(b => b.id === id)
                      )}
                      onBrokerSelect={handleBrokerSelect}
                    />
                  </div>

                  {/* Add More Brokers Button */}
                  {availableBrokers.length > 0 && (
                    <div className="text-center">
                      <Link
                        to="/brokers"
                        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                      >
                        Add More Brokers
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                  )}

                  {/* Recommended Pairs */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Recommended Comparisons
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getRecommendedPairs().map((pair, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handleBrokerSelect(pair.primary);
                            handleBrokerSelect(pair.secondary);
                          }}
                          className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left text-sm"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-600">vs</span>
                            <span className="font-medium text-gray-900">
                              {allBrokers.find(b => b.id === pair.primary)?.name || 'Unknown'} vs 
                              allBrokers.find(b => b.id === pair.secondary)?.name || 'Unknown'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {pair.reason}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </>
  );
};

export default ComparePage;
