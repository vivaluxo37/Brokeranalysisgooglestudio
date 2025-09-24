import React from 'react';
import { Link } from 'react-router-dom';
import { Broker } from '../../types';
import Card from '../ui/Card';
import StarRating from '../ui/StarRating';
import Button from '../ui/Button';

interface MiniBrokerCardProps {
  broker: Broker;
}

const MiniBrokerCard: React.FC<MiniBrokerCardProps> = ({ broker }) => {
  return (
    <Card className="hover:border-primary-600 transition-colors">
      <div className="p-3">
        <div className="flex items-center gap-3">
          <img src={broker.logoUrl} alt={`${broker.name} logo`} className="h-10 w-10 object-contain bg-white p-1 rounded-md" />
          <div className="flex-grow">
            <h4 className="font-bold text-card-foreground">{broker.name}</h4>
            <StarRating score={broker.score} size="sm" />
          </div>
          <Link to={`/broker/${broker.id}`}>
            <Button variant="secondary" size="sm">View</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default MiniBrokerCard;