
import React, { createContext, useState, useEffect } from 'react';
import { FavoritesContextType } from '../types';
import { useAuth } from '../hooks/useAuth';

export const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favoritesList, setFavoritesList] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const savedList = typeof window !== 'undefined' && localStorage ? localStorage.getItem(`favorites_${user.id}`) : null;
      setFavoritesList(savedList ? JSON.parse(savedList) : []);
    } else {
      setFavoritesList([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favoritesList));
    }
  }, [favoritesList, user]);

  const addBrokerToFavorites = (brokerId: string) => {
    if (!user) return; // Or prompt to login
    setFavoritesList(prev => [...new Set([...prev, brokerId])]);
  };

  const removeBrokerFromFavorites = (brokerId: string) => {
    if (!user) return;
    setFavoritesList(prev => prev.filter(id => id !== brokerId));
  };

  const isBrokerInFavorites = (brokerId: string) => {
    if (!user) return false;
    return favoritesList.includes(brokerId);
  };

  return (
    <FavoritesContext.Provider value={{ favoritesList, addBrokerToFavorites, removeBrokerFromFavorites, isBrokerInFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
