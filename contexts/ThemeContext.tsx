

import React, { createContext, useState, useEffect } from 'react';
import { ThemeContextType } from '../types';

export const ThemeContext = createContext<ThemeContextType | null>(null);

// Validation utilities
const isValidTheme = (theme: string): theme is 'light' | 'dark' => {
  return theme === 'light' || theme === 'dark';
};

const getValidTheme = (theme: unknown): 'light' | 'dark' => {
  if (typeof theme === 'string' && isValidTheme(theme)) {
    return theme;
  }
  return 'light'; // Default fallback
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      // Check if we're on the client side
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedTheme = window.localStorage.getItem('theme');
        return getValidTheme(savedTheme);
      }
    } catch (error) {
      console.warn('Failed to access localStorage for theme:', error);
    }
    // Default to light theme for server-side rendering or error cases
    return 'light';
  });

  useEffect(() => {
    try {
      // Only run on client side
      if (typeof window !== 'undefined' && window.document && window.document.documentElement) {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        if (window.localStorage) {
          window.localStorage.setItem('theme', theme);
        }
      }
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    try {
      setTheme(prevTheme => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        return newTheme;
      });
    } catch (error) {
      console.error('Failed to toggle theme:', error);
    }
  };

  // Add a method to programmatically set theme with validation
  const setThemeWithValidation = (newTheme: unknown) => {
    const validTheme = getValidTheme(newTheme);
    setTheme(validTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};