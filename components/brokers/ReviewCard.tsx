
import React from 'react';
import { Review } from '../../types';
import Card, { CardContent } from '../ui/Card';
import StarRating from '../ui/StarRating';
import { Icons } from '../../constants';
import Badge from '../ui/Badge';

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
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-input mr-3">
                        <Icons.user className="h-5 w-5 text-foreground/60" />
                    </span>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-card-foreground">{review.userName}</p>
                            {review.verified && (
                                <Badge variant="success" Icon={Icons.verified}>
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
        <p className="text-card-foreground/90 mt-4 pl-11">{review.comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;