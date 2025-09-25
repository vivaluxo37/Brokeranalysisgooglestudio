import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
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

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const app = (
  <React.StrictMode>
    <HashRouter>
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
    </HashRouter>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(app);
}