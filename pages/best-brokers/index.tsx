import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRightIcon, FunnelIcon, StarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import MetaTags from '../../components/common/MetaTags';
import JsonLdSchema from '../../components/common/JsonLodSchema';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { SEOPageConfig } from '../../data/seoPageConfigs';
import { getSEOPageConfigBySlug } from '../../data/seoPageConfigs';
import { getCategoriesByType, POPULAR_CATEGORIES } from '../../lib/constants/categories';
import BrokerCard from '../../components/brokers/BrokerCard';
import { useStructuredData } from '../../services/structuredDataGenerator';
import { useMetaTagOptimizer } from '../../services/metaTagOptimizer';
import { useContentGenerator } from '../../services/contentGenerator';
import { brokers } from '../../data/brokers';

interface FilterState {
  minDeposit: number;
  regulation: string[];
  platforms: string[];
  sortBy: 'score' | 'minDeposit' | 'spreads' | 'name';
  sortOrder: 'asc' | 'desc';
}

const BestBrokersPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [filterState, setFilterState] = useState<FilterState>({
    minDeposit: 0,
    regulation: [],
    platforms: [],
    sortBy: 'score',
    sortOrder: 'desc'
  });
  const [filteredBrokers, setFilteredBrokers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For the main /best-brokers page, we show top brokers
  const pageConfig = categorySlug ? getSEOPageConfigBySlug(categorySlug) : {
    title: 'Best Forex Brokers',
    description: 'Find the best forex brokers matching your criteria with detailed analysis.',
    url: 'https://bestforexbrokers.com/best-brokers'
  };

  // Helper function to extract regulators from broker data
  const extractRegulators = (broker: any): string[] => {
    const regulators: string[] = [];

    // From regulations array
    if (broker.regulations && Array.isArray(broker.regulations)) {
      broker.regulations.forEach((reg: any) => {
        const regulator = typeof reg === 'string' ? reg : reg.regulator;
        if (regulator) regulators.push(regulator);
      });
    }

    // From regulation.regulators
    if (broker.regulation?.regulators && Array.isArray(broker.regulation.regulators)) {
      broker.regulation.regulators.forEach((reg: string) => {
        if (reg && !regulators.includes(reg)) regulators.push(reg);
      });
    }

    // From security.regulatedBy
    if (broker.security?.regulatedBy && Array.isArray(broker.security.regulatedBy)) {
      broker.security.regulatedBy.forEach((entry: any) => {
        if (entry.regulator && !regulators.includes(entry.regulator)) {
          regulators.push(entry.regulator);
        }
      });
    }

    return regulators;
  };

  useEffect(() => {
    const loadBrokers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let pageConfig = null;
        if (categorySlug) {
          pageConfig = getSEOPageConfigBySlug(categorySlug);
        }

        if (!pageConfig) {
          console.log(`No page configuration found for category: ${categorySlug}`);
          setError(`Page not found for category: ${categorySlug}`);
          return;
        }

        // Get brokers from SEO config or use all brokers
        let pageBrokers = [];
        if (pageConfig.filters) {
          // Filter based on page config filters
          pageBrokers = brokers.filter(broker => {
            // Check minimum deposit filter
            if (pageConfig.filters.minDeposit && broker.accessibility?.minDeposit < pageConfig.filters.minDeposit) {
              return false;
            }
            
            // Check regulation filter
            if (pageConfig.filters.regulation?.length > 0) {
              const brokerRegulators = extractRegulators(broker);
              const hasRequiredRegulation = pageConfig.filters.regulation.some(reg => 
                brokerRegulators.includes(reg)
              );
              if (!hasRequiredRegulation) {
                return false;
              }
            }
            
            // Check platform filter
            if (pageConfig.filters.platforms?.length > 0) {
              const brokerPlatforms = broker.technology?.platforms || [];
              const hasRequiredPlatform = pageConfig.filters.platforms.some(platform => 
                brokerPlatforms.includes(platform)
              );
              if (!hasRequiredPlatform) {
                return false;
              }
            }
            
            return true;
          });
        } else {
          // Use all brokers for main page
          pageBrokers = brokers;
        }

        setFilteredBrokers(pageBrokers);
      } catch (err) {
        console.error('Failed to load brokers:', err.message);
        setError(err instanceof Error ? err.message : 'Failed to load broker data');
      } finally {
        setLoading(false);
      }
    };

    loadBrokers();
  }, [categorySlug]);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...updates }));
  };

  const applyFilters = () => {
    let filtered = [...filteredBrokers];

    // Apply min deposit filter
    if (filterState.minDeposit > 0) {
      filtered = filtered.filter(broker =>
        (broker.accessibility?.minDeposit || 0) <= filterState.minDeposit
      );
    }

    // Apply regulation filter
    if (filterState.regulation.length > 0) {
      filtered = filtered.filter(broker => {
        const brokerRegulators = extractRegulators(broker);
        const hasRequiredRegulation = filterState.regulation.some(reg =>
          brokerRegulators.includes(reg)
        );
        return hasRequiredRegulation;
      });
    }

    // Apply platform filter
    if (filterState.platforms.length > 0) {
      filtered = filtered.filter(broker => {
        const brokerPlatforms = broker.technology?.platforms || [];
        const hasRequiredPlatform = filterState.platforms.some(platform =>
          brokerPlatforms.includes(platform)
        );
        return hasRequiredPlatform;
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      // Sort by specified criteria
      if (filterState.sortBy === 'score') {
        comparison = (b.score || 0) - (a.score || 0);
      } else if (filterState.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (filterState.sortBy === 'minDeposit') {
        const aMin = a.accessibility?.minDeposit || 0;
        const bMin = b.accessibility?.minDeposit || 0;
        comparison = aMin - bMin;
      } else if (filterState.sortBy === 'spreads') {
        const aSpreads = parseFloat(b.tradingConditions?.spreads?.eurusd || '0');
        const bSpreads = parseFloat(b.tradingConditions?.spreads?.eurusd || '0');
        comparison = aSpreads - bSpreads;
      }

      return comparison * (filterState.sortOrder === 'desc' ? -1 : 1);
    });

    return sorted;
  };

  const displayBrokers = applyFilters();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": pageConfig?.title || 'Best Forex Brokers',
    "description": pageConfig?.description || 'Find the best forex brokers matching your criteria with detailed analysis.',
    "url": pageConfig?.url || 'https://bestforexbrokers.com/best-brokers',
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": displayBrokers.length,
      "itemListElement": displayBrokers.map((broker, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": broker.name,
        "url": `https://bestforexbrokers.com/broker/${broker.id}`,
        "description": broker.description || `${broker.name} - ${broker.summary || 'No summary available'}`,
        "image": broker.logoUrl,
        "score": broker.score,
        "regulation": broker.regulation?.regulators || [],
        "platforms": broker.technology?.platforms || []
      }))
    },
    "breadcrumb": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem", "name": "Home", "item": "https://bestforexbrokers.com/" }
        },
        {
          "@type": "ListItem", "name": "Best Brokers", "item": "https://bestforexbrokers.com/brokers" }
        }
      ]
    };

    return (
      <>
        <MetaTags
          title={pageConfig?.title || 'Best Forex Brokers'}
          description={pageConfig?.description || 'Find the best forex brokers matching your criteria.'}
          keywords={pageConfig?.keywords || []}
          canonicalUrl={pageConfig?.url || 'https://bestforexbrokers.com/best-brokers'}
        />

        <JsonLdSchema data={jsonLd} />

        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:page-width-container">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {pageConfig?.title || 'Best Forex Brokers'}
              </h1>
              <p className="text-lg text-gray-600 mt-2 max-w-3xl mx-auto">
                {pageConfig?.description || 'Find the best forex brokers matching your criteria.'}
              </p>
            </div>

            {/* Filter Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Min Deposit Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Deposit: ${filterState.minDeposit > 0 ? `$${filterState.minDeposit}` : 'Any'}
                  </label>
                  <input
                    type="number"
                    value={filterState.minDeposit || ''}
                    onChange={(e) => handleFilterChange({ minDeposit: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min={0}
                    max={10000}
                    step={1}
                  />
                </div>

                {/* Regulation Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regulation: {filterState.regulation.length > 0 ? `${filterState.regulation.length} regulators found` : 'Any'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['FCA', 'ASIC', 'CySEC', 'NFA'].map(reg => (
                      <label key={reg} className="flex items-center mr-2">
                        <input
                          type="checkbox"
                          checked={filterState.regulation.includes(reg)}
                          onChange={(e) => {
                            const newRegulation = e.target.value === 'checked' 
                            ? [...filterState.regulation, reg] 
                            : filterState.regulation.filter(r => r !== reg);
                            setFilterState(prev => ({ ...prev, regulation: newRegulation }));
                          }}
                          className="text-sm text-gray-600"
                        />
                        <label htmlFor={reg}>{reg}</label>
                      ))}
                  </div>
                  </div>
                </div>

                {/* Platform Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform: {filterState.platforms.length > 0 ? `${filterState.platforms.length} platforms found` : 'Any'}
                </label>
                  <div className="flex flex-wrap gap-2">
                    {['MT4', 'MT5', 'cTrader', 'TradingView'].map(platform => (
                      <label key={platform} className="flex items-center mr-2">
                        <input
                          type="checkbox"
                          checked={filterState.platforms.includes(platform)}
                          onChange={(e) => {
                          const newPlatforms = e.target.checked
                            ? [...filterState.platforms, platform]
                            : filterState.platforms.filter(p => p !== platform);
                          setFilterState(prev => ({ ...prev, platforms: newPlatforms }));
                        }}
                        <label htmlFor={platform}>{platform}</label>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By: {filterState.sortBy}
                </label>
                  <select
                  value={filterState.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rating">Rating (High to Low)</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="min_deposit">Min Deposit (Low to High)</option>
                  <option value="spreads">Spreads (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Reset Button */}
            <div className="lg:col-span-1 flex items-end">
              <button
                onClick={() => {
                  setFilterState({
                    minDeposit: 0,
                    regulation: [],
                    platforms: [],
                    sortBy: 'score',
                    sortOrder: 'desc'
                  });
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-16">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Results Summary */}
              {displayBrokers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <div className="text-center py-12">
                    <FunnelIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                    <p className="No brokers match your current filters.</p>
                    <button
                      onClick={() => {
                      setFilterState({
                        minDeposit: 0,
                        regulation: [],
                        platforms: [],
                        sortBy: 'score',
                        sortOrder: 'desc'
                      });
                    }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">
                      Found <span className="font-semibold text-blue-600">{displayBrokers.length}</span> matching current filters
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayBrokers.slice(0, 6).map((broker, index) => (
                      <BrokerCard
                        key={broker.id}
                        broker={broker}
                        isRecommended={index < 3}
                        onQuickView={() => {}}
                      />
                    ))}
                  </div>
                </div>

                {/* View More Button */}
                {displayBrokers.length > 6 && (
                  <div className="text-center mt-8">
                    <Link
                      to="/brokers"
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      View All Brokers ({displayBrokers.length} total)
                      <ChevronRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                )}
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BestBrokersPage;
