

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { AuthContextType, User } from '../types';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, signOut } = useClerkAuth();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();

  const [user, setUser] = useState<User | null>(null);

  // Convert Clerk user to our User interface
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser && isUserLoaded) {
      const appUser: User = {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.firstName || clerkUser.username || 'User',
        imageUrl: clerkUser.imageUrl,
        createdAt: clerkUser.createdAt?.toISOString(),
        updatedAt: clerkUser.updatedAt?.toISOString(),
      };
      setUser(appUser);
    } else if (isLoaded && !isSignedIn) {
      setUser(null);
    }
  }, [isLoaded, isSignedIn, clerkUser, isUserLoaded]);

  // Legacy mock functions for backward compatibility
  const login = async (email: string, pass: string): Promise<void> => {
    // Clerk handles authentication through their components
    // This function is kept for backward compatibility
    throw new Error('Please use Clerk authentication components');
  };

  const register = async (name: string, email: string, pass: string): Promise<void> => {
    // Clerk handles registration through their components
    // This function is kept for backward compatibility
    throw new Error('Please use Clerk authentication components');
  };

  const logout = async (): Promise<void> => {
    await signOut();
  };

  const updateUser = async (name: string): Promise<void> => {
    // Clerk handles user updates through their API
    // This function is kept for backward compatibility
    throw new Error('Please use Clerk user management');
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