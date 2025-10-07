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
      const savedAlerts = typeof window !== 'undefined' && window.localStorage
        ? window.localStorage.getItem(storageKey)
        : null;
      if (savedAlerts) {
        const parsed = JSON.parse(savedAlerts);
        setAlerts(sanitizeAlerts(parsed));
      } else {
        // First time user sees alerts, seed them and mark some as read.
        const seededAlerts = sanitizeAlerts(mockAlerts).map((alert, index) => ({
            ...alert,
            read: index > 2 // Mark older ones as read
        }));
        setAlerts(seededAlerts);
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(storageKey, JSON.stringify(seededAlerts));
        }
      }
    } catch (e) {
      console.error("Failed to load alerts from localStorage", e);
      setAlerts(sanitizeAlerts(mockAlerts));
    }
  }, [storageKey]);

  // Persist to localStorage
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(storageKey, JSON.stringify(alerts));
    }
  }, [alerts, storageKey]);

  // Validation utilities
  const isValidBrokerId = (id: unknown): id is string => {
    return typeof id === 'string' && id.trim().length > 0 && id.trim().length <= 100;
  };

  const sanitizeAlerts = (alertsList: unknown): Alert[] => {
    if (!Array.isArray(alertsList)) {
      return [];
    }

    return alertsList.filter(alert => {
      return (
        alert &&
        typeof alert === 'object' &&
        isValidBrokerId(alert.brokerId) &&
        typeof alert.title === 'string' &&
        alert.title.trim().length > 0 &&
        typeof alert.message === 'string' &&
        alert.message.trim().length > 0 &&
        typeof alert.type === 'string' &&
        ['info', 'warning', 'success', 'error'].includes(alert.type) &&
        typeof alert.date === 'string' &&
        alert.date.length > 0
      );
    });
  };

  const getAlertsForFavorites = (favoriteBrokerIds: unknown[]): Alert[] => {
    if (!Array.isArray(favoriteBrokerIds)) {
      console.warn('Invalid favorite broker IDs provided to getAlertsForFavorites');
      return [];
    }

    const validIds = favoriteBrokerIds.filter(isValidBrokerId);

    return alerts
      .filter(alert => validIds.includes(alert.brokerId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const markAllAsRead = () => {
    setAlerts(prev =>
      prev.map(alert => {
        const isInFavorites = favoritesList.some(fav => fav === alert.brokerId);
        return isInFavorites ? { ...alert, read: true } : alert;
      })
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