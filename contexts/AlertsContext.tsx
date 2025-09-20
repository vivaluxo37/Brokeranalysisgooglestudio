import React, { createContext, useState, useEffect, useMemo } from 'react';
import { Alert, AlertsContextType } from '../types';
import { mockAlerts } from '../data/alerts';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';

export const AlertsContext = createContext<AlertsContextType | null>(null);

export const AlertsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { favoritesList } = useFavorites();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const storageKey = useMemo(() => user ? `alerts_${user.id}` : null, [user]);

  // Load from localStorage or seed with mock data
  useEffect(() => {
    if (!storageKey) {
        setAlerts([]); // Clear alerts if user logs out
        return;
    }
    try {
      const savedAlerts = localStorage.getItem(storageKey);
      if (savedAlerts) {
        setAlerts(JSON.parse(savedAlerts));
      } else {
        // First time user sees alerts, seed them and mark some as read.
        const seededAlerts = mockAlerts.map((alert, index) => ({
            ...alert,
            read: index > 2 // Mark older ones as read
        }));
        setAlerts(seededAlerts);
        localStorage.setItem(storageKey, JSON.stringify(seededAlerts));
      }
    } catch (e) {
      console.error("Failed to load alerts from localStorage", e);
      setAlerts(mockAlerts);
    }
  }, [storageKey]);

  // Persist to localStorage
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(alerts));
    }
  }, [alerts, storageKey]);

  const getAlertsForFavorites = (favoriteBrokerIds: string[]): Alert[] => {
    return alerts
      .filter(alert => favoriteBrokerIds.includes(alert.brokerId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const markAllAsRead = () => {
    setAlerts(prev =>
      prev.map(alert =>
        favoritesList.includes(alert.brokerId) ? { ...alert, read: true } : alert
      )
    );
  };

  const unreadCount = useMemo(() => {
    return alerts.filter(alert => !alert.read && favoritesList.includes(alert.brokerId)).length;
  }, [alerts, favoritesList]);

  return (
    <AlertsContext.Provider value={{ alerts, unreadCount, markAllAsRead, getAlertsForFavorites }}>
      {children}
    </AlertsContext.Provider>
  );
};