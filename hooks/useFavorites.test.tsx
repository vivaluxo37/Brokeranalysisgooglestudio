import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthProvider } from '../contexts/AuthContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { useFavorites } from './useFavorites';
import { User } from '../types';

const mockUser: User = { id: 'test-user-1', name: 'Test User', email: 'test@test.com' };

const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AuthProvider>
            <FavoritesProvider>{children}</FavoritesProvider>
        </AuthProvider>
    );
};

describe('useFavorites hook', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should add and remove favorites correctly for a logged-in user', () => {
        // Set user in localStorage to simulate a logged-in state for the providers
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        const { result } = renderHook(() => useFavorites(), {
            wrapper: AllProviders,
        });

        // Favorites list should be loaded (empty for a new user)
        expect(result.current.favoritesList).toEqual([]);
        
        // Add a broker to favorites
        const brokerId1 = 'pepperstone';
        act(() => {
            result.current.addBrokerToFavorites(brokerId1);
        });
        
        expect(result.current.favoritesList).toContain(brokerId1);
        expect(result.current.isBrokerInFavorites(brokerId1)).toBe(true);

        // Add another broker
        const brokerId2 = 'ic-markets';
        act(() => {
            result.current.addBrokerToFavorites(brokerId2);
        });

        expect(result.current.favoritesList).toEqual([brokerId1, brokerId2]);
        
        // Remove the first broker
        act(() => {
            result.current.removeBrokerFromFavorites(brokerId1);
        });

        expect(result.current.favoritesList).toEqual([brokerId2]);
        expect(result.current.isBrokerInFavorites(brokerId1)).toBe(false);
        expect(result.current.isBrokerInFavorites(brokerId2)).toBe(true);
    });

    it('should not allow adding favorites when logged out', () => {
        const { result } = renderHook(() => useFavorites(), { wrapper: AllProviders });
        
        expect(result.current.favoritesList).toEqual([]);

        const brokerId = 'xtb';
        act(() => {
            result.current.addBrokerToFavorites(brokerId);
        });
        
        expect(result.current.favoritesList).toEqual([]);
        expect(result.current.isBrokerInFavorites(brokerId)).toBe(false);
    });
});
