import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ComparisonProvider } from './contexts/ComparisonContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ReviewsProvider } from './contexts/ReviewsContext';
import { AlertsProvider } from './contexts/AlertsContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DiscussionProvider } from './contexts/DiscussionContext';
import { TradingJournalProvider } from './contexts/TradingJournalContext';
import { EducationProvider } from './contexts/EducationContext';
import { OnboardingProvider } from './contexts/OnboardingContext';

// For SSR, we need to provide a mock Clerk context
const PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_ZW5hYmxpbmcta2F0eWRpZC02MC5jbGVyay5hY2NvdW50cy5kZXYk';

export function render(url: string) {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <StaticRouter location={url}>
          <LanguageProvider>
            <ThemeProvider>
              <AuthProvider>
                <ComparisonProvider>
                  <FavoritesProvider>
                    <ReviewsProvider>
                      <DiscussionProvider>
                        <AlertsProvider>
                          <EducationProvider>
                            <TradingJournalProvider>
                              <OnboardingProvider>
                                <App />
                              </OnboardingProvider>
                            </TradingJournalProvider>
                          </EducationProvider>
                        </AlertsProvider>
                      </DiscussionProvider>
                    </ReviewsProvider>
                  </FavoritesProvider>
                </ComparisonProvider>
              </AuthProvider>
            </ThemeProvider>
          </LanguageProvider>
        </StaticRouter>
      </ClerkProvider>
    </React.StrictMode>
  );
}
