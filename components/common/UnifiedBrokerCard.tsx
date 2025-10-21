import React from 'react'

import {
  StarIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'

import { trackAffiliateLinkClick } from '../../lib/conversionTracking'
import { BrokerLogo } from '../ui/LazyImage'

interface UnifiedBrokerCardProps {
  broker: any; // Accepts both Broker type and simplified broker data
  showCountryBadge?: string;
  onQuickView?: (broker: any) => void;
  variant?: 'compact' | 'detailed' | 'comparison';
  className?: string;
  priority?: number;
}

export const UnifiedBrokerCard: React.FC<UnifiedBrokerCardProps> = ({
  broker,
  showCountryBadge,
  onQuickView,
  variant = 'compact',
  className = '',
  priority,
}) => {
  // Normalize broker data from different sources
  const normalizedBroker = {
    id: broker.id || broker.slug,
    name: broker.name,
    slug: broker.slug || broker.id,
    logoUrl: broker.logo_url || broker.logoUrl || `/images/brokers/${broker.slug || broker.id}.png`,
    websiteUrl: broker.affiliateUrl || broker.affiliate_link || broker.affiliate_url || broker.website_url || broker.websiteUrl || broker.cta_url,
    rating: broker.overall_rating || broker.score || 0,
    minDeposit: broker.min_deposit ?? broker.minimum_deposit ?? broker.accessibility?.minDeposit ?? 0,
    currency: broker.min_deposit_currency || broker.currency || '$',
    maxLeverage: broker.max_leverage || parseInt(broker.tradingConditions?.maxLeverage?.replace(/[^0-9]/g, '') || '0'),
    spreads: broker.spreads_from ?? parseFloat(String(broker.tradingConditions?.spreads?.eurusd || '0').replace(/[^0-9.]/g, '')),
    commission: broker.commission || broker.fees?.trading?.commissionStructure || 'Varies',
    regulators: extractRegulators(broker),
    platforms: broker.platforms || broker.technology?.platforms || [],
    pros: broker.pros || [],
    cons: broker.cons || [],
    headquarters: broker.headquarters,
    foundedYear: broker.founded_year || broker.foundingYear,
    instrumentsTotal: broker.instruments_total || broker.instruments_count ||
      ((broker.tradableInstruments?.forexPairs || 0) +
       (broker.tradableInstruments?.stocks || 0) +
       (broker.tradableInstruments?.commodities || 0) +
       (broker.tradableInstruments?.indices || 0) +
       (broker.tradableInstruments?.cryptocurrencies || 0)),
    promotionText: broker.promotion_text || broker.promotionText,
  }

  function extractRegulators(broker: any): string[] {
    const regulators: string[] = []

    // From regulations array
    if (broker.regulations && Array.isArray(broker.regulations)) {
      broker.regulations.forEach((reg: any) => {
        const regulator = typeof reg === 'string' ? reg : reg.regulator
        if (regulator) {regulators.push(regulator)}
      })
    }

    // From regulation.regulators
    if (broker.regulation?.regulators && Array.isArray(broker.regulation.regulators)) {
      broker.regulation.regulators.forEach((reg: string) => {
        if (reg && !regulators.includes(reg)) {regulators.push(reg)}
      })
    }

    // From security.regulatedBy
    if (broker.security?.regulatedBy && Array.isArray(broker.security.regulatedBy)) {
      broker.security.regulatedBy.forEach((entry: any) => {
        if (entry.regulator && !regulators.includes(entry.regulator)) {
          regulators.push(entry.regulator)
        }
      })
    }

    return regulators
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative inline-block">
            <StarIcon className="h-4 w-4 text-gray-300" />
            <StarSolidIcon
              className="h-4 w-4 text-yellow-400 absolute top-0 left-0"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          </div>,
        )
      } else {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-300" />)
      }
    }
    return stars
  }

  const isAvailableInCountry = (countryCode: string): boolean | null => {
    if (!broker.country_availability) {return null}

    if (broker.country_availability.available?.includes(countryCode)) {
      return true
    }

    if (broker.country_availability.restricted?.includes(countryCode)) {
      return false
    }

    return null
  }

  const countryAvailability = showCountryBadge ? isAvailableInCountry(showCountryBadge) : null

  // Compact variant - default for listing pages
  if (variant === 'compact') {
    return (
      <div
        className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 relative ${className}`}
        data-testid="broker-card"
      >
        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onQuickView(normalizedBroker)
            }}
            className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            aria-label="Quick view"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}

        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <BrokerLogo
                src={normalizedBroker.logoUrl}
                name={normalizedBroker.name}
                size="md"
                className="flex-shrink-0"
                priority={priority && priority <= 6} // Prioritize first 6 broker logos
              />

              {/* Name and Rating */}
              <div className="min-w-0 flex-1">
                <Link
                  to={`/brokers/${normalizedBroker.slug}`}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors block truncate"
                >
                  {normalizedBroker.name}
                </Link>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center">{renderStars(normalizedBroker.rating)}</div>
                  <span className="text-sm text-gray-600">
                    {normalizedBroker.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Country Badge */}
            {showCountryBadge && countryAvailability !== null && (
              <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
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
          {normalizedBroker.promotionText && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-2">
              <p className="text-sm text-blue-800 font-medium">
                🎉 {normalizedBroker.promotionText}
              </p>
            </div>
          )}
        </div>

        {/* Key Info */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            {normalizedBroker.minDeposit !== undefined && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Min Deposit
                </dt>
                <dd className="text-sm font-semibold text-gray-900 mt-1">
                  {normalizedBroker.minDeposit === 0
                    ? 'No minimum'
                    : `${normalizedBroker.currency}${normalizedBroker.minDeposit.toLocaleString()}`}
                </dd>
              </div>
            )}

            {normalizedBroker.spreads !== undefined && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Spreads From
                </dt>
                <dd className="text-sm font-semibold text-gray-900 mt-1">
                  {normalizedBroker.spreads.toFixed(1)} pips
                </dd>
              </div>
            )}

            {normalizedBroker.maxLeverage > 0 && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Max Leverage
                </dt>
                <dd className="text-sm font-semibold text-gray-900 mt-1">
                  1:{normalizedBroker.maxLeverage}
                </dd>
              </div>
            )}

            {normalizedBroker.instrumentsTotal > 0 && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Instruments
                </dt>
                <dd className="text-sm font-semibold text-gray-900 mt-1">
                  {normalizedBroker.instrumentsTotal}+
                </dd>
              </div>
            )}
          </div>

          {/* Platforms */}
          {normalizedBroker.platforms.length > 0 && (
            <div className="mb-3">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Platforms
              </dt>
              <div className="flex flex-wrap gap-1">
                {normalizedBroker.platforms.slice(0, 3).map((platform: string) => (
                  <span
                    key={platform}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {platform}
                  </span>
                ))}
                {normalizedBroker.platforms.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{normalizedBroker.platforms.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Regulation */}
          {normalizedBroker.regulators.length > 0 && (
            <div className="mb-3">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Regulation
              </dt>
              <div className="flex flex-wrap gap-1">
                {normalizedBroker.regulators.slice(0, 2).map((regulator: string) => (
                  <span
                    key={regulator}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                    {regulator}
                  </span>
                ))}
                {normalizedBroker.regulators.length > 2 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    +{normalizedBroker.regulators.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Pros/Cons Preview */}
          {(normalizedBroker.pros.length > 0 || normalizedBroker.cons.length > 0) && (
            <div className="space-y-1">
              {normalizedBroker.pros.length > 0 && normalizedBroker.pros.slice(0, 2).map((pro: string, index: number) => (
                <div key={index} className="flex items-start">
                  <CheckIcon className="h-3 w-3 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-green-700 line-clamp-1">{pro}</span>
                </div>
              ))}
              {normalizedBroker.cons.length > 0 && normalizedBroker.cons.slice(0, 1).map((con: string, index: number) => (
                <div key={index} className="flex items-start">
                  <XMarkIcon className="h-3 w-3 text-red-600 mr-1 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-red-700 line-clamp-1">{con}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <Link
            to={`/brokers/${normalizedBroker.slug}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Read Review →
          </Link>

          {normalizedBroker.websiteUrl && (
            <button
              type="button"
              onClick={() => {
                trackAffiliateLinkClick({
                  affiliateId: normalizedBroker.id,
                  brokerId: normalizedBroker.id,
                  brokerName: normalizedBroker.name,
                  linkUrl: normalizedBroker.websiteUrl,
                  placement: 'unified_broker_card',
                })
                window.open(normalizedBroker.websiteUrl, '_blank', 'noopener,noreferrer')
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Visit Broker
            </button>
          )}
        </div>
      </div>
    )
  }

  // Detailed variant for comparison pages
  if (variant === 'detailed') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-lg ${className}`}>
        {/* Implementation for detailed variant */}
        <div className="p-6">
          <h3 className="text-xl font-bold">{normalizedBroker.name}</h3>
          {/* Add more detailed information here */}
        </div>
      </div>
    )
  }

  // Comparison variant for side-by-side comparisons
  if (variant === 'comparison') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
        {/* Implementation for comparison variant */}
        <div className="p-4">
          <h4 className="font-semibold">{normalizedBroker.name}</h4>
          {/* Add comparison-specific layout here */}
        </div>
      </div>
    )
  }

  return null
}

export default UnifiedBrokerCard
