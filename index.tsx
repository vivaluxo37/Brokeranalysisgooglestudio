import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './src/index.css';

// Import real App component
import App from './App';

// Progressive loading of contexts - adding back gradually
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ComparisonProvider } from './contexts/ComparisonContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ReviewsProvider } from './contexts/ReviewsContext';
import { AlertsProvider } from './contexts/AlertsContext';
import { AuthProvider } from './contexts/AuthContext';
import { DiscussionProvider } from './contexts/DiscussionContext';
import { TradingJournalProvider } from './contexts/TradingJournalContext';
import { EducationProvider } from './contexts/EducationContext';
import { SEOProvider } from './contexts/SEOContext';

// Clerk Publishable Key - Using development keys for local development
const PUBLISHABLE_KEY = (import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Adding back providers gradually - ClerkProvider must be at the top level
// Order matters: dependencies must come after their providers
const app = (
  <React.StrictMode>
    <HelmetProvider>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <BrowserRouter>
            <LanguageProvider>
              <ThemeProvider>
                <AuthProvider>
                  <FavoritesProvider>
                    <ReviewsProvider>
                      <DiscussionProvider>
                        <AlertsProvider>
                          <EducationProvider>
                            <TradingJournalProvider>
                              <ComparisonProvider>
                                <OnboardingProvider>
                                  <SEOProvider baseUrl="https://brokeranalysis.com" supportedLocales={['en', 'es', 'fr', 'de']}>
                                    <App />
                                  </SEOProvider>
                                </OnboardingProvider>
                              </ComparisonProvider>
                            </TradingJournalProvider>
                          </EducationProvider>
                        </AlertsProvider>
                      </DiscussionProvider>
                    </ReviewsProvider>
                  </FavoritesProvider>
                </AuthProvider>
              </ThemeProvider>
            </LanguageProvider>
          </BrowserRouter>
        </ClerkProvider>
      </HelmetProvider>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(app);
}