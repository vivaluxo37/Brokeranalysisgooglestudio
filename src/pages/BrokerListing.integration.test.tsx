import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrokerListing } from './BrokerListing';
import { createMockBroker, createMockCategory } from '../test/setup';
import type { Broker } from '../types';

// Mock API calls
const mockBrokers: Broker[] = [
  createMockBroker({
    id: '1',
    name: 'FCA Regulated Broker',
    regulation: 'FCA',
    spreads_from: 0.1,
    min_deposit: 100,
    platforms: 'MT4, MT5',
    rating: 4.8,
    countries_available: ['UK', 'US', 'AU'],
    account_types: 'Standard, ECN',
  }),
  createMockBroker({
    id: '2',
    name: 'ASIC Regulated Broker',
    regulation: 'ASIC',
    spreads_from: 0.2,
    min_deposit: 200,
    platforms: 'MT5, WebTrader',
    rating: 4.5,
    countries_available: ['AU', 'NZ'],
    account_types: 'Standard, Professional',
  }),
  createMockBroker({
    id: '3',
    name: 'CySEC Regulated Broker',
    regulation: 'CySEC',
    spreads_from: 0.5,
    min_deposit: 250,
    platforms: 'MT4',
    rating: 4.2,
    countries_available: ['EU', 'UK'],
    account_types: 'Standard',
  }),
  createMockBroker({
    id: '4',
    name: 'Unregulated Broker',
    regulation: 'Unregulated',
    spreads_from: 1.0,
    min_deposit: 50,
    platforms: 'WebTrader',
    rating: 3.5,
    countries_available: ['US'],
    account_types: 'Standard',
  }),
];

const mockCategories = [
  createMockCategory({
    id: 'ecn-brokers',
    name: 'ECN Brokers',
    description: 'Electronic Communication Network brokers',
  }),
  createMockCategory({
    id: 'forex-brokers',
    name: 'Forex Brokers',
    description: 'Foreign exchange brokers',
  }),
];

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BrokerListing Integration Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    
    // Default mock responses
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/api/brokers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockBrokers),
        });
      }
      if (url.includes('/api/categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Loading', () => {
    it('loads and displays brokers on mount', async () => {
      renderWithRouter(<BrokerListing />);

      // Should show loading initially
      expect(screen.getByText(/Loading brokers/)).toBeInTheDocument();

      // Wait for brokers to load
      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
        expect(screen.getByText('ASIC Regulated Broker')).toBeInTheDocument();
        expect(screen.getByText('CySEC Regulated Broker')).toBeInTheDocument();
        expect(screen.getByText('Unregulated Broker')).toBeInTheDocument();
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/brokers');
    });

    it('loads categories for filtering', async () => {
      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/categories');
      });

      // Categories should be available in filter dropdown
      const categoryFilter = screen.getByLabelText(/Category/);
      expect(categoryFilter).toBeInTheDocument();
    });

    it('handles API error gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('API Error'));

      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText(/Error loading brokers/)).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('filters brokers by name search', async () => {
      renderWithRouter(<BrokerListing />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
      });

      // Search for specific broker
      const searchInput = screen.getByPlaceholderText(/Search brokers/);
      fireEvent.change(searchInput, { target: { value: 'FCA' } });

      // Should show only FCA broker
      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
        expect(screen.queryByText('ASIC Regulated Broker')).not.toBeInTheDocument();
        expect(screen.queryByText('CySEC Regulated Broker')).not.toBeInTheDocument();
      });
    });

    it('shows no results message for invalid search', async () => {
      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search brokers/);
      fireEvent.change(searchInput, { target: { value: 'NonExistentBroker' } });

      await waitFor(() => {
        expect(screen.getByText(/No brokers found/)).toBeInTheDocument();
      });
    });

    it('clears search results when search is cleared', async () => {
      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search brokers/);
      
      // Search
      fireEvent.change(searchInput, { target: { value: 'FCA' } });
      await waitFor(() => {
        expect(screen.queryByText('ASIC Regulated Broker')).not.toBeInTheDocument();
      });

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });
      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
        expect(screen.getByText('ASIC Regulated Broker')).toBeInTheDocument();
      });
    });
  });

  describe('Filtering Functionality', () => {
    it('filters by regulation', async () => {
      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
      });

      // Filter by FCA regulation
      const regulationFilter = screen.getByLabelText(/Regulation/);
      fireEvent.change(regulationFilter, { target: { value: 'FCA' } });

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
        expect(screen.queryByText('ASIC Regulated Broker')).not.toBeInTheDocument();
        expect(screen.queryByText('CySEC Regulated Broker')).not.toBeInTheDocument();
      });
    });

    it('filters by minimum deposit range', async () => {
      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
      });

      // Filter by minimum deposit (0-150 range should show brokers with min deposit <= 150)
      const minDepositFilter = screen.getByLabelText(/Minimum Deposit/);
      fireEvent.change(minDepositFilter, { target: { value: '0-150' } });

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument(); // $100
        expect(screen.getByText('Unregulated Broker')).toBeInTheDocument(); // $50
        expect(screen.queryByText('ASIC Regulated Broker')).not.toBeInTheDocument(); // $200
        expect(screen.queryByText('CySEC Regulated Broker')).not.toBeInTheDocument(); // $250
      });
    });

    it('filters by platform', async () => {
      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
      });

      const platformFilter = screen.getByLabelText(/Platform/);
      fireEvent.change(platformFilter, { target: { value: 'MT5' } });

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument(); // MT4, MT5
        expect(screen.getByText('ASIC Regulated Broker')).toBeInTheDocument(); // MT5, WebTrader
        expect(screen.queryByText('CySEC Regulated Broker')).not.toBeInTheDocument(); // MT4 only
        expect(screen.queryByText('Unregulated Broker')).not.toBeInTheDocument(); // WebTrader only
      });
    });

    it('applies multiple filters simultaneously', async () => {
      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
      });

      // Apply regulation and platform filters
      const regulationFilter = screen.getByLabelText(/Regulation/);
      const platformFilter = screen.getByLabelText(/Platform/);

      fireEvent.change(regulationFilter, { target: { value: 'FCA' } });
      fireEvent.change(platformFilter, { target: { value: 'MT5' } });

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument(); // Matches both filters
        expect(screen.queryByText('ASIC Regulated Broker')).not.toBeInTheDocument();
        expect(screen.queryByText('CySEC Regulated Broker')).not.toBeInTheDocument();
        expect(screen.queryByText('Unregulated Broker')).not.toBeInTheDocument();
      });
    });

    it('resets filters when reset button is clicked', async () => {
      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
      });

      // Apply a filter
      const regulationFilter = screen.getByLabelText(/Regulation/);
      fireEvent.change(regulationFilter, { target: { value: 'FCA' } });

      await waitFor(() => {
        expect(screen.queryByText('ASIC Regulated Broker')).not.toBeInTheDocument();
      });

      // Reset filters
      const resetButton = screen.getByText(/Clear Filters/);
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
        expect(screen.getByText('ASIC Regulated Broker')).toBeInTheDocument();
        expect(screen.getByText('CySEC Regulated Broker')).toBeInTheDocument();
        expect(screen.getByText('Unregulated Broker')).toBeInTheDocument();
      });
    });
  });

  describe('Sorting Functionality', () => {
    it('sorts brokers by rating descending by default', async () => {
      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
      });

      const brokerCards = screen.getAllByRole('article');
      
      // First broker should be FCA (4.8 rating)
      expect(within(brokerCards[0]).getByText('FCA Regulated Broker')).toBeInTheDocument();
      // Second should be ASIC (4.5 rating)
      expect(within(brokerCards[1]).getByText('ASIC Regulated Broker')).toBeInTheDocument();
    });

    it('sorts brokers by name when selected', async () => {
      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
      });

      const sortSelect = screen.getByLabelText(/Sort by/);
      fireEvent.change(sortSelect, { target: { value: 'name_asc' } });

      await waitFor(() => {
        const brokerCards = screen.getAllByRole('article');
        
        // Should be sorted alphabetically: ASIC, CySEC, FCA, Unregulated
        expect(within(brokerCards[0]).getByText('ASIC Regulated Broker')).toBeInTheDocument();
        expect(within(brokerCards[1]).getByText('CySEC Regulated Broker')).toBeInTheDocument();
        expect(within(brokerCards[2]).getByText('FCA Regulated Broker')).toBeInTheDocument();
        expect(within(brokerCards[3]).getByText('Unregulated Broker')).toBeInTheDocument();
      });
    });

    it('sorts brokers by minimum deposit', async () => {
      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
      });

      const sortSelect = screen.getByLabelText(/Sort by/);
      fireEvent.change(sortSelect, { target: { value: 'min_deposit_asc' } });

      await waitFor(() => {
        const brokerCards = screen.getAllByRole('article');
        
        // Should be sorted by min deposit: Unregulated ($50), FCA ($100), ASIC ($200), CySEC ($250)
        expect(within(brokerCards[0]).getByText('Unregulated Broker')).toBeInTheDocument();
        expect(within(brokerCards[1]).getByText('FCA Regulated Broker')).toBeInTheDocument();
        expect(within(brokerCards[2]).getByText('ASIC Regulated Broker')).toBeInTheDocument();
        expect(within(brokerCards[3]).getByText('CySEC Regulated Broker')).toBeInTheDocument();
      });
    });
  });

  describe('Pagination', () => {
    it('shows correct number of results per page', async () => {
      // Mock more brokers to test pagination
      const manyBrokers = Array.from({ length: 25 }, (_, i) => 
        createMockBroker({
          id: String(i + 1),
          name: `Broker ${i + 1}`,
          rating: 4.0 + (i % 10) * 0.1,
        })
      );

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('/api/brokers')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(manyBrokers),
          });
        }
        if (url.includes('/api/categories')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockCategories),
          });
        }
        return Promise.reject(new Error('Unknown endpoint'));
      });

      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText('Broker 1')).toBeInTheDocument();
      });

      // Should show first 12 brokers (default page size)
      const brokerCards = screen.getAllByRole('article');
      expect(brokerCards).toHaveLength(12);
    });

    it('navigates to next page', async () => {
      const manyBrokers = Array.from({ length: 25 }, (_, i) => 
        createMockBroker({
          id: String(i + 1),
          name: `Broker ${String(i + 1).padStart(2, '0')}`, // Ensure consistent sorting
          rating: 4.0,
        })
      );

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('/api/brokers')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(manyBrokers),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      });

      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText('Broker 01')).toBeInTheDocument();
      });

      // Click next page
      const nextButton = screen.getByLabelText(/Next page/);
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Broker 13')).toBeInTheDocument();
        expect(screen.queryByText('Broker 01')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('shows error message when broker loading fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText(/Error loading brokers/)).toBeInTheDocument();
      });
    });

    it('shows retry button on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
        .mockImplementation((url: string) => {
          if (url.includes('/api/brokers')) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(mockBrokers),
            });
          }
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockCategories),
          });
        });

      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText(/Error loading brokers/)).toBeInTheDocument();
      });

      // Click retry
      const retryButton = screen.getByText(/Try Again/);
      fireEvent.click(retryButton);

      // Should load successfully
      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
      });
    });
  });

  describe('URL State Management', () => {
    it('updates URL when filters are applied', async () => {
      const { container } = renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        expect(screen.getByText('FCA Regulated Broker')).toBeInTheDocument();
      });

      // Apply search filter
      const searchInput = screen.getByPlaceholderText(/Search brokers/);
      fireEvent.change(searchInput, { target: { value: 'FCA' } });

      await waitFor(() => {
        expect(window.location.search).toContain('search=FCA');
      });
    });

    it('restores filters from URL on mount', async () => {
      // Simulate URL with existing search parameter
      window.history.pushState({}, '', '/?search=FCA&regulation=FCA');

      renderWithRouter(<BrokerListing />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/Search brokers/) as HTMLInputElement;
        expect(searchInput.value).toBe('FCA');
        
        const regulationFilter = screen.getByLabelText(/Regulation/) as HTMLSelectElement;
        expect(regulationFilter.value).toBe('FCA');
      });
    });
  });
});