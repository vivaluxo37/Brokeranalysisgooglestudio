import { useContext } from 'react';
// FIX: The ReviewsContextType was imported from the wrong file. It should be imported from `types.ts` where it is defined.
import { ReviewsContext } from '../contexts/ReviewsContext';
import { ReviewsContextType } from '../types';

export const useReviews = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};