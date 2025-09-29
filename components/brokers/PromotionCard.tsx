import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, Clock, Gift, ExternalLink, Star } from 'lucide-react';
import { Broker } from '../../types';
import StarRating from '../ui/StarRating';

interface PromotionCardProps {
  id: string;
  brokerId: string;
  brokerName: string;
  brokerLogo: string;
  brokerScore: number;
  title: string;
  description: string;
  amount: string;
  type: 'welcome-bonus' | 'deposit-bonus' | 'no-deposit-bonus' | 'cashback' | 'loyalty-program' | 'trading-competition';
  validUntil: string;
  minDeposit: number;
  terms: string;
  isExclusive: boolean;
  isPopular: boolean;
  isActive: boolean;
  regulation: string[];
  compact?: boolean;
}

const promotionTypes = {
  'welcome-bonus': { label: 'Welcome Bonus', color: 'bg-blue-100 text-blue-800' },
  'deposit-bonus': { label: 'Deposit Bonus', color: 'bg-green-100 text-green-800' },
  'no-deposit-bonus': { label: 'No Deposit Bonus', color: 'bg-purple-100 text-purple-800' },
  'cashback': { label: 'Cashback', color: 'bg-orange-100 text-orange-800' },
  'loyalty-program': { label: 'Loyalty Program', color: 'bg-indigo-100 text-indigo-800' },
  'trading-competition': { label: 'Trading Competition', color: 'bg-red-100 text-red-800' }
};

const PromotionCard: React.FC<PromotionCardProps> = ({
  id,
  brokerId,
  brokerName,
  brokerLogo,
  brokerScore,
  title,
  description,
  amount,
  type,
  validUntil,
  minDeposit,
  terms,
  isExclusive,
  isPopular,
  isActive,
  regulation,
  compact = false
}) => {
  const daysUntilExpiry = (validUntil: string) => {
    const today = new Date();
    const expiry = new Date(validUntil);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = daysUntilExpiry(validUntil);
  const isExpiringSoon = daysLeft > 0 && daysLeft <= 7;

  if (compact) {
    return (
      <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <img
              src={brokerLogo}
              alt={brokerName}
              className="w-10 h-10 rounded-lg object-contain flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-semibold text-sm text-primary-600">{brokerName}</h4>
                  <StarRating rating={brokerScore / 2} size="xs" />
                </div>
                <div className="flex flex-col gap-1">
                  {isExclusive && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      Exclusive
                    </Badge>
                  )}
                  {isExpiringSoon && (
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      Ends Soon
                    </Badge>
                  )}
                </div>
              </div>

              <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-1">
                {title}
              </h3>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Badge className={promotionTypes[type].color + ' text-xs'}>
                    {promotionTypes[type].label}
                  </Badge>
                  {daysLeft > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {daysLeft}d
                    </span>
                  )}
                </div>
                <span className="font-medium text-primary-600">{amount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={brokerLogo}
              alt={brokerName}
              className="w-12 h-12 rounded-lg object-contain"
            />
            <div>
              <CardTitle className="text-lg">{brokerName}</CardTitle>
              <div className="flex items-center gap-2">
                <StarRating rating={brokerScore / 2} size="sm" />
                <span className="text-sm text-muted-foreground">({brokerScore}/10)</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {isExclusive && (
              <Badge className="bg-yellow-100 text-yellow-800">
                Exclusive
              </Badge>
            )}
            {isPopular && (
              <Badge className="bg-green-100 text-green-800">
                Popular
              </Badge>
            )}
            {isExpiringSoon && (
              <Badge className="bg-red-100 text-red-800">
                Ends Soon
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className={promotionTypes[type].color}>
            {promotionTypes[type].label}
          </Badge>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Bonus Amount</div>
            <div className="text-lg font-bold text-primary-600">{amount}</div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-primary-600 line-clamp-2">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-3">
          {description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className={isExpiringSoon ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                {daysLeft > 0
                  ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`
                  : 'Expired'
                }
              </span>
            </div>
            <div className="flex items-center gap-1">
              {regulation.slice(0, 2).map(reg => (
                <Badge key={reg} variant="outline" className="text-xs">
                  {reg}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Min Deposit:</span>
              <span className="font-medium">
                ${minDeposit === 0 ? 'No minimum' : minDeposit}
              </span>
            </div>
            <div className="text-xs text-muted-foreground line-clamp-2">
              <strong>Terms:</strong> {terms}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Link to={`/broker/${brokerId}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              View Broker
            </Button>
          </Link>
          <Button className="flex-1" size="sm" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              Claim Bonus
            </a>
          </Button>
        </div>

        {!isActive && (
          <div className="bg-red-50 border border-red-200 rounded p-2 text-center">
            <span className="text-red-600 text-sm font-medium">This promotion has expired</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromotionCard;