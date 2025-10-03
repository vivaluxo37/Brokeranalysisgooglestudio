import '@testing-library/jest-dom/vitest';

// Mock our custom Helmet components for all tests
vi.mock('./components/seo/HelmetAsync', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => children,
  HelmetProvider: ({ children }: { children: React.ReactNode }) => children,
}));
