
import React, { createContext, useState, useEffect } from 'react';
import { FavoritesContextType } from '../types';
import { useAuth } from '../hooks/useAuth';

export const FavoritesContext = createContext<FavoritesContextType | null>(null);

// Validation utilities
const isValidBrokerId = (id: unknown): id is string => {
  return typeof id === 'string' && id.trim().length > 0 && id.trim().length <= 100;
};

const sanitizeFavoritesList = (list: unknown): string[] => {
  if (!Array.isArray(list)) {
    return [];
  }

  return list
    .filter(item => isValidBrokerId(item))
    .map(item => item.trim())
    .filter((item, index, arr) => arr.indexOf(item) === index) // Remove duplicates
    .slice(0, 50); // Limit to 50 items for performance
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favoritesList, setFavoritesList] = useState<string[]>([]);

  useEffect(() => {
    if (user && user.id) {
      try {
        const savedList = typeof window !== 'undefined' && window.localStorage
          ? window.localStorage.getItem(`favorites_${user.id}`)
          : null;

        if (savedList) {
          const parsed = JSON.parse(savedList);
          setFavoritesList(sanitizeFavoritesList(parsed));
        } else {
          setFavoritesList([]);
        }
      } catch (error) {
        console.warn('Failed to load favorites from localStorage:', error);
        setFavoritesList([]);
      }
    } else {
      setFavoritesList([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favoritesList));
      } catch (error) {
        console.warn('Failed to save favorites to localStorage:', error);
      }
    }
  }, [favoritesList, user]);

  const addBrokerToFavorites = (brokerId: unknown) => {
    if (!user || !isValidBrokerId(brokerId)) {
      console.warn('Invalid broker ID or user not logged in:', { brokerId, user: !!user });
      return;
    }

    const trimmedId = brokerId.trim();

    setFavoritesList(prev => {
      // Check if already exists to avoid unnecessary updates
      if (prev.includes(trimmedId)) {
        return prev;
      }

      // Limit to 50 items
      const newList = [...prev, trimmedId];
      if (newList.length > 50) {
        console.warn('Favorites list limit reached (50 items)');
        return newList.slice(-50);
      }

      return newList;
    });
  };

  const removeBrokerFromFavorites = (brokerId: unknown) => {
    if (!user || !isValidBrokerId(brokerId)) {
      console.warn('Invalid broker ID or user not logged in:', { brokerId, user: !!user });
      return;
    }

    const trimmedId = brokerId.trim();
    setFavoritesList(prev => prev.filter(id => id !== trimmedId));
  };

  const isBrokerInFavorites = (brokerId: unknown): boolean => {
    if (!user || !isValidBrokerId(brokerId)) {
      return false;
    }
    return favoritesList.includes(brokerId.trim());
  };

  return (
    <FavoritesContext.Provider value={{ favoritesList, addBrokerToFavorites, removeBrokerFromFavorites, isBrokerInFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
