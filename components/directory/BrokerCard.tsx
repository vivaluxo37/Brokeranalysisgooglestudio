import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ShieldCheckIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface Broker {
  id: number;
  name: string;
  overall_rating?: number;
  logo_url?: string;
  minimum_deposit?: number;
  regulation_status?: string;
  trust_score?: number;
  website?: string;
}

interface BrokerCardProps {
  broker: Broker;
  priority?: number;
  showRanking?: boolean;
  ranking?: number;
  showDetailsLink?: boolean;
  compact?: boolean;
  countryContext?: string;
}

const BrokerCard: React.FC<BrokerCardProps> = ({
  broker,
  priority,
  showRanking = false,
  ranking,
  showDetailsLink = true,
  compact = false,
  countryContext
}) => {
  const {
    id,
    name,
    overall_rating = 0,
    logo_url,
    minimum_deposit,
    regulation_status,
    trust_score,
    website
  } = broker;

  // Generate stars rating display
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative h-4 w-4">
            <StarOutlineIcon className="h-4 w-4 text-gray-300 absolute" />
            <div className="overflow-hidden w-1/2">
              <StarIcon className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="h-4 w-4 text-gray-300" />
        );
      }
    }
    
    return stars;
  };

  // Get regulation badge color
  const getRegulationBadgeColor = (regulations: string): string => {
    const reg = regulations?.toLowerCase() || '';
    if (reg.includes('fca') || reg.includes('asic') || reg.includes('finra')) {
      return 'bg-green-100 text-green-800';
    }
    if (reg.includes('cysec') || reg.includes('bafin') || reg.includes('mas')) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  // Format minimum deposit
  const formatMinDeposit = (amount: number): string => {
    if (amount === 0) return 'No minimum';
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
    return `$${amount}`;
  };

  // Get rating color
  const getRatingColor = (rating: number): string => {
    if (rating >= 8.5) return 'text-green-600 bg-green-100';
    if (rating >= 7.0) return 'text-blue-600 bg-blue-100';
    if (rating >= 6.0) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const cardClasses = compact 
    ? 'bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-200 p-4'
    : 'bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-200 p-6';

  return (
    <div className={`group relative ${cardClasses}`}>
      {/* Priority Badge */}
      {showRanking && priority && priority <= 3 && (
        <div className="absolute -top-2 -left-2 z-10">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
            ${priority === 1 ? 'bg-yellow-500' : priority === 2 ? 'bg-gray-400' : 'bg-orange-500'}
          `}>
            <TrophyIcon className="h-4 w-4" />
          </div>
        </div>
      )}

      {/* Ranking Number */}
      {showRanking && (priority || ranking) && (
        <div className="absolute top-4 right-4">
          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {ranking || priority}
          </div>
        </div>
      )}

      {/* Logo and Name */}
      <div className="flex items-center mb-4">
        {logo_url ? (
          <img
            src={logo_url}
            alt={`${name} logo`}
            className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-2 mr-3"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-gray-400 font-semibold text-lg">
              {name.charAt(0)}
            </span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </div>
      </div>

      {/* Rating and Trust Score */}
      {(overall_rating > 0 || trust_score) && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStarRating(overall_rating)}
            </div>
            <span className={`
              px-2 py-1 rounded-full text-sm font-medium
              ${getRatingColor(overall_rating)}
            `}>
              {overall_rating.toFixed(1)}
            </span>
          </div>
          
          {trust_score && trust_score !== overall_rating && (
            <div className="text-sm text-gray-600">
              Trust: {trust_score.toFixed(1)}
            </div>
          )}
        </div>
      )}

      {/* Key Information */}
      <div className="space-y-2 mb-4">
        {/* Minimum Deposit */}
        {minimum_deposit !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Min. Deposit:</span>
            <span className="font-medium text-gray-900">
              {formatMinDeposit(minimum_deposit)}
            </span>
          </div>
        )}

        {/* Regulation */}
        {regulation_status && (
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-4 w-4 text-green-500" />
            <span className={`
              text-xs px-2 py-1 rounded-full font-medium
              ${getRegulationBadgeColor(regulation_status)}
            `}>
              {regulation_status}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {showDetailsLink && (
          <Link
            to={`/broker/${id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-lg font-medium text-sm transition-colors"
          >
            View Details
          </Link>
        )}
        
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-medium text-sm transition-colors"
          >
            Visit Site
          </a>
        )}
        
        {!website && (
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-medium text-sm transition-colors">
            Learn More
          </button>
        )}
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-200 transition-colors pointer-events-none" />
    </div>
  );
};

export default BrokerCard;