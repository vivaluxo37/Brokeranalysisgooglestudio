import React from 'react';
import { Link } from 'react-router-dom';
import { Broker } from '../../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useComparison } from '../hooks/useComparison';
import Icon from './ui/Icon';
import StarRating from './ui/StarRating';
import Tooltip from './ui/Tooltip';
import ErrorBoundary from './ui/ErrorBoundary';

// Unified Broker interface that works with all data shapes
interface UnifiedBroker {
  id: string | number;
  name: string;
  slug?: string;
  logoUrl?: string;
  logo_url?: string; // Legacy support
  score?: number;
  overall_rating?: number; // Legacy support
  ratings?: {
    regulation?: number;
    overall?: number;
  };
  regulation?: {
    regulators?: string[];
  };
  security?: {
    regulatedBy?: Array<{
      regulator: string;
      license_number?: string;
    }>;
  };
  accessibility?: {
    minDeposit?: number;
  };
  accountTypes?: Array<{
    name?: string;
    minDeposit?: number;
  }>;
  tradingConditions?: {
    maxLeverage?: string | number;
    spreads?: {
      eurusd?: string;
    };
  };
  fees?: {
    trading?: {
      averageSpreads?: Array<{
        spread?: number;
      }>;
    };
  };
  technology?: {
    platforms?: string[];
  };
  platforms?: string[];
  tradableInstruments?: Record<string, any>;
  websiteUrl?: string;
  website?: string; // Legacy support
  description?: string;
  pros?: string[];
  cons?: string[];
  headquarters?: string;
  foundingYear?: number;
  socialTrading?: {
    popularityScore?: number;
  };
  coreInfo?: {
    brokerType?: string;
  };
  riskProfile?: {
    level?: 'Low' | 'Medium' | 'High' | 'Critical';
    score?: number;
  };
}

interface BrokerCardProps {
  broker: UnifiedBroker;
  variant?: 'compact' | 'detailed' | 'enhanced' | 'minimal';
  showRanking?: boolean;
  ranking?: number;
  priority?: number;
  showComparison?: boolean;
  showDetailsLink?: boolean;
  showVisitButton?: boolean;
  showRiskBadge?: boolean;
  categoryContext?: string;
  countryContext?: string;
  isRecommended?: boolean;
  onQuickView?: (broker: UnifiedBroker) => void;
  className?: string;
}

const RiskBadge: React.FC<{ broker: UnifiedBroker }> = ({ broker }) => {
  // Use provided risk profile or calculate based on regulation
  if (broker.riskProfile) {
    const { level, score } = broker.riskProfile;
    const colorClasses = {
      Low: 'text-green-500',
      Medium: 'text-yellow-500',
      High: 'text-orange-500',
      Critical: 'text-red-500',
    };

    return (
      <Tooltip content={`Risk Score: ${score}/100. Level: ${level}`}>
        <span className="flex items-center justify-center">
          <Icon name="shield" size="md" className={colorClasses[level]} />
        </span>
      </Tooltip>
    );
  }

  // Calculate risk based on regulation
  const regulators = broker.security?.regulatedBy?.map(r => r.regulator) ||
                   broker.regulation?.regulators || [];
  const topTierRegulators = ['FCA', 'ASIC', 'NFA', 'CFTC', 'FINMA', 'BaFin'];
  const hasTopTierRegulation = regulators.some(r => topTierRegulators.includes(r));

  const riskLevel = hasTopTierRegulation ? 'Low' : regulators.length > 0 ? 'Medium' : 'High';
  const colorClasses = {
    Low: 'text-green-500',
    Medium: 'text-yellow-500',
    High: 'text-red-500',
  };

  return (
    <Tooltip content={`Risk Level: ${riskLevel} - Regulated by ${regulators.join(', ') || 'Unknown'}`}>
      <span className="flex items-center justify-center">
        <Icon name="shield" size="md" className={colorClasses[riskLevel]} />
      </span>
    </Tooltip>
  );
};

