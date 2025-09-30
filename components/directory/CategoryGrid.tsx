import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  category_type: string;
}

interface CategoryGridProps {
  categories: Category[];
  maxItems?: number;
  showAll?: boolean;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  categories, 
  maxItems = 12,
  showAll = false 
}) => {
  const displayCategories = showAll ? categories : categories.slice(0, maxItems);

  const getCategoryIcon = (categoryType: string, name: string): string => {
    // Simple icon mapping based on category type and name
    if (name.toLowerCase().includes('ecn')) return '⚡';
    if (name.toLowerCase().includes('stp')) return '🔄';
    if (name.toLowerCase().includes('mt4')) return '📊';
    if (name.toLowerCase().includes('mt5')) return '📈';
    if (name.toLowerCase().includes('islamic')) return '🕌';
    if (name.toLowerCase().includes('regulated')) return '🛡️';
    if (name.toLowerCase().includes('scalping')) return '⚡';
    if (name.toLowerCase().includes('hedging')) return '⚖️';
    if (name.toLowerCase().includes('beginner')) return '🎯';
    if (name.toLowerCase().includes('api')) return '🔧';
    if (name.toLowerCase().includes('crypto')) return '₿';
    if (name.toLowerCase().includes('micro')) return '📏';
    if (name.toLowerCase().includes('corporate')) return '🏢';
    if (name.toLowerCase().includes('offshore')) return '🌊';
    
    // Default icons by category type
    switch (categoryType) {
      case 'broker_type': return '🏛️';
      case 'execution': return '⚡';
      case 'strategy': return '📊';
      case 'features': return '⚙️';
      default: return '📋';
    }
  };

  const getCategoryColor = (categoryType: string): string => {
    switch (categoryType) {
      case 'broker_type': return 'border-blue-200 hover:border-blue-300 hover:bg-blue-50';
      case 'execution': return 'border-green-200 hover:border-green-300 hover:bg-green-50';
      case 'strategy': return 'border-purple-200 hover:border-purple-300 hover:bg-purple-50';
      case 'features': return 'border-orange-200 hover:border-orange-300 hover:bg-orange-50';
      default: return 'border-gray-200 hover:border-gray-300 hover:bg-gray-50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayCategories.map((category) => {
        // Safe property access with fallbacks
        const categoryType = category?.category_type || 'default';
        const categoryName = category?.name || 'Unknown Category';
        const categoryDescription = category?.description || 'No description available';
        
        const icon = getCategoryIcon(categoryType, categoryName);
        const colorClasses = getCategoryColor(categoryType);

        return (
          <Link
            key={category?.id || Math.random().toString()}
            to={`/best-brokers/${category?.slug || 'unknown'}`}
            className={`group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border-2 ${colorClasses}`}
          >
            {/* Category Icon & Title */}
            <div className="flex items-start mb-3">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform mr-4">
                <span className="text-2xl">{icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg leading-tight">
                  {categoryName}
                </h3>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
              {categoryDescription}
            </p>
            
            {/* Category Type Badge */}
            <div className="flex items-center justify-between">
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${categoryType === 'broker_type' ? 'bg-blue-100 text-blue-800' : ''}
                ${categoryType === 'execution' ? 'bg-green-100 text-green-800' : ''}
                ${categoryType === 'strategy' ? 'bg-purple-100 text-purple-800' : ''}
                ${categoryType === 'features' ? 'bg-orange-100 text-orange-800' : ''}
                ${categoryType === 'default' ? 'bg-gray-100 text-gray-800' : ''}
              `}>
                {categoryType.replace('_', ' ')}
              </span>
              
              {/* Arrow Icon */}
              <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
            
            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-200 transition-colors pointer-events-none" />
          </Link>
        );
      })}
      
      {/* Show More Card (if applicable) */}
      {!showAll && categories.length > maxItems && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 flex items-center justify-center text-center group cursor-pointer hover:from-blue-100 hover:to-blue-200 transition-all">
          <div>
            <div className="text-3xl mb-3">📂</div>
            <p className="text-blue-800 font-semibold mb-2">
              +{categories.length - maxItems} More Categories
            </p>
            <p className="text-blue-600 text-sm">
              View all available categories
            </p>
            <ChevronRightIcon className="h-5 w-5 text-blue-600 mx-auto mt-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;