import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock environment variables
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => []),
    navigation: {
      domContentLoadedEventEnd: 1000,
      domContentLoadedEventStart: 800,
      loadEventEnd: 1200,
      loadEventStart: 1100,
    },
  },
  writable: true,
});

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock Supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
    useLocation: () => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'test',
    }),
  };
});

// Mock our custom Helmet components
vi.mock('../../components/seo/HelmetAsync', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => children,
  HelmetProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock Canvas API for image format detection
HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,test');

// Clean up after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Global test utilities
beforeAll(() => {
  // Suppress console.error during tests unless needed
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || 
       args[0].includes('Error:') ||
       args[0].includes('React does not recognize'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  // Restore console.error
  console.error = console.error;
});

// Test data factories
export const createMockBroker = (overrides = {}) => ({
  id: '1',
  name: 'Test Broker',
  slug: 'test-broker',
  website: 'https://testbroker.com',
  logo_url: 'https://testbroker.com/logo.png',
  rating: 8.5,
  min_deposit: 100,
  max_leverage: 500,
  spreads_from: 0.1,
  regulation: 'FCA, ASIC',
  platforms: 'MT4, MT5, WebTrader',
  account_types: 'Standard, ECN, Islamic',
  description: 'Test broker description',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockCategory = (overrides = {}) => ({
  id: '1',
  name: 'ECN Brokers',
  slug: 'ecn-brokers',
  description: 'Electronic Communication Network brokers',
  type: 'execution',
  icon: '⚡',
  color: '#3B82F6',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockCountry = (overrides = {}) => ({
  id: '1',
  name: 'United Kingdom',
  slug: 'united-kingdom',
  iso_code: 'GB',
  flag: '🇬🇧',
  population: 67000000,
  currency: 'GBP',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockVerificationResult = (overrides = {}) => ({
  id: '1',
  broker_id: '1',
  country_id: '1',
  is_available: true,
  confidence: 0.85,
  evidence: ['Official website confirms UK clients accepted'],
  last_verified: new Date().toISOString(),
  checked_by: 'system',
  ...overrides,
});

export const createMockRankingWeight = (overrides = {}) => ({
  id: '1',
  factor: 'regulation',
  weight: 0.25,
  description: 'Regulatory strength and reputation',
  updated_at: new Date().toISOString(),
  updated_by: 'system',
  ...overrides,
});