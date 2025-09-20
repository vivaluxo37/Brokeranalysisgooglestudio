import React, { useState } from 'react';
import { Icons } from '../../constants';

interface StarRatingInputProps {
  rating: number;
  setRating: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ rating, setRating, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFilled = (hoverRating || rating) >= starIndex;
        const starProps = {
            key: starIndex,
            className: `cursor-pointer transition-colors ${sizeClasses[size]} ${isFilled ? 'text-yellow-400' : 'text-foreground/50 hover:text-yellow-300'}`
        };
        return (
            <button
                type="button"
                key={starIndex}
                onMouseEnter={() => setHoverRating(starIndex)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(starIndex)}
                aria-label={`Rate ${starIndex} stars`}
            >
                {isFilled ? <Icons.starFull {...starProps} /> : <Icons.starEmpty {...starProps} />}
            </button>
        );
      })}
    </div>
  );
};

export default StarRatingInput;