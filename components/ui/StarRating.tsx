import React from 'react';
import { Icons } from '../../constants';

interface StarRatingProps {
  score: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({ score, className = '', size = 'md' }) => {
  const stars = [];
  // Convert score from 1-10 to 1-5, rounded to nearest 0.5
  const rating = Math.round(score) / 2;

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  for (let i = 1; i <= 5; i++) {
    const className = `${sizeClasses[size]} text-yellow-400`;
    if (i <= rating) {
      stars.push(<Icons.starFull key={i} className={className} />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<Icons.starHalf key={i} className={className} />);
    } else {
      stars.push(<Icons.starEmpty key={i} className={className} />);
    }
  }

  return <div className={`flex items-center ${className}`}>{stars}</div>;
};

export default StarRating;
