import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import AuthErrorBoundary from '../components/error/AuthErrorBoundary';
import ContextErrorBoundary from '../components/error/ContextErrorBoundary';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { ComparisonProvider } from './ComparisonContext';
import { FavoritesProvider } from './FavoritesContext';
import { ReviewsProvider } from './ReviewsContext';
import { AlertsProvider } from './AlertsContext';
import { LanguageProvider } from './LanguageContext';
import { DiscussionProvider } from './DiscussionContext';
import { TradingJournalProvider } from './TradingJournalContext';
import { EducationProvider } from './EducationContext';
import { OnboardingProvider } from './OnboardingContext';
import { SEOProvider } from './SEOContext';

interface AppProvidersProps {
  children: React.ReactNode;
  publishableKey: string;
}

/**
 * Compound provider component that wraps the entire app with all necessary context providers.
 * This approach reduces the deeply nested provider structure and improves performance.
 * 
 * Provider hierarchy (order matters for dependencies):
 * 1. ClerkProvider - Authentication base
 * 2. BrowserRouter - Routing
 * 3. LanguageProvider - Must come early for locale-dependent contexts
 * 4. ThemeProvider - Theme system
 * 5. AuthProvider - User authentication state
 * 6. SEOProvider - SEO metadata
 * 7. Business logic providers (order less critical)
 */
const AppProviders: React.FC<AppProvidersProps> = ({ children, publishableKey }) => {
  // Validate Clerk publishable key - stable memoization
  const clerkProps = React.useMemo(() => {
    if (!publishableKey || publishableKey.length < 50) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ Invalid or incomplete Clerk publishable key. Authentication will be disabled.');
      }
      return { publishableKey: '', afterSignOutUrl: "/" };
    }
    return { publishableKey, afterSignOutUrl: "/" };
  }, [publishableKey]); // Only dependency is publishableKey

  // Create Clerk provider with error boundary - stable memoization
  const ClerkProviderWithErrorBoundary = React.useMemo(() => {
    if (!clerkProps.publishableKey) {
      // Return a simple wrapper that skips Clerk entirely
      return ({ children }: { children: React.ReactNode }) => <>{children}</>;
    }

    return ({ children }: { children: React.ReactNode }) => (
      <AuthErrorBoundary>
        <ClerkProvider {...clerkProps}>
          {children}
        </ClerkProvider>
      </AuthErrorBoundary>
    );
  }, [clerkProps.publishableKey]); // Only depend on the actual publishableKey

  // Memoize providers to prevent unnecessary re-renders - stable dependencies
  const providers = React.useMemo(() => {
    const coreProviders = [
      // Core providers (order is critical)
      {
        Component: ClerkProviderWithErrorBoundary,
        props: {},
        errorBoundary: { component: AuthErrorBoundary, contextName: 'Clerk Authentication' }
      },
      {
        Component: BrowserRouter,
        props: {},
        errorBoundary: { component: ContextErrorBoundary, contextName: 'Router' }
      },
      {
        Component: LanguageProvider,
        props: {},
        errorBoundary: { component: ContextErrorBoundary, contextName: 'Language' }
      },
      {
        Component: ThemeProvider,
        props: {},
        errorBoundary: { component: ContextErrorBoundary, contextName: 'Theme' }
      },
      {
        Component: AuthProvider,
        props: {},
        errorBoundary: { component: ContextErrorBoundary, contextName: 'Authentication' }
      },
      {
        Component: SEOProvider,
        props: { baseUrl: "https://brokeranalysis.com" },
        errorBoundary: { component: ContextErrorBoundary, contextName: 'SEO' }
      },

      // Feature providers (order less critical)
      {
        Component: ComparisonProvider,
        props: {},
        errorBoundary: { component: ContextErrorBoundary, contextName: 'Comparison' }
      },
      {
        Component: FavoritesProvider,
        props: {},
        errorBoundary: { component: ContextErrorBoundary, contextName: 'Favorites' }
      },
      {
        Component: ReviewsProvider,
        props: {},
        errorBoundary: { component: ContextErrorBoundary, contextName: 'Reviews' }
      },
      {
        Component: DiscussionProvider,
        props: {},
        errorBoundary: { component: ContextErrorBoundary, contextName: 'Discussion' }
      },
      {
        Component: AlertsProvider,
        props: {},
        errorBoundary: { component: ContextErrorBoundary, contextName: 'Alerts' }
      },
      {
        Component: EducationProvider,
        props: {},
        errorBoundary: { component: ContextErrorBoundary, contextName: 'Education' }
      },
      {
        Component: TradingJournalProvider,
        props: {},
        errorBoundary: { component: ContextErrorBoundary, contextName: 'Trading Journal' }
      },
      {
        Component: OnboardingProvider,
        props: {},
        errorBoundary: { component: ContextErrorBoundary, contextName: 'Onboarding' }
      },
    ];

    return coreProviders;
  }, [ClerkProviderWithErrorBoundary]); // Only depend on the Clerk provider factory

  // Dynamically compose providers to reduce nesting - stable composition
  const composedProviders = React.useMemo(() => {
    return providers.reduce(
      (AccumulatedProviders, { Component, props, errorBoundary }) => {
        const WrappedComponent = React.memo(({ children: innerChildren }: { children: React.ReactNode }) => {
          const content = (
            <Component {...props}>
              {innerChildren}
            </Component>
          );

          // Wrap with error boundary if specified
          if (errorBoundary) {
            const ErrorBoundaryComponent = errorBoundary.component;
            return (
              <ErrorBoundaryComponent contextName={errorBoundary.contextName}>
                {content}
              </ErrorBoundaryComponent>
            );
          }

          return content;
        });

        WrappedComponent.displayName = `WrappedProvider(${Component.displayName || Component.name})`;

        return ({ children: innerChildren }: { children: React.ReactNode }) => (
          <AccumulatedProviders>
            <WrappedComponent>
              {innerChildren}
            </WrappedComponent>
          </AccumulatedProviders>
        );
      },
      ({ children: innerChildren }: { children: React.ReactNode }) => <>{innerChildren}</>
    );
  }, [providers]); // Only depend on providers array

  return React.createElement(composedProviders, {}, children);
};

export default AppProviders;

/**
 * Alternative implementation using direct nesting but with better structure
 * This is more readable but creates deeper nesting
 */
export const AppProvidersAlternative: React.FC<AppProvidersProps> = ({
  children,
  publishableKey
}) => {
  // Validate Clerk publishable key
  const clerkKey = publishableKey && publishableKey.length >= 50 ? publishableKey : '';

  if (!clerkKey) {
    console.warn('⚠️ Invalid or incomplete Clerk publishable key. Using fallback without authentication.');
  }

  return (
    <ClerkProvider publishableKey={clerkKey} afterSignOutUrl="/">
      <BrowserRouter>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <SEOProvider baseUrl="https://brokeranalysis.com">
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
              </SEOProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ClerkProvider>
  );
};

/**
 * Performance-optimized version that combines related providers
 * This approach groups related contexts together to minimize re-renders
 */
export const OptimizedAppProviders: React.FC<AppProvidersProps> = ({
  children,
  publishableKey
}) => {
  // Validate Clerk publishable key
  const clerkKey = publishableKey && publishableKey.length >= 50 ? publishableKey : '';

  if (!clerkKey) {
    console.warn('⚠️ Invalid or incomplete Clerk publishable key. Using fallback without authentication.');
  }

  const CoreProviders = React.memo(({ children: coreChildren }: { children: React.ReactNode }) => (
    <ClerkProvider publishableKey={clerkKey} afterSignOutUrl="/">
      <BrowserRouter>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <SEOProvider baseUrl="https://brokeranalysis.com">
                {coreChildren}
              </SEOProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ClerkProvider>
  ));

  const FeatureProviders = React.memo(({ children: featureChildren }: { children: React.ReactNode }) => (
    <ComparisonProvider>
      <FavoritesProvider>
        <ReviewsProvider>
          <DiscussionProvider>
            <AlertsProvider>
              <EducationProvider>
                <TradingJournalProvider>
                  <OnboardingProvider>
                    {featureChildren}
                  </OnboardingProvider>
                </TradingJournalProvider>
              </EducationProvider>
            </AlertsProvider>
          </DiscussionProvider>
        </ReviewsProvider>
      </FavoritesProvider>
    </ComparisonProvider>
  ));

  return (
    <CoreProviders>
      <FeatureProviders>
        {children}
      </FeatureProviders>
    </CoreProviders>
  );
};