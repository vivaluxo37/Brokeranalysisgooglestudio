import { useContext } from 'react';
import { ReviewsContext } from '../contexts/ReviewsContext';
import { ReviewsContextType } from '../types';

export const useReviews = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};