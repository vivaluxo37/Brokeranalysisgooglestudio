import React from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { Broker } from '../../types';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { useComparison } from '../../hooks/useComparison';
import { Icons } from '../../constants';
import StarRating from '../ui/StarRating';
import Tooltip from '../ui/Tooltip';

interface BrokerCardProps {
  broker: Broker;
  isRecommended?: boolean;
}

const BrokerCard: React.FC<BrokerCardProps> = ({ broker, isRecommended = false }) => {
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

  const recommendationClasses = isRecommended 
    ? 'border-primary-600 ring-2 ring-primary-500/50 shadow-lg shadow-primary-900/40' 
    : 'hover:border-primary-700';

  return (
    <Card className={`flex flex-col h-full ${recommendationClasses}`}>
      <div className="relative flex-grow">
        <ReactRouterDOM.Link to={`/broker/${broker.id}`} className="block h-full">
          <CardContent>
            <div className="flex justify-between items-start">
              <img src={broker.logoUrl} alt={`${broker.name} logo`} className="h-12 w-auto object-contain bg-white p-2 rounded-md" />
              <Tooltip content="Overall score based on regulation, costs, platforms, and support.">
                <div className="flex flex-col items-end">
                    <div className="text-3xl font-bold text-primary-400">{broker.score.toFixed(1)}</div>
                    <StarRating score={broker.score} />
                </div>
              </Tooltip>
            </div>
            <h3 className="text-xl font-bold mt-4 text-card-foreground">{broker.name}</h3>
            <p className="text-sm text-card-foreground/70 mt-1">{broker.headquarters} &bull; Est. {broker.foundingYear}</p>
            
            <div className="mt-4 pt-3 border-t border-input/50 text-sm space-y-2">
              <div className="flex justify-between items-center text-card-foreground/70">
                <span className="truncate pr-2">Regulators</span>
                <span className="font-semibold text-right text-card-foreground truncate">{broker.regulation.regulators.slice(0, 2).join(', ')}</span>
              </div>
              <div className="flex justify-between items-center text-card-foreground/70">
                <span>Max Leverage</span>
                <span className="font-semibold text-card-foreground">{broker.tradingConditions.maxLeverage}</span>
              </div>
               {broker.socialTrading && (
                <div className="flex justify-between items-center text-card-foreground/70">
                    <Tooltip content="A score based on community size and copy trading activity.">
                    <span className="truncate pr-2 flex items-center gap-1"><Icons.users className="h-4 w-4"/> Popularity</span>
                    </Tooltip>
                    <span className="font-semibold text-card-foreground">{broker.socialTrading.popularityScore}/100</span>
                </div>
                )}
            </div>
          </CardContent>
        </ReactRouterDOM.Link>
      </div>
      <div className="p-4 border-t border-input flex items-center gap-2">
        <a href={broker.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="primary" size="sm" className="w-full">
            Visit Broker
          </Button>
        </a>
        <Tooltip content={inCompare ? 'Remove from comparison list' : 'Add to comparison list'} className="flex-1">
          <Button onClick={handleCompareClick} variant="secondary" size="sm" className="w-full">
              {inCompare ? <Icons.compareRemove className="h-4 w-4 mr-2" /> : <Icons.compare className="h-4 w-4 mr-2" />}
              {inCompare ? 'In Compare' : 'Compare'}
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
};

export default BrokerCard;