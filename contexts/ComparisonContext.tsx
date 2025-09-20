
import React, { createContext, useState, useEffect } from 'react';
import { ComparisonContextType } from '../types';

export const ComparisonContext = createContext<ComparisonContextType | null>(null);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparisonList, setComparisonList] = useState<string[]>(() => {
    const savedList = localStorage.getItem('comparisonList');
    return savedList ? JSON.parse(savedList) : [];
  });

  useEffect(() => {
    localStorage.setItem('comparisonList', JSON.stringify(comparisonList));
  }, [comparisonList]);

  const addBrokerToComparison = (brokerId: string) => {
    setComparisonList(prev => [...new Set([...prev, brokerId])]);
  };

  const removeBrokerFromComparison = (brokerId: string) => {
    setComparisonList(prev => prev.filter(id => id !== brokerId));
  };

  const isBrokerInComparison = (brokerId: string) => {
    return comparisonList.includes(brokerId);
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  return (
    <ComparisonContext.Provider value={{ comparisonList, addBrokerToComparison, removeBrokerFromComparison, isBrokerInComparison, clearComparison }}>
      {children}
    </ComparisonContext.Provider>
  );
};
