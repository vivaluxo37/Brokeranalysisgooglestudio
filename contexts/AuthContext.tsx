

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { AuthContextType, User } from '../types';
import { userService } from '../services/userService';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, signOut } = useClerkAuth();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();

  const [user, setUser] = useState<User | null>(null);
  const [isUserSyncing, setIsUserSyncing] = useState(false);

  // Convert Clerk user to our User interface and sync with database
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser && isUserLoaded && !isUserSyncing) {
      const syncUser = async () => {
        setIsUserSyncing(true);
        try {
          // First set the immediate user data from Clerk
          const appUser: User = {
            id: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            name: clerkUser.fullName || clerkUser.firstName || clerkUser.username || 'User',
            imageUrl: clerkUser.imageUrl,
            createdAt: clerkUser.createdAt?.toISOString(),
            updatedAt: clerkUser.updatedAt?.toISOString(),
          };
          setUser(appUser);

          // Then sync with database in the background
          try {
            const dbUser = await userService.syncUserWithDatabase(clerkUser);
            // Update with any additional data from database if needed
            setUser(prev => prev ? { ...prev, ...dbUser } : dbUser);
          } catch (error) {
            console.error('Failed to sync user with database:', error);
            // Continue with Clerk user data even if DB sync fails
          }
        } catch (error) {
          console.error('Failed to process user data:', error);
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
    if (!user) {
      throw new Error('No user logged in');
    }
    
    try {
      const updatedUser = await userService.updateUser(user.id, { name });
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