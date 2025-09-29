import React from 'react';
import { Icons } from '../../constants';

interface StarRatingProps {
  score?: number;
  rating?: number;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({ score, rating, className = '', size = 'md' }) => {
  const stars = [];
  // Use rating directly if provided, otherwise convert score from 1-10 to 1-5
  const starRating = rating ?? (score ? Math.round(score) / 2 : 0);

  const sizeClasses = {
    xs: 'h-2 w-2',
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  for (let i = 1; i <= 5; i++) {
    const starClassName = `${sizeClasses[size]} text-yellow-400`;
    if (i <= starRating) {
      stars.push(<Icons.starFull key={i} className={starClassName} />);
    } else if (i === Math.ceil(starRating) && !Number.isInteger(starRating)) {
      stars.push(<Icons.starHalf key={i} className={starClassName} />);
    } else {
      stars.push(<Icons.starEmpty key={i} className={starClassName} />);
    }
  }

  return <div className={`flex items-center ${className}`}>{stars}</div>;
};

export default StarRating;
