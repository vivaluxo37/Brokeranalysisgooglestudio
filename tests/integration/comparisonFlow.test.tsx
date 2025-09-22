import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import AllBrokersPage from '../../pages/AllBrokersPage';
import ComparePage from '../../pages/ComparePage';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ComparisonProvider } from '../../contexts/ComparisonContext';
import { LanguageProvider } from '../../contexts/LanguageContext';

// Simplified provider wrapper for this test
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <MemoryRouter>
            <LanguageProvider>
                <ThemeProvider>
                    <ComparisonProvider>{children}</ComparisonProvider>
                </ThemeProvider>
            </LanguageProvider>
        </MemoryRouter>
    );
};


describe('Broker Comparison Flow', () => {
    // Clear localStorage before each test to ensure isolation
    beforeEach(() => {
        localStorage.clear();
    });
    
    afterEach(() => {
        localStorage.clear();
    });

    it('allows a user to add a broker to comparison and view it on the compare page', async () => {
        const user = userEvent.setup();
        
        // Step 1: Render AllBrokersPage and add a broker to comparison
        const { unmount } = render(<AllBrokersPage />, { wrapper: TestWrapper });

        // Wait for skeleton loaders to disappear
        const pepperstoneCard = await screen.findByText('Pepperstone', {}, { timeout: 2000 });
        const brokerCard = pepperstoneCard.closest('div[class*="bg-card"]');
        expect(brokerCard).toBeInTheDocument();

        // The name "Compare" might appear multiple times, so we scope the query
        // Fix: Use `within` and `getByRole` for better querying and to fix type error.
        const { getByRole } = within(brokerCard as HTMLElement);
        const compareButton = getByRole('button', { name: 'Compare' });
        
        await user.click(compareButton);
        
        await waitFor(() => {
            expect(compareButton).toHaveTextContent('In Compare');
        });
        
        // Verify localStorage is updated (this is an implementation detail, but useful here)
        const storedList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        expect(storedList).toEqual(['pepperstone']);
        
        // Unmount the current component to simulate navigating away
        unmount();
        
        // Step 2: Render ComparePage and verify the broker is present
        render(<ComparePage />, { wrapper: TestWrapper });
        
        // The comparison page should now show the broker added in the previous step
        await waitFor(() => {
            expect(screen.getByText('Pepperstone')).toBeInTheDocument();
        });

        // Check for a specific data point in the table to confirm it rendered
        expect(screen.getByText('EUR/USD Spread')).toBeInTheDocument();
        expect(screen.getByText('0.1 pips')).toBeInTheDocument();
    });
});