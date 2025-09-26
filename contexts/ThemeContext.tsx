

import React, { createContext, useState, useEffect } from 'react';
import { ThemeContextType } from '../types';

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined' && localStorage) {
      const savedTheme = localStorage.getItem('theme');
      // Default to light theme if no saved preference or invalid value
      return savedTheme === 'dark' ? 'dark' : 'light';
    }
    // Default to light theme for server-side rendering
    return 'light';
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};