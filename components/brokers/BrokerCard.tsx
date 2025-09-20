import React from 'react';
import { Link } from 'react-router-dom';
import { Broker } from '../../types';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { useComparison } from '../../hooks/useComparison';
import { Icons } from '../../constants';
import StarRating from '../ui/StarRating';

interface BrokerCardProps {
  broker: Broker;
}

const BrokerCard: React.FC<BrokerCardProps> = ({ broker }) => {
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

  return (
    <Card className="hover:border-primary-700 flex flex-col">
      <Link to={`/broker/${broker.id}`} className="flex-grow">
        <CardContent>
          <div className="flex justify-between items-start">
            <img src={broker.logoUrl} alt={`${broker.name} logo`} className="h-12 w-auto object-contain bg-white p-2 rounded-md" />
            <div className="flex flex-col items-end">
                <div className="text-3xl font-bold text-primary-400">{broker.score.toFixed(1)}</div>
                <StarRating score={broker.score} />
            </div>
          </div>
          <h3 className="text-xl font-bold mt-4 text-gray-100">{broker.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{broker.headquarters} &bull; Est. {broker.foundingYear}</p>
          
          <div className="mt-4 pt-3 border-t border-input/50 text-sm space-y-2">
            <div className="flex justify-between items-center text-gray-400">
              <span className="truncate pr-2">Regulators</span>
              <span className="font-semibold text-right text-gray-200 truncate">{broker.regulation.regulators.slice(0, 2).join(', ')}</span>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span>Max Leverage</span>
              <span className="font-semibold text-gray-200">{broker.tradingConditions.maxLeverage}</span>
            </div>
          </div>
        </CardContent>
      </Link>
      <div className="p-4 border-t border-input">
        <Button onClick={handleCompareClick} variant={inCompare ? 'secondary' : 'ghost'} size="sm" className="w-full">
            {inCompare ? <Icons.compareRemove className="h-4 w-4 mr-2" /> : <Icons.compare className="h-4 w-4 mr-2" />}
            {inCompare ? 'Remove from Compare' : 'Add to Compare'}
        </Button>
      </div>
    </Card>
  );
};

export default BrokerCard;