

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { AuthContextType, User } from '../types';
import { userService } from '../services/userService';

export const AuthContext = createContext<AuthContextType | null>(null);

// Validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUser = (user: User): boolean => {
  return !!(
    user &&
    user.id &&
    user.email &&
    validateEmail(user.email) &&
    user.name
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe Clerk usage with fallback
  let clerkAuthData = { isLoaded: false, isSignedIn: false, signOut: async () => {} };
  let clerkUserData = { user: null, isLoaded: false };

  try {
    clerkAuthData = useClerkAuth();
    clerkUserData = useUser();
  } catch (error) {
    console.warn('Clerk auth not available, using fallback authentication:', error);
  }

  const { isLoaded, isSignedIn, signOut } = clerkAuthData;
  const { user: clerkUser, isLoaded: isUserLoaded } = clerkUserData;

  const [user, setUser] = useState<User | null>(null);
  const [isUserSyncing, setIsUserSyncing] = useState(false);

  // Convert Clerk user to our User interface and sync with database
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser && isUserLoaded && !isUserSyncing) {
      const syncUser = async () => {
        setIsUserSyncing(true);
        try {
          // Validate clerk user data
          if (!clerkUser.id) {
            throw new Error('Invalid clerk user: missing ID');
          }

          const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress;
          if (!primaryEmail || !validateEmail(primaryEmail)) {
            throw new Error('Invalid or missing email address');
          }

          // First set the immediate user data from Clerk
          const appUser: User = {
            id: clerkUser.id,
            email: primaryEmail,
            name: clerkUser.fullName || clerkUser.firstName || clerkUser.username || 'User',
            imageUrl: clerkUser.imageUrl || '',
            createdAt: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: clerkUser.updatedAt?.toISOString() || new Date().toISOString(),
          };

          // Validate the constructed user object
          if (!validateUser(appUser)) {
            throw new Error('Invalid user data constructed from clerk user');
          }

          setUser(appUser);

          // Then sync with database in the background
          try {
            const dbUser = await userService.syncUserWithDatabase(clerkUser);
            // Validate database user data before updating
            if (dbUser && validateUser(dbUser)) {
              setUser(prev => prev ? { ...prev, ...dbUser } : dbUser);
            } else {
              console.warn('Invalid user data received from database, using clerk data only');
            }
          } catch (error) {
            console.error('Failed to sync user with database:', error);
            // Continue with Clerk user data even if DB sync fails
          }
        } catch (error) {
          console.error('Failed to process user data:', error);
          // Set user to null on validation failure to prevent invalid state
          setUser(null);
        } finally {
          setIsUserSyncing(false);
        }
      };

      syncUser();
    } else if (isLoaded && !isSignedIn) {
      setUser(null);
      setIsUserSyncing(false);
    }
  }, [isLoaded, isSignedIn, clerkUser, isUserLoaded, isUserSyncing]);

  // Legacy mock functions for backward compatibility
  const login = async (email: string, pass: string): Promise<void> => {
    // Validate input
    if (!email || !pass) {
      throw new Error('Email and password are required');
    }

    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (pass.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Clerk handles authentication through their components
    // This function is kept for backward compatibility
    throw new Error('Please use Clerk authentication components');
  };

  const register = async (name: string, email: string, pass: string): Promise<void> => {
    // Validate input
    if (!name || !email || !pass) {
      throw new Error('Name, email, and password are required');
    }

    if (name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (pass.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Clerk handles registration through their components
    // This function is kept for backward compatibility
    throw new Error('Please use Clerk authentication components');
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout on client side even if Clerk logout fails
      setUser(null);
      throw new Error('Logout failed. Please try clearing your browser cookies.');
    }
  };

  const updateUser = async (name: string): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    const trimmedName = name.trim();

    try {
      const updatedUser = await userService.updateUser(user.id, { name: trimmedName });

      // Validate the updated user data
      if (!updatedUser || !validateUser(updatedUser)) {
        throw new Error('Invalid user data received from update service');
      }

      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const deleteAccount = async (): Promise<void> => {
    // Clerk handles account deletion through their API
    // This function is kept for backward compatibility
    throw new Error('Please use Clerk account management');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: isSignedIn || false,
    isLoaded,
    login,
    logout,
    register,
    updateUser,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};