import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  showValue?: boolean;
  showOutOf?: boolean;
  precision?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  color?: 'yellow' | 'blue' | 'green' | 'red' | 'purple';
  className?: string;
  valueClassName?: string;
}

interface RatingBreakdownProps {
  ratings: {
    trust: number;
    platform: number;
    costs: number;
    service: number;
    features: number;
  };
  showLabels?: boolean;
  className?: string;
}

interface RatingDistributionProps {
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  totalReviews: number;
  className?: string;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  maxRating = 5,
  size = 'medium',
  showValue = true,
  showOutOf = false,
  precision = 1,
  interactive = false,
  onRatingChange,
  readonly = false,
  color = 'yellow',
  className = '',
  valueClassName = ''
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  // Size configurations
  const sizeConfig = {
    small: {
      star: 'h-3 w-3',
      text: 'text-xs',
      gap: 'space-x-0.5'
    },
    medium: {
      star: 'h-4 w-4',
      text: 'text-sm',
      gap: 'space-x-1'
    },
    large: {
      star: 'h-5 w-5',
      text: 'text-base',
      gap: 'space-x-1'
    },
    'extra-large': {
      star: 'h-6 w-6',
      text: 'text-lg',
      gap: 'space-x-1.5'
    }
  };

  // Color configurations
  const colorConfig = {
    yellow: {
      filled: 'text-yellow-400',
      empty: 'text-gray-300',
      hover: 'hover:text-yellow-500'
    },
    blue: {
      filled: 'text-blue-500',
      empty: 'text-gray-300',
      hover: 'hover:text-blue-600'
    },
    green: {
      filled: 'text-green-500',
      empty: 'text-gray-300',
      hover: 'hover:text-green-600'
    },
    red: {
      filled: 'text-red-500',
      empty: 'text-gray-300',
      hover: 'hover:text-red-600'
    },
    purple: {
      filled: 'text-purple-500',
      empty: 'text-gray-300',
      hover: 'hover:text-purple-600'
    }
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];

  const handleStarClick = (starRating: number) => {
    if (interactive && !readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number | null) => {
    if (interactive && !readonly) {
      setHoverRating(starRating);
    }
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;
  const formattedRating = parseFloat(rating.toFixed(precision));

  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= displayRating;
      const isPartiallyFilled = !isFilled && i - 1 < displayRating && displayRating < i;
      
      stars.push(
        <div key={i} className="relative">
          {interactive && !readonly ? (
            <button
              onClick={() => handleStarClick(i)}
              onMouseEnter={() => handleStarHover(i)}
              onMouseLeave={() => handleStarHover(null)}
              className={`transition-colors ${colors.hover}`}
              aria-label={`Rate ${i} star${i !== 1 ? 's' : ''}`}
            >
              {isFilled ? (
                <StarIcon className={`${config.star} ${colors.filled}`} />
              ) : (
                <StarOutlineIcon className={`${config.star} ${colors.empty}`} />
              )}
            </button>
          ) : (
            <>
              {isPartiallyFilled ? (
                <div className="relative">
                  <StarOutlineIcon className={`${config.star} ${colors.empty}`} />
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${(displayRating - (i - 1)) * 100}%` }}
                  >
                    <StarIcon className={`${config.star} ${colors.filled}`} />
                  </div>
                </div>
              ) : (
                isFilled ? (
                  <StarIcon className={`${config.star} ${colors.filled}`} />
                ) : (
                  <StarOutlineIcon className={`${config.star} ${colors.empty}`} />
                )
              )}
            </>
          )}
        </div>
      );
    }
    
    return stars;
  };

  return (
    <div className={`flex items-center ${config.gap} ${className}`}>
      <div className={`flex items-center ${config.gap}`}>
        {renderStars()}
      </div>
      
      {showValue && (
        <span className={`font-medium text-gray-900 ${config.text} ${valueClassName}`}>
          {formattedRating}{showOutOf && `/${maxRating}`}
        </span>
      )}
    </div>
  );
};

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  ratings,
  showLabels = true,
  className = ''
}) => {
  const categories = [
    { key: 'trust' as keyof typeof ratings, label: 'Trust', color: 'green' as const },
    { key: 'platform' as keyof typeof ratings, label: 'Platform', color: 'blue' as const },
    { key: 'costs' as keyof typeof ratings, label: 'Costs', color: 'yellow' as const },
    { key: 'service' as keyof typeof ratings, label: 'Service', color: 'purple' as const },
    { key: 'features' as keyof typeof ratings, label: 'Features', color: 'red' as const }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {categories.map(({ key, label, color }) => (
        <div key={key} className="flex items-center justify-between">
          {showLabels && (
            <span className="text-sm font-medium text-gray-700 w-20">
              {label}
            </span>
          )}
          <div className="flex-1 mx-3">
            <RatingDisplay
              rating={ratings[key]}
              size="small"
              showValue={false}
              color={color}
            />
          </div>
          <span className="text-sm text-gray-600 w-8 text-right">
            {ratings[key].toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
};

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
  distribution,
  totalReviews,
  className = ''
}) => {
  const maxCount = Math.max(...Object.values(distribution));
  
  return (
    <div className={`space-y-2 ${className}`}>
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = distribution[rating as keyof typeof distribution];
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
        
        return (
          <div key={rating} className="flex items-center text-sm">
            <div className="flex items-center w-12">
              <span className="text-gray-600 mr-1">{rating}</span>
              <StarIcon className="h-3 w-3 text-yellow-400" />
            </div>
            
            <div className="flex-1 mx-3">
              <div className="bg-gray-200 rounded-full h-2 relative overflow-hidden">
                <div
                  className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 w-16 justify-end">
              <span className="text-gray-600">{count}</span>
              <span className="text-gray-400 text-xs">
                ({percentage.toFixed(0)}%)
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const QuickRating: React.FC<{
  rating: number;
  size?: 'small' | 'medium';
  className?: string;
}> = ({ rating, size = 'small', className = '' }) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-50';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-50';
    if (rating >= 3.0) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const sizeClasses = size === 'small' 
    ? 'px-2 py-1 text-xs' 
    : 'px-3 py-1.5 text-sm';

  return (
    <div className={`inline-flex items-center rounded-full font-medium ${getRatingColor(rating)} ${sizeClasses} ${className}`}>
      <StarIcon className={`mr-1 ${size === 'small' ? 'h-3 w-3' : 'h-4 w-4'} text-current`} />
      {rating.toFixed(1)}
    </div>
  );
};

export const RatingTrend: React.FC<{
  currentRating: number;
  previousRating?: number;
  showChange?: boolean;
  className?: string;
}> = ({ currentRating, previousRating, showChange = true, className = '' }) => {
  const change = previousRating ? currentRating - previousRating : 0;
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <RatingDisplay rating={currentRating} size="medium" showValue />
      
      {showChange && previousRating && Math.abs(change) >= 0.1 && (
        <div className={`flex items-center text-xs font-medium ${
          isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'
        }`}>
          {isPositive && '↗'}
          {isNegative && '↘'}
          {Math.abs(change).toFixed(1)}
        </div>
      )}
    </div>
  );
};

export default RatingDisplay;