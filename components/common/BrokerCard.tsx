import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface BrokerCardProps {
  broker: {
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
    regulations?: Array<{
      regulator: string;
      license_number?: string;
    }>;
    platforms?: string[];
    account_types?: string[];
    instruments_count?: number;
    pros?: string[];
    cons?: string[];
    promotion_text?: string;
    cta_text?: string;
    cta_url?: string;
    country_availability?: {
      available?: string[];
      restricted?: string[];
    };
  };
  showCountryBadge?: string; // Country code to show availability badge
  className?: string;
  priority?: number;
}

export default function BrokerCard({ 
  broker, 
  showCountryBadge, 
  className = '',
  priority = 1 
}: BrokerCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarOutlineIcon className="h-4 w-4 text-yellow-400" />
            <StarIcon 
              className="h-4 w-4 text-yellow-400 fill-current absolute top-0 left-0" 
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
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

  const isAvailableInCountry = (countryCode: string) => {
    if (!broker.country_availability) return null;
    
    if (broker.country_availability.available?.includes(countryCode)) {
      return true;
    }
    
    if (broker.country_availability.restricted?.includes(countryCode)) {
      return false;
    }
    
    return null; // Unknown
  };

  const countryAvailability = showCountryBadge ? isAvailableInCountry(showCountryBadge) : null;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {broker.logo_url ? (
              <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden p-1 flex items-center justify-center">
                <img
                  src={broker.logo_url}
                  alt={`${broker.name} logo`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {broker.name.charAt(0)}
                </span>
              </div>
            )}
            
            <div>
              <Link
                to={`/broker/${broker.slug}`}
                className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors"
              >
                {broker.name}
              </Link>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  {renderStars(broker.overall_rating)}
                </div>
                <span className="text-sm text-gray-600">
                  {broker.overall_rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Country Availability Badge */}
          {showCountryBadge && countryAvailability !== null && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              countryAvailability 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {countryAvailability ? (
                <>
                  <CheckIcon className="inline h-3 w-3 mr-1" />
                  Available
                </>
              ) : (
                <>
                  <XMarkIcon className="inline h-3 w-3 mr-1" />
                  Restricted
                </>
              )}
            </div>
          )}
        </div>

        {/* Promotion Banner */}
        {broker.promotion_text && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-2">
            <p className="text-sm text-blue-800 font-medium">
              🎉 {broker.promotion_text}
            </p>
          </div>
        )}
      </div>

      {/* Key Details */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {broker.min_deposit !== undefined && (
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Min Deposit
              </dt>
              <dd className="text-sm font-semibold text-gray-900">
                {broker.min_deposit === 0 
                  ? 'No minimum' 
                  : `${broker.min_deposit_currency || '$'}${broker.min_deposit.toLocaleString()}`
                }
              </dd>
            </div>
          )}

          {broker.spreads_from !== undefined && (
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Spreads From
              </dt>
              <dd className="text-sm font-semibold text-gray-900">
                {broker.spreads_from} pips
              </dd>
            </div>
          )}

          {broker.max_leverage !== undefined && (
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Max Leverage
              </dt>
              <dd className="text-sm font-semibold text-gray-900">
                {broker.max_leverage}:1
              </dd>
            </div>
          )}

          {broker.instruments_count !== undefined && (
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Instruments
              </dt>
              <dd className="text-sm font-semibold text-gray-900">
                {broker.instruments_count}+
              </dd>
            </div>
          )}
        </div>

        {/* Platforms */}
        {broker.platforms && broker.platforms.length > 0 && (
          <div className="mb-4">
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Platforms
            </dt>
            <div className="flex flex-wrap gap-1">
              {broker.platforms.slice(0, 3).map((platform) => (
                <span
                  key={platform}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {platform}
                </span>
              ))}
              {broker.platforms.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  +{broker.platforms.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Regulation */}
        {broker.regulations && broker.regulations.length > 0 && (
          <div className="mb-4">
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Regulation
            </dt>
            <div className="flex flex-wrap gap-1">
              {broker.regulations.slice(0, 2).map((reg) => (
                <span
                  key={reg.regulator}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  title={reg.license_number ? `License: ${reg.license_number}` : undefined}
                >
                  <CheckIcon className="h-3 w-3 mr-1" />
                  {reg.regulator}
                </span>
              ))}
              {broker.regulations.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  +{broker.regulations.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Pros/Cons */}
        {(broker.pros || broker.cons) && (
          <div className="mb-4 space-y-2">
            {broker.pros && broker.pros.length > 0 && (
              <div>
                <ul className="text-xs text-green-700 space-y-1">
                  {broker.pros.slice(0, 2).map((pro, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {broker.cons && broker.cons.length > 0 && (
              <div>
                <ul className="text-xs text-red-700 space-y-1">
                  {broker.cons.slice(0, 1).map((con, index) => (
                    <li key={index} className="flex items-start">
                      <XMarkIcon className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <Link
          to={`/broker/${broker.slug}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Read Review
        </Link>
        
        {broker.cta_url && (
          <a
            href={broker.cta_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {broker.cta_text || 'Visit Broker'}
          </a>
        )}
      </div>
    </div>
  );
}