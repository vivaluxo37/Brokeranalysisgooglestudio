import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useComparison } from '../hooks/useComparison';
import Icon from './ui/Icon';
import StarRating from './ui/StarRating';
import Tooltip from './ui/Tooltip';
import ErrorBoundary from './ui/ErrorBoundary';
import { Broker } from '../types';

interface EnhancedBrokerCardProps {
  broker: Broker;
  showRanking?: boolean;
  ranking?: number;
  categoryContext?: string;
  countryContext?: string;
  isRecommended?: boolean;
}

const RiskBadge: React.FC<{ broker: Broker }> = ({ broker }) => {
  // Simple risk assessment based on regulation
  const regulators = broker.security?.regulatedBy?.map(r => r.regulator) || [];
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

const EnhancedBrokerCard: React.FC<EnhancedBrokerCardProps> = ({
  broker,
  showRanking = false,
  ranking = 0,
  categoryContext,
  countryContext,
  isRecommended = false
}) => {
  const { addBrokerToComparison, removeBrokerFromComparison, isBrokerInComparison } = useComparison();
  const inCompare = isBrokerInComparison(broker.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeBrokerFromComparison(broker.id);
    } else {
      addBrokerToComparison(broker.id);
    }
  };

  const handleVisitBroker = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (broker.websiteUrl) {
      window.open(broker.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getRegulationText = () => {
    const regulators = broker.security?.regulatedBy?.slice(0, 3).map(r => r.regulator) || [];
    return regulators.length > 0 ? regulators.join(', ') : broker.regulation?.regulators?.join(', ') || 'International';
  };

  const getPlatformText = () => {
    return broker.technology?.platforms?.[0] || broker.platforms?.[0] || 'Web Platform';
  };

  const getSpreadText = () => {
    // Try new structure first, then fallback to legacy
    const avgSpread = broker.fees?.trading?.averageSpreads?.[0]?.spread;
    if (avgSpread) {
      return `${avgSpread}`;
    }
    const legacySpread = broker.tradingConditions?.spreads?.eurusd;
    if (legacySpread) {
      return `${legacySpread} pips`;
    }
    return 'Variable';
  };

  const getLeverageText = () => {
    return broker.tradingConditions?.maxLeverage || 'Variable';
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

  const recommendationClasses = isRecommended
    ? 'border-blue-600 ring-2 ring-blue-500/50 shadow-lg shadow-blue-900/40'
    : showRanking && ranking <= 3
    ? 'border-yellow-400 ring-2 ring-yellow-400/30'
    : 'hover:border-gray-300';

  const contextTag = categoryContext || countryContext;

  return (
    <ErrorBoundary>
      <Card className={`flex flex-col h-full transition-all duration-200 ${recommendationClasses}`}>
        <div className="relative flex-grow">
          {/* Ranking Badge */}
          {showRanking && ranking > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                ranking === 1 ? 'bg-yellow-500' : ranking === 2 ? 'bg-gray-400' : ranking === 3 ? 'bg-orange-600' : 'bg-gray-600'
              }`}>
                {ranking}
              </div>
            </div>
          )}

          {/* Risk Badge */}
          <div className="absolute top-3 right-3 z-10">
            <RiskBadge broker={broker} />
          </div>

          {/* Quick Actions */}
          <div className="absolute top-16 right-3 z-10 flex flex-col space-y-2">
            <Tooltip content="Add to Compare">
              <button
                onClick={handleCompareClick}
                className={`p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-gray-50 transition-colors ${
                  inCompare ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-gray-600'
                }`}
                aria-label="Add to Compare"
              >
                <Icon name={inCompare ? 'check' : 'plus'} size="sm" />
              </button>
            </Tooltip>
          </div>

          <Link to={`/broker/${broker.id}`} className="block h-full">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  {broker.logoUrl && (
                    <img
                      src={broker.logoUrl}
                      alt={`${broker.name} logo`}
                      className="h-12 w-auto object-contain bg-white p-2 rounded-md border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{broker.name}</h3>
                    {contextTag && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {contextTag}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex flex-col items-end">
                  {broker.score ? (
                    <>
                      <div className="flex items-center space-x-1">
                        <StarRating rating={broker.score} size="sm" readonly />
                        <span className="text-sm font-medium text-gray-900">{broker.score.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-gray-500">/10</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">Not Rated</span>
                  )}
                </div>
              </div>

              {/* Description */}
              {broker.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {broker.description}
                </p>
              )}

              {/* Key Features Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Min Deposit</div>
                  <div className="text-sm font-semibold text-gray-900">
                    ${broker.accessibility?.minDeposit || 0}
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
              </div>

              {/* Additional Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Regulation:</span>
                  <span className="text-gray-900 font-medium">{getRegulationText()}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Platform:</span>
                  <span className="text-gray-900 font-medium">{getPlatformText()}</span>
                </div>

                {broker.tradableInstruments && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Instruments:</span>
                    <span className="text-gray-900 font-medium">
                      {Object.values(broker.tradableInstruments).reduce((sum, val) => sum + (val?.total || 0), 0)}+
                    </span>
                  </div>
                )}
              </div>

              {/* Pros/Cons Summary */}
              {(broker.pros || broker.cons) && (
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
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  Read Review
                </Button>

                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleVisitBroker}
                >
                  Visit Broker
                </Button>
              </div>
            </CardContent>
          </Link>
        </div>
      </Card>
    </ErrorBoundary>
  );
};

export default EnhancedBrokerCard;