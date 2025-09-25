import { useContext } from 'react';
import { TradingJournalContext } from '../contexts/TradingJournalContext';
import { TradingJournalContextType } from '../types';

export const useTradingJournal = (): TradingJournalContextType => {
  const context = useContext(TradingJournalContext);
  if (!context) {
    throw new Error('useTradingJournal must be used within a TradingJournalProvider');
  }
  return context;
};