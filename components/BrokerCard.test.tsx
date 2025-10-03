import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrokerCard } from './BrokerCard';
import { createMockBroker } from '../src/test/setup';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BrokerCard', () => {
  const mockBroker = createMockBroker({
    id: '1',
    name: 'Test Broker',
    logo_url: 'https://example.com/logo.png',
    rating: 4.5,
    regulation: 'FCA, ASIC',
    spreads_from: 0.1,
    min_deposit: 100,
    platforms: 'MT4, MT5',
    description: 'A reliable forex broker',
    countries_available: ['US', 'UK', 'AU'],
  });

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders broker information correctly', () => {
    renderWithRouter(<BrokerCard broker={mockBroker} />);

    expect(screen.getByText('Test Broker')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('FCA, ASIC')).toBeInTheDocument();
    expect(screen.getByText(/From 0.1 pips/)).toBeInTheDocument();
    expect(screen.getByText(/\$100/)).toBeInTheDocument();
    expect(screen.getByText('MT4, MT5')).toBeInTheDocument();
    expect(screen.getByText('A reliable forex broker')).toBeInTheDocument();
  });

  it('displays broker logo with correct alt text', () => {
    renderWithRouter(<BrokerCard broker={mockBroker} />);

    const logo = screen.getByAltText('Test Broker');
    expect(logo).toHaveAttribute('src', 'https://example.com/logo.png');
  });

  it('shows rating stars correctly', () => {
    renderWithRouter(<BrokerCard broker={mockBroker} />);

    const stars = screen.getAllByTestId(/star-/);
    expect(stars).toHaveLength(5);

    // Should have 4 full stars, 1 half star
    const fullStars = screen.getAllByTestId(/star-.*-full/);
    const halfStars = screen.getAllByTestId(/star-.*-half/);
    expect(fullStars).toHaveLength(4);
    expect(halfStars).toHaveLength(1);
  });

  it('navigates to broker details on card click', () => {
    renderWithRouter(<BrokerCard broker={mockBroker} />);

    const card = screen.getByRole('article');
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/brokers/1');
  });

  it('navigates to broker details on "View Details" button click', () => {
    renderWithRouter(<BrokerCard broker={mockBroker} />);

    const viewDetailsButton = screen.getByText('View Details');
    fireEvent.click(viewDetailsButton);

    expect(mockNavigate).toHaveBeenCalledWith('/brokers/1');
  });

  it('handles missing logo gracefully', () => {
    const brokerWithoutLogo = createMockBroker({
      ...mockBroker,
      logo_url: null,
    });

    renderWithRouter(<BrokerCard broker={brokerWithoutLogo} />);

    const placeholder = screen.getByTestId('logo-placeholder');
    expect(placeholder).toBeInTheDocument();
  });

  it('handles missing rating', () => {
    const brokerWithoutRating = createMockBroker({
      ...mockBroker,
      rating: null,
    });

    renderWithRouter(<BrokerCard broker={brokerWithoutRating} />);

    expect(screen.getByText('No rating')).toBeInTheDocument();
  });

  it('handles missing regulation', () => {
    const brokerWithoutRegulation = createMockBroker({
      ...mockBroker,
      regulation: null,
    });

    renderWithRouter(<BrokerCard broker={brokerWithoutRegulation} />);

    expect(screen.getByText('Unregulated')).toBeInTheDocument();
  });

  it('handles missing spreads data', () => {
    const brokerWithoutSpreads = createMockBroker({
      ...mockBroker,
      spreads_from: null,
    });

    renderWithRouter(<BrokerCard broker={brokerWithoutSpreads} />);

    expect(screen.getByText('Spreads vary')).toBeInTheDocument();
  });

  it('handles missing minimum deposit', () => {
    const brokerWithoutMinDeposit = createMockBroker({
      ...mockBroker,
      min_deposit: null,
    });

    renderWithRouter(<BrokerCard broker={brokerWithoutMinDeposit} />);

    expect(screen.getByText('No minimum')).toBeInTheDocument();
  });

  it('handles zero minimum deposit', () => {
    const brokerWithZeroDeposit = createMockBroker({
      ...mockBroker,
      min_deposit: 0,
    });

    renderWithRouter(<BrokerCard broker={brokerWithZeroDeposit} />);

    expect(screen.getByText('No minimum')).toBeInTheDocument();
  });

  it('truncates long descriptions', () => {
    const brokerWithLongDescription = createMockBroker({
      ...mockBroker,
      description: 'This is a very long description that should be truncated to prevent the card from becoming too tall and maintain good layout consistency across different broker cards in the listing.',
    });

    renderWithRouter(<BrokerCard broker={brokerWithLongDescription} />);

    const description = screen.getByText(/This is a very long description/);
    expect(description.textContent?.length).toBeLessThan(brokerWithLongDescription.description!.length);
  });

  it('displays platforms correctly', () => {
    renderWithRouter(<BrokerCard broker={mockBroker} />);

    expect(screen.getByText('MT4, MT5')).toBeInTheDocument();
  });

  it('handles missing platforms', () => {
    const brokerWithoutPlatforms = createMockBroker({
      ...mockBroker,
      platforms: null,
    });

    renderWithRouter(<BrokerCard broker={brokerWithoutPlatforms} />);

    expect(screen.getByText('Platform info not available')).toBeInTheDocument();
  });

  it('shows country availability count', () => {
    renderWithRouter(<BrokerCard broker={mockBroker} />);

    expect(screen.getByText('Available in 3 countries')).toBeInTheDocument();
  });

  it('handles empty country list', () => {
    const brokerWithoutCountries = createMockBroker({
      ...mockBroker,
      countries_available: [],
    });

    renderWithRouter(<BrokerCard broker={brokerWithoutCountries} />);

    expect(screen.getByText('Availability not specified')).toBeInTheDocument();
  });

  it('applies hover effects correctly', async () => {
    renderWithRouter(<BrokerCard broker={mockBroker} />);

    const card = screen.getByRole('article');
    
    fireEvent.mouseEnter(card);
    
    await waitFor(() => {
      expect(card).toHaveClass('hover:shadow-lg');
    });
  });

  it('is keyboard accessible', () => {
    renderWithRouter(<BrokerCard broker={mockBroker} />);

    const card = screen.getByRole('article');
    
    // Should be focusable
    card.focus();
    expect(card).toHaveFocus();

    // Should respond to Enter key
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/brokers/1');
  });

  it('responds to space key for navigation', () => {
    renderWithRouter(<BrokerCard broker={mockBroker} />);

    const card = screen.getByRole('article');
    fireEvent.keyDown(card, { key: ' ', code: 'Space' });
    
    expect(mockNavigate).toHaveBeenCalledWith('/brokers/1');
  });

  it('displays loading state for lazy-loaded images', () => {
    renderWithRouter(<BrokerCard broker={mockBroker} />);

    const image = screen.getByAltText('Test Broker');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('shows promotion badge when broker has promotions', () => {
    const brokerWithPromotion = createMockBroker({
      ...mockBroker,
      has_promotions: true,
    });

    renderWithRouter(<BrokerCard broker={brokerWithPromotion} />);

    expect(screen.getByText('Special Offer')).toBeInTheDocument();
  });

  it('does not show promotion badge when broker has no promotions', () => {
    const brokerWithoutPromotion = createMockBroker({
      ...mockBroker,
      has_promotions: false,
    });

    renderWithRouter(<BrokerCard broker={brokerWithoutPromotion} />);

    expect(screen.queryByText('Special Offer')).not.toBeInTheDocument();
  });

  it('formats large minimum deposits correctly', () => {
    const brokerWithLargeDeposit = createMockBroker({
      ...mockBroker,
      min_deposit: 10000,
    });

    renderWithRouter(<BrokerCard broker={brokerWithLargeDeposit} />);

    expect(screen.getByText(/\$10,000/)).toBeInTheDocument();
  });

  it('handles click events on child elements correctly', () => {
    renderWithRouter(<BrokerCard broker={mockBroker} />);

    // Clicking on rating should not trigger navigation (event should be handled by card)
    const rating = screen.getByText('4.5');
    fireEvent.click(rating);

    expect(mockNavigate).toHaveBeenCalledWith('/brokers/1');
  });

  it('prevents event bubbling on button clicks', () => {
    renderWithRouter(<BrokerCard broker={mockBroker} />);

    const viewDetailsButton = screen.getByText('View Details');
    
    // Create a mock event with stopPropagation
    const mockEvent = new MouseEvent('click', { bubbles: true });
    const stopPropagationSpy = vi.spyOn(mockEvent, 'stopPropagation');

    fireEvent.click(viewDetailsButton, mockEvent);

    expect(mockNavigate).toHaveBeenCalledWith('/brokers/1');
  });
});