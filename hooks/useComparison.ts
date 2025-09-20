
import { useContext } from 'react';
import { ComparisonContext } from '../contexts/ComparisonContext';
import { ComparisonContextType } from '../types';

export const useComparison = (): ComparisonContextType => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
