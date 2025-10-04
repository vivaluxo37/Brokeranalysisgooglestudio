import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { enhancedCategories, categoryGroups } from '../data/enhancedCategoryMappings';

interface EnhancedCategoryGridProps {
  showAll?: boolean;
  maxItems?: number;
  groupFilter?: string;
  brokerCounts?: Record<string, number>;
}

const EnhancedCategoryGrid: React.FC<EnhancedCategoryGridProps> = ({
  showAll = false,
  maxItems = 12,
  groupFilter,
  brokerCounts = {}
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(groupFilter || null);

  // Filter categories based on selected group
  const filteredCategories = selectedGroup
    ? enhancedCategories.filter(cat => cat.categoryGroup === selectedGroup)
    : enhancedCategories;

  // Limit displayed categories
  const displayedCategories = showAll
    ? filteredCategories
    : filteredCategories.slice(0, maxItems);

  const groupInfo = {
    general: {
      name: 'General Broker Types',
      description: 'Comprehensive broker categories for all trading styles',
      color: 'bg-blue-500'
    },
    execution: {
      name: 'Execution Types',
      description: 'Brokers classified by order execution methods',
      color: 'bg-green-500'
    },
    strategy: {
      name: 'Strategy Types',
      description: 'Brokers optimized for specific trading strategies',
      color: 'bg-purple-500'
    },
    feature: {
      name: 'Feature Types',
      description: 'Brokers with specific features and account types',
      color: 'bg-orange-500'
    }
  };

  return (
    <div className="w-full">
      {/* Group Filter Tabs */}
      {!showAll && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedGroup(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedGroup === null
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Categories
            </button>
            {Object.entries(groupInfo).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setSelectedGroup(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGroup === key
                    ? `${info.color} text-white`
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {info.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Group Description */}
      {selectedGroup && groupInfo[selectedGroup as keyof typeof groupInfo] && (
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            {groupInfo[selectedGroup as keyof typeof groupInfo].description}
          </p>
        </div>
      )}

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedCategories.map((category) => (
          <Link
            key={category.id}
            to={`/best-brokers/enhanced/${category.slug}`}
            className="group block"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 h-full">
              {/* Category Header */}
              <div className="flex items-center mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white mr-3"
                  style={{ backgroundColor: category.color || '#3B82F6' }}
                >
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      category.categoryGroup === 'general' ? 'bg-blue-100 text-blue-700' :
                      category.categoryGroup === 'execution' ? 'bg-green-100 text-green-700' :
                      category.categoryGroup === 'strategy' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {category.categoryGroup}
                    </span>
                    <span className="text-xs text-gray-500">
                      {brokerCounts[category.id] || 0} brokers
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {category.description}
              </p>

              {/* Key Features */}
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-700 mb-2">Key Features:</div>
                <div className="flex flex-wrap gap-1">
                  {category.localContext.keyFeatures.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                  {category.localContext.keyFeatures.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{category.localContext.keyFeatures.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Best For */}
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-700 mb-1">Best For:</div>
                <div className="text-xs text-gray-600">
                  {category.localContext.bestFor.slice(0, 2).join(', ')}
                  {category.localContext.bestFor.length > 2 && '...'}
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-blue-600 font-medium group-hover:text-blue-700">
                  {brokerCounts[category.id] > 0 ? `View ${brokerCounts[category.id]} Brokers →` : 'Coming Soon'}
                </span>
                <div className="text-xs text-gray-500">
                  {brokerCounts[category.id] > 0 ? `${brokerCounts[category.id]} available` : 'No data'}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Show More Button */}
      {!showAll && filteredCategories.length > maxItems && (
        <div className="text-center mt-8">
          <Link
            to="/best-brokers"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All {filteredCategories.length} Categories
          </Link>
        </div>
      )}
    </div>
  );
};

export default EnhancedCategoryGrid;