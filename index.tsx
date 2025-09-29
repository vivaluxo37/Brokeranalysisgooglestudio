import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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
import { SEOProvider } from './contexts/SEOContext';
import './src/index.css';

// Clerk Publishable Key - Using development keys for local development
// TODO: Replace with production keys when deploying to production
const PUBLISHABLE_KEY = (import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const app = (
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
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
                              <SEOProvider baseUrl="https://brokeranalysis.com">
                                <App />
                              </SEOProvider>
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
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(app);
}