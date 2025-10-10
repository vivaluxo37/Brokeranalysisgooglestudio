import React, { Suspense, lazy, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import AuthErrorBoundary from '../components/error/AuthErrorBoundary';
import ContextErrorBoundary from '../components/error/ContextErrorBoundary';

// Type declaration for window.Clerk
declare global {
  interface Window {
    Clerk?: {
      loaded: boolean;
    };
  }
}
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';

// Lazy load non-critical contexts
const ComparisonProvider = lazy(() => import('./ComparisonContext').then(module => ({ default: module.ComparisonProvider })));
const FavoritesProvider = lazy(() => import('./FavoritesContext').then(module => ({ default: module.FavoritesProvider })));
const ReviewsProvider = lazy(() => import('./ReviewsContext').then(module => ({ default: module.ReviewsProvider })));
const AlertsProvider = lazy(() => import('./AlertsContext').then(module => ({ default: module.AlertsProvider })));
const LanguageProvider = lazy(() => import('./LanguageContext').then(module => ({ default: module.LanguageProvider })));
const DiscussionProvider = lazy(() => import('./DiscussionContext').then(module => ({ default: module.DiscussionProvider })));
const TradingJournalProvider = lazy(() => import('./TradingJournalContext').then(module => ({ default: module.TradingJournalProvider })));
const EducationProvider = lazy(() => import('./EducationContext').then(module => ({ default: module.EducationProvider })));
const OnboardingProvider = lazy(() => import('./OnboardingContext').then(module => ({ default: module.OnboardingProvider })));
const SEOProvider = lazy(() => import('./SEOContext').then(module => ({ default: module.SEOProvider })));

interface AppProvidersProps {
  children: React.ReactNode;
  publishableKey: string;
}

// Loading skeleton for lazy contexts
const ContextLoader: React.FC = () => (
  <div className="context-loader" style={{ 
    display: 'inline-block', 
    width: '20px', 
    height: '20px', 
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: '50%',
    animation: 'pulse 1.5s ease-in-out infinite'
  }} />
);

/**
 * Performance-optimized provider component that uses lazy loading
 * for non-critical contexts to reduce initial load time
 */
const OptimizedAppProviders: React.FC<AppProvidersProps> = ({ children, publishableKey }) => {
  // Validate Clerk publishable key - stable memoization
  const clerkProps = useMemo(() => {
    // Prevent multiple Clerk instances by checking if already initialized
    if (window.Clerk?.loaded) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ Clerk already loaded, skipping re-initialization');
      }
      return { publishableKey: '', afterSignOutUrl: "/" };
    }
    
    if (!publishableKey || publishableKey.length < 50) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ Invalid or incomplete Clerk publishable key. Authentication will be disabled.');
      }
      return { publishableKey: '', afterSignOutUrl: "/" };
    }
    return { publishableKey, afterSignOutUrl: "/" };
  }, [publishableKey]);

  // Create Clerk provider with error boundary - stable memoization
  const ClerkProviderWithErrorBoundary = useMemo(() => {
    if (!clerkProps.publishableKey) {
      return ({ children }: { children: React.ReactNode }) => <>{children}</>;
    }

    return ({ children }: { children: React.ReactNode }) => (
      <AuthErrorBoundary>
        <ClerkProvider {...clerkProps}>
          {children}
        </ClerkProvider>
      </AuthErrorBoundary>
    );
  }, [clerkProps.publishableKey]);

  return (
    <ClerkProviderWithErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            {/* Critical contexts loaded immediately */}
            <Suspense fallback={<ContextLoader />}>
              <LanguageProvider>
                <SEOProvider baseUrl="https://brokeranalysis.com">
                  {/* Non-critical contexts loaded lazily */}
                  <Suspense fallback={<>{children}</>}>
                    <ComparisonProvider>
                      <FavoritesProvider>
                        <ReviewsProvider>
                          <DiscussionProvider>
                            <AlertsProvider>
                              <EducationProvider>
                                <TradingJournalProvider>
                                  <OnboardingProvider>
                                    {children}
                                  </OnboardingProvider>
                                </TradingJournalProvider>
                              </EducationProvider>
                            </AlertsProvider>
                          </DiscussionProvider>
                        </ReviewsProvider>
                      </FavoritesProvider>
                    </ComparisonProvider>
                  </Suspense>
                </SEOProvider>
              </LanguageProvider>
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ClerkProviderWithErrorBoundary>
  );
};

/**
 * Alternative version with progressive context loading
 * Loads contexts in priority order
 */
export const ProgressiveAppProviders: React.FC<AppProvidersProps> = ({ children, publishableKey }) => {
  const clerkProps = useMemo(() => {
    if (!publishableKey || publishableKey.length < 50) {
      return { publishableKey: '', afterSignOutUrl: "/" };
    }
    return { publishableKey, afterSignOutUrl: "/" };
  }, [publishableKey]);

  const ClerkProviderWithErrorBoundary = useMemo(() => {
    if (!clerkProps.publishableKey) {
      return ({ children }: { children: React.ReactNode }) => <>{children}</>;
    }

    return ({ children }: { children: React.ReactNode }) => (
      <AuthErrorBoundary>
        <ClerkProvider {...clerkProps}>
          {children}
        </ClerkProvider>
      </AuthErrorBoundary>
    );
  }, [clerkProps.publishableKey]);

  return (
    <ClerkProviderWithErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            {/* Priority 1: Core functionality */}
            <Suspense fallback={<ContextLoader />}>
              <LanguageProvider>
                <SEOProvider baseUrl="https://brokeranalysis.com">
                  {/* Priority 2: User features */}
                  <Suspense fallback={<>{children}</>}>
                    <FavoritesProvider>
                      <ComparisonProvider>
                        {/* Priority 3: Social features */}
                        <Suspense fallback={<>{children}</>}>
                          <ReviewsProvider>
                            <DiscussionProvider>
                              {/* Priority 4: Advanced features */}
                              <Suspense fallback={<>{children}</>}>
                                <AlertsProvider>
                                  <EducationProvider>
                                    {/* Priority 5: Optional features */}
                                    <Suspense fallback={<>{children}</>}>
                                      <TradingJournalProvider>
                                        <OnboardingProvider>
                                          {children}
                                        </OnboardingProvider>
                                      </TradingJournalProvider>
                                    </Suspense>
                                  </EducationProvider>
                                </AlertsProvider>
                              </Suspense>
                            </DiscussionProvider>
                          </ReviewsProvider>
                        </Suspense>
                      </ComparisonProvider>
                    </FavoritesProvider>
                  </Suspense>
                </SEOProvider>
              </LanguageProvider>
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ClerkProviderWithErrorBoundary>
  );
};

/**
 * Minimal provider for critical path rendering
 * Only loads essential contexts for initial render
 */
export const MinimalAppProviders: React.FC<AppProvidersProps> = ({ children, publishableKey }) => {
  const clerkProps = useMemo(() => {
    if (!publishableKey || publishableKey.length < 50) {
      return { publishableKey: '', afterSignOutUrl: "/" };
    }
    return { publishableKey, afterSignOutUrl: "/" };
  }, [publishableKey]);

  const ClerkProviderWithErrorBoundary = useMemo(() => {
    if (!clerkProps.publishableKey) {
      return ({ children }: { children: React.ReactNode }) => <>{children}</>;
    }

    return ({ children }: { children: React.ReactNode }) => (
      <AuthErrorBoundary>
        <ClerkProvider {...clerkProps}>
          {children}
        </ClerkProvider>
      </AuthErrorBoundary>
    );
  }, [clerkProps.publishableKey]);

  return (
    <ClerkProviderWithErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            {/* Only critical contexts for initial render */}
            <Suspense fallback={<ContextLoader />}>
              <LanguageProvider>
                <SEOProvider baseUrl="https://brokeranalysis.com">
                  {children}
                </SEOProvider>
              </LanguageProvider>
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ClerkProviderWithErrorBoundary>
  );
};

export default OptimizedAppProviders;