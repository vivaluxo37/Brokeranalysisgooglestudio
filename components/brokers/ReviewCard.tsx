
import React from 'react';
import { Review } from '../../types';
import { Card, CardContent } from '../ui/card';
import StarRating from '../ui/StarRating';
import { Icons } from '../../constants';
import { Badge } from '../ui/badge';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formattedDate = new Date(review.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="bg-card/70 animate-fade-in">
      <CardContent>
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center mb-2">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-input ltr:mr-3 rtl:ml-3">
                        <Icons.user className="h-5 w-5 text-foreground/60" />
                    </span>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-card-foreground">{review.userName}</p>
                            {review.verified && (
                                <Badge variant="secondary">
                                    <Icons.verified className="h-3.5 w-3.5 mr-1" />
                                    Verified Trader
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-card-foreground/60">{formattedDate}</p>
                    </div>
                </div>
            </div>
            <StarRating score={review.rating * 2} />
        </div>
        <p className="text-card-foreground/90 mt-4 ltr:pl-11 rtl:pr-11">{review.comment}</p>
        {review.withdrawalExperience && (
            <div className="mt-3 pt-3 ltr:pl-11 rtl:pr-11 border-t border-input/50 flex items-center gap-2 text-xs text-card-foreground/70">
                <Icons.clock className="h-4 w-4" />
                <span>Withdrawal took <strong>{review.withdrawalExperience.days} day{review.withdrawalExperience.days !== 1 ? 's' : ''}</strong> via <strong>{review.withdrawalExperience.method}</strong></span>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
