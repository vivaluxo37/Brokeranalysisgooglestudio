
import React, { createContext, useState, useEffect } from 'react';
import { ComparisonContextType } from '../types';

export const ComparisonContext = createContext<ComparisonContextType | null>(null);

// Validation utilities
const isValidBrokerId = (id: unknown): id is string => {
  return typeof id === 'string' && id.trim().length > 0 && id.trim().length <= 100;
};

const sanitizeComparisonList = (list: unknown): string[] => {
  if (!Array.isArray(list)) {
    return [];
  }

  return list
    .filter(item => isValidBrokerId(item))
    .map(item => item.trim())
    .filter((item, index, arr) => arr.indexOf(item) === index) // Remove duplicates
    .slice(0, 10); // Limit to 10 items for performance
};

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparisonList, setComparisonList] = useState<string[]>(() => {
    try {
      // Check if we're on the client side
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedList = window.localStorage.getItem('comparisonList');
        if (savedList) {
          const parsed = JSON.parse(savedList);
          return sanitizeComparisonList(parsed);
        }
      }
    } catch (error) {
      console.warn('Failed to load comparison list from localStorage:', error);
    }
    // Default to empty array for server-side rendering or error cases
    return [];
  });

  useEffect(() => {
    try {
      // Only run on client side
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('comparisonList', JSON.stringify(comparisonList));
      }
    } catch (error) {
      console.warn('Failed to save comparison list to localStorage:', error);
    }
  }, [comparisonList]);

  const addBrokerToComparison = (brokerId: unknown) => {
    if (!isValidBrokerId(brokerId)) {
      console.warn('Invalid broker ID provided to addBrokerToComparison:', brokerId);
      return;
    }

    const trimmedId = brokerId.trim();

    setComparisonList(prev => {
      // Check if already exists to avoid unnecessary updates
      if (prev.includes(trimmedId)) {
        return prev;
      }

      // Limit to 10 items
      const newList = [...prev, trimmedId];
      if (newList.length > 10) {
        console.warn('Comparison list limit reached (10 items)');
        return newList.slice(-10);
      }

      return newList;
    });
  };

  const removeBrokerFromComparison = (brokerId: unknown) => {
    if (!isValidBrokerId(brokerId)) {
      console.warn('Invalid broker ID provided to removeBrokerFromComparison:', brokerId);
      return;
    }

    const trimmedId = brokerId.trim();
    setComparisonList(prev => prev.filter(id => id !== trimmedId));
  };

  const isBrokerInComparison = (brokerId: unknown): boolean => {
    if (!isValidBrokerId(brokerId)) {
      return false;
    }
    return comparisonList.includes(brokerId.trim());
  };

  const clearComparison = () => {
    try {
      setComparisonList([]);
    } catch (error) {
      console.error('Failed to clear comparison list:', error);
    }
  };

  return (
    <ComparisonContext.Provider value={{ comparisonList, addBrokerToComparison, removeBrokerFromComparison, isBrokerInComparison, clearComparison }}>
      {children}
    </ComparisonContext.Provider>
  );
};

// Export as default for easier importing
export default ComparisonProvider;