const UnifiedBrokerCard: React.FC<BrokerCardProps> = ({
  broker,
  variant = 'detailed',
  showRanking = false,
  ranking,
  priority,
  showComparison = true,
  showDetailsLink = true,
  showVisitButton = true,
  showRiskBadge = false,
  categoryContext,
  countryContext,
  isRecommended = false,
  onQuickView,
  className = ''
}) => {
  const { addBrokerToComparison, removeBrokerFromComparison, isBrokerInComparison } = useComparison();
  const inCompare = isBrokerInComparison(String(broker.id));

  // Normalize broker data
  const normalizedBroker = {
    ...broker,
    id: String(broker.id),
    logoUrl: broker.logoUrl || broker.logo_url,
    score: broker.score || broker.overall_rating || broker.ratings?.overall || 0,
    websiteUrl: broker.websiteUrl || broker.website || '',
    minDeposit: broker.accessibility?.minDeposit ||
                 broker.accountTypes?.[0]?.minDeposit ||
                 broker.accountTypes?.[0]?.minDeposit || 0,
    regulators: broker.security?.regulatedBy?.map(r => r.regulator).slice(0, 3) ||
                broker.regulation?.regulators?.slice(0, 3) || [],
    maxLeverage: broker.tradingConditions?.maxLeverage || 'Variable',
    platforms: broker.technology?.platforms || broker.platforms || [],
    avgSpread: broker.fees?.trading?.averageSpreads?.[0]?.spread ||
               broker.tradingConditions?.spreads?.eurusd
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeBrokerFromComparison(normalizedBroker.id);
    } else {
      addBrokerToComparison(normalizedBroker.id);
    }
  };

  const handleVisitBroker = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (normalizedBroker.websiteUrl) {
      window.open(normalizedBroker.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(broker);
    }
  };

  // Variant-specific styling
  const getCardClasses = () => {
    const baseClasses = 'group relative transition-all duration-200';

    const recommendationClasses = isRecommended
      ? 'border-blue-600 ring-2 ring-blue-500/50 shadow-lg shadow-blue-900/40'
      : showRanking && ranking && ranking <= 3
      ? 'border-yellow-400 ring-2 ring-yellow-400/30'
      : 'hover:border-gray-300';

    const variantClasses = {
      compact: 'bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 p-4',
      detailed: 'bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 p-6',
      enhanced: 'bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 p-6',
      minimal: 'bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 p-3'
    };

    return `${baseClasses} ${variantClasses[variant]} ${recommendationClasses} ${className}`;
  };

  const formatMinDeposit = (amount: number): string => {
    if (amount === 0) return 'No minimum';
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
    return `$${amount}`;
  };

  const getPlatformText = () => {
    return normalizedBroker.platforms[0] || 'Web Platform';
  };

  const getSpreadText = () => {
    if (normalizedBroker.avgSpread) {
      return typeof normalizedBroker.avgSpread === 'number'
        ? `${normalizedBroker.avgSpread} pips`
        : `${normalizedBroker.avgSpread}`;
    }
    return 'Variable';
  };

  const getLeverageText = () => {
    return typeof normalizedBroker.maxLeverage === 'number'
      ? `${normalizedBroker.maxLeverage}:1`
      : normalizedBroker.maxLeverage || 'Variable';
  };

  const getAccountTypeText = () => {
    if (broker.accountTypes && broker.accountTypes.length > 0) {
      return broker.accountTypes[0].name || 'Standard Account';
    }
    if (broker.coreInfo?.brokerType) {
      return `${broker.coreInfo.brokerType} Account`;
    }
    return 'Standard Account';
  };

  const contextTag = categoryContext || countryContext;

  return (
    <ErrorBoundary>
      <Card className={getCardClasses()}>
        <div className="relative flex-grow">
          {/* Ranking Badge */}
          {showRanking && ranking && ranking > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                ranking === 1 ? 'bg-yellow-500' : ranking === 2 ? 'bg-gray-400' : ranking === 3 ? 'bg-orange-600' : 'bg-gray-600'
              }`}>
                {ranking}
              </div>
            </div>
          )}

          {/* Priority Trophy */}
          {showRanking && priority && priority <= 3 && variant !== 'minimal' && (
            <div className="absolute -top-2 -left-2 z-10">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                ${priority === 1 ? 'bg-yellow-500' : priority === 2 ? 'bg-gray-400' : 'bg-orange-500'}
              `}>
                🏆
              </div>
            </div>
          )}

          {/* Risk Badge */}
          {showRiskBadge && variant !== 'minimal' && (
            <div className="absolute top-3 right-3 z-10">
              <RiskBadge broker={broker} />
            </div>
          )}

          {/* Quick Actions */}
          {variant !== 'minimal' && (
            <div className="absolute top-16 right-3 z-10 flex flex-col space-y-2">
              {showComparison && (
                <Tooltip content={inCompare ? 'Remove from comparison' : 'Add to comparison'}>
                  <button
                    onClick={handleCompareClick}
                    className={`p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-gray-50 transition-colors ${
                      inCompare ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-gray-600'
                    }`}
                    aria-label="Toggle comparison"
                  >
                    <Icon name={inCompare ? 'check' : 'compare'} size="sm" />
                  </button>
                </Tooltip>
              )}

              {onQuickView && (
                <Tooltip content="Quick View">
                  <button
                    onClick={handleQuickView}
                    className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
                    aria-label="Quick View"
                  >
                    <Icon name="eye" size="sm" />
                  </button>
                </Tooltip>
              )}
            </div>
          )}

          <Link to={`/broker/${normalizedBroker.id}`} className="block h-full">
            <CardContent className={variant === 'minimal' ? 'p-0' : ''}>
              {/* Header */}
              <div className={`flex justify-between items-start ${variant === 'minimal' ? 'mb-2' : 'mb-4'}`}>
                <div className="flex items-center space-x-3">
                  {normalizedBroker.logoUrl && (
                    <img
                      src={normalizedBroker.logoUrl}
                      alt={`${normalizedBroker.name} logo`}
                      className={`object-contain bg-white rounded-md border border-gray-200 ${
                        variant === 'minimal' ? 'h-8 w-auto p-1' : 'h-12 w-auto p-2'
                      }`}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <h3 className={`font-semibold text-gray-900 ${
                      variant === 'minimal' ? 'text-sm' : variant === 'compact' ? 'text-base' : 'text-lg'
                    }`}>
                      {normalizedBroker.name}
                    </h3>
                    {contextTag && variant !== 'minimal' && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {contextTag}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex flex-col items-end">
                  {normalizedBroker.score > 0 ? (
                    <>
                      <div className="flex items-center space-x-1">
                        <StarRating rating={normalizedBroker.score} size={variant === 'minimal' ? 'xs' : 'sm'} readonly />
                        <span className={`font-medium text-gray-900 ${
                          variant === 'minimal' ? 'text-xs' : 'text-sm'
                        }`}>
                          {normalizedBroker.score.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">/10</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">Not Rated</span>
                  )}
                </div>
              </div>

              {/* Description - only for enhanced variant */}
              {variant === 'enhanced' && broker.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {broker.description}
                </p>
              )}

              {/* Key Features Grid - for detailed and enhanced variants */}
              {(variant === 'detailed' || variant === 'enhanced') && (
                <div className={`grid gap-4 mb-4 ${
                  variant === 'enhanced' ? 'grid-cols-2' : 'grid-cols-1'
                }`}>
                  {variant === 'enhanced' && (
                    <>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Min Deposit</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {formatMinDeposit(normalizedBroker.minDeposit)}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Max Leverage</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {getLeverageText()}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Spreads From</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {getSpreadText()}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Account Type</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {getAccountTypeText()}
                        </div>
                      </div>
                    </>
                  )}

                  {variant === 'detailed' && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Min. Deposit:</span>
                        <span className="font-medium text-gray-900">
                          {formatMinDeposit(normalizedBroker.minDeposit)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Regulation:</span>
                        <span className="font-medium text-gray-900">
                          {normalizedBroker.regulators.slice(0, 2).join(', ') || 'International'}
                        </span>
                      </div>

                      {normalizedBroker.maxLeverage && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Max Leverage:</span>
                          <span className="font-medium text-gray-900">
                            {getLeverageText()}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Additional Info - compact variant */}
              {variant === 'compact' && (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Min. Deposit:</span>
                    <span className="font-medium text-gray-900">
                      {formatMinDeposit(normalizedBroker.minDeposit)}
                    </span>
                  </div>

                  {normalizedBroker.regulators.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Icon name="shieldCheck" size="sm" className="text-green-500" />
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-800">
                        {normalizedBroker.regulators[0]}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Pros/Cons Summary - only enhanced variant */}
              {variant === 'enhanced' && (broker.pros || broker.cons) && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    {broker.pros && broker.pros.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-green-600 mb-1">Pros</div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {broker.pros.slice(0, 2).map((pro, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-1">•</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {broker.cons && broker.cons.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-red-600 mb-1">Cons</div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {broker.cons.slice(0, 2).map((con, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-red-500 mr-1">•</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {variant !== 'minimal' && (
                <div className={`flex space-x-3 ${variant === 'compact' ? 'space-x-2' : ''}`}>
                  {showDetailsLink && (
                    <Button
                      variant={variant === 'compact' ? 'outline' : 'outline'}
                      size={variant === 'compact' ? 'sm' : 'sm'}
                      className="flex-1"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      {variant === 'compact' ? 'Details' : 'Read Review'}
                    </Button>
                  )}

                  {showVisitButton && normalizedBroker.websiteUrl && (
                    <Button
                      size={variant === 'compact' ? 'sm' : 'sm'}
                      className="flex-1"
                      onClick={handleVisitBroker}
                    >
                      {variant === 'compact' ? 'Visit' : 'Visit Broker'}
                    </Button>
                  )}

                  {!showVisitButton && !normalizedBroker.websiteUrl && (
                    <Button
                      size={variant === 'compact' ? 'sm' : 'sm'}
                      className="flex-1"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      Learn More
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Link>
        </div>
      </Card>
    </ErrorBoundary>
  );
};

export default UnifiedBrokerCard;