import { useContext } from 'react';
import { AlertsContext } from '../contexts/AlertsContext';
import { AlertsContextType } from '../types';

export const useAlerts = (): AlertsContextType => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
};