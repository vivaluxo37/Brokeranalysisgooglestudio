import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
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
  // Memoize providers to prevent unnecessary re-renders
  const providers = React.useMemo(() => {
    return [
      // Core providers (order is critical)
      { Component: ClerkProvider, props: { publishableKey, afterSignOutUrl: "/" } },
      { Component: BrowserRouter, props: {} },
      { Component: LanguageProvider, props: {} },
      { Component: ThemeProvider, props: {} },
      { Component: AuthProvider, props: {} },
      { Component: SEOProvider, props: { baseUrl: "https://brokeranalysis.com" } },
      
      // Feature providers (order less critical)
      { Component: ComparisonProvider, props: {} },
      { Component: FavoritesProvider, props: {} },
      { Component: ReviewsProvider, props: {} },
      { Component: DiscussionProvider, props: {} },
      { Component: AlertsProvider, props: {} },
      { Component: EducationProvider, props: {} },
      { Component: TradingJournalProvider, props: {} },
      { Component: OnboardingProvider, props: {} },
    ];
  }, [publishableKey]);

  // Dynamically compose providers to reduce nesting
  const composedProviders = providers.reduce(
    (AccumulatedProviders, { Component, props }) => {
      return ({ children: innerChildren }: { children: React.ReactNode }) => (
        <AccumulatedProviders>
          <Component {...props}>
            {innerChildren}
          </Component>
        </AccumulatedProviders>
      );
    },
    ({ children: innerChildren }: { children: React.ReactNode }) => <>{innerChildren}</>
  );

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
  return (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
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
  const CoreProviders = React.memo(({ children: coreChildren }: { children: React.ReactNode }) => (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
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