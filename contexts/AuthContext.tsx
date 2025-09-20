

import React, { createContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Mock authentication functions
  const login = async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@test.com' && pass === 'password') {
          const mockUser: User = { id: '1', email: 'test@test.com', name: 'Test User' };
          setUser(mockUser);
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, pass: string): Promise<void> => {
     return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = { id: Date.now().toString(), email, name };
        setUser(newUser);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = async (name: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (user) {
          const updatedUser = { ...user, name };
          setUser(updatedUser);
        }
        resolve();
      }, 500);
    });
  };

  const deleteAccount = async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (user) {
          // In a real app, you'd also remove other user-specific data
          localStorage.removeItem(`favorites_${user.id}`);
          localStorage.removeItem(`matcherHistory_${user.id}`);
        }
        setUser(null); // This triggers the useEffect to remove 'user' from localStorage
        resolve();
      }, 500);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};