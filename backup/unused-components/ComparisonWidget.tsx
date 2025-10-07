import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  PlusIcon,
  XMarkIcon,
  ScaleIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface Broker {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  overall_rating: number;
  min_deposit?: number;
  min_deposit_currency?: string;
  max_leverage?: number;
  spreads_from?: number;
  regulated?: boolean;
}

interface ComparisonWidgetProps {
  currentBroker?: Broker;
  position?: 'fixed' | 'static';
  className?: string;
}

const ComparisonWidget: React.FC<ComparisonWidgetProps> = ({
  currentBroker,
  position = 'fixed',
  className = ''
}) => {
  const router = useRouter();
  const [comparedBrokers, setComparedBrokers] = useState<Broker[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Load comparison list from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('broker_comparison');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setComparedBrokers(parsed);
          setIsVisible(parsed.length > 0);
        } catch (e) {
          console.error('Failed to parse comparison list:', e);
        }
      }
    }
  }, []);

  // Save comparison list to localStorage
  const saveToStorage = (brokers: Broker[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('broker_comparison', JSON.stringify(brokers));
    }
  };

  // Add broker to comparison
  const addToComparison = (broker: Broker) => {
    if (comparedBrokers.length >= 4) {
      alert('You can compare up to 4 brokers at a time');
      return;
    }

    const isAlreadyAdded = comparedBrokers.some(b => b.id === broker.id);
    if (isAlreadyAdded) {
      alert(`${broker.name} is already in your comparison`);
      return;
    }

    const updated = [...comparedBrokers, broker];
    setComparedBrokers(updated);
    saveToStorage(updated);
    setIsVisible(true);
    
    // Show expanded view briefly when adding
    setIsExpanded(true);
    setTimeout(() => setIsExpanded(false), 2000);
  };

  // Remove broker from comparison
  const removeFromComparison = (brokerId: string) => {
    const updated = comparedBrokers.filter(b => b.id !== brokerId);
    setComparedBrokers(updated);
    saveToStorage(updated);
    
    if (updated.length === 0) {
      setIsVisible(false);
      setIsExpanded(false);
    }
  };

  // Clear all comparisons
  const clearComparison = () => {
    setComparedBrokers([]);
    saveToStorage([]);
    setIsVisible(false);
    setIsExpanded(false);
  };

  // Navigate to comparison page
  const goToComparison = () => {
    const brokerSlugs = comparedBrokers.map(b => b.slug).join(',');
    router.push(`/compare?brokers=${brokerSlugs}`);
  };

  // Check if current broker is in comparison
  const isCurrentBrokerInComparison = currentBroker && 
    comparedBrokers.some(b => b.id === currentBroker.id);

  // Don't render if no brokers and no current broker
  if (!isVisible && !currentBroker) {
    return null;
  }

  const containerClasses = position === 'fixed' 
    ? `fixed bottom-6 right-6 z-40 transition-all duration-300 ${isExpanded ? 'w-80' : 'w-16'}`
    : `relative ${className}`;

  return (
    <div className={containerClasses}>
      {/* Current Broker Add Button (when not in comparison) */}
      {currentBroker && !isCurrentBrokerInComparison && position === 'fixed' && (
        <div className="mb-4">
          <button
            onClick={() => addToComparison(currentBroker)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors group"
            title={`Add ${currentBroker.name} to comparison`}
          >
            <PlusIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* Comparison Widget */}
      {isVisible && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div 
            className="bg-blue-600 text-white p-3 cursor-pointer flex items-center justify-between"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center">
              <ScaleIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">
                {isExpanded ? 'Compare Brokers' : comparedBrokers.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {!isExpanded && (
                <span className="text-sm text-blue-100">
                  {comparedBrokers.length}/4
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="hover:bg-blue-700 p-1 rounded transition-colors"
              >
                <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="p-4">
              {/* Broker List */}
              <div className="space-y-3 mb-4">
                {comparedBrokers.map((broker) => (
                  <div key={broker.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                    {/* Broker Info */}
                    <div className="flex items-center flex-1 min-w-0">
                      {broker.logo_url ? (
                        <img 
                          src={broker.logo_url} 
                          alt={broker.name}
                          className="w-8 h-8 rounded mr-3 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-blue-600 font-bold text-sm">
                            {broker.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {broker.name}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">
                              {broker.overall_rating}
                            </span>
                          </div>
                          {broker.min_deposit !== undefined && (
                            <span className="text-xs text-gray-500 ml-2">
                              Min: {broker.min_deposit_currency || '$'}{broker.min_deposit}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromComparison(broker.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
                      title={`Remove ${broker.name}`}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Add More Placeholder */}
                {comparedBrokers.length < 4 && (
                  <Link href="/brokers" className="block">
                    <div className="flex items-center p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 border-2 border-dashed border-gray-400 rounded flex items-center justify-center mr-3">
                        <PlusIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-500">
                        Add more brokers ({comparedBrokers.length}/4)
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={goToComparison}
                  disabled={comparedBrokers.length < 2}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    comparedBrokers.length >= 2
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Compare ({comparedBrokers.length})
                </button>
                
                <button
                  onClick={clearComparison}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                  title="Clear all"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Minimized Quick Actions */}
          {!isExpanded && comparedBrokers.length > 0 && (
            <div className="p-2">
              <div className="flex space-x-1">
                <button
                  onClick={goToComparison}
                  disabled={comparedBrokers.length < 2}
                  className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
                    comparedBrokers.length >= 2
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  Compare
                </button>
                
                <button
                  onClick={clearComparison}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Clear all"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Static Widget for Integration */}
      {position === 'static' && currentBroker && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Compare with Other Brokers</h3>
          
          {!isCurrentBrokerInComparison ? (
            <button
              onClick={() => addToComparison(currentBroker)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add to Comparison
            </button>
          ) : (
            <div className="text-center">
              <p className="text-green-600 font-medium mb-2">✓ Added to comparison</p>
              <button
                onClick={goToComparison}
                disabled={comparedBrokers.length < 2}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  comparedBrokers.length >= 2
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Compare ({comparedBrokers.length}) Brokers
              </button>
            </div>
          )}

          {comparedBrokers.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm text-gray-600 mb-2">Currently comparing:</p>
              <div className="flex flex-wrap gap-1">
                {comparedBrokers.slice(0, 3).map((broker) => (
                  <span 
                    key={broker.id}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                  >
                    {broker.name}
                    {broker.id !== currentBroker?.id && (
                      <button
                        onClick={() => removeFromComparison(broker.id)}
                        className="ml-1 hover:text-blue-900"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
                {comparedBrokers.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{comparedBrokers.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComparisonWidget;