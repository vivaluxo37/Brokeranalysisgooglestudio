import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ComparisonProvider } from './contexts/ComparisonContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ReviewsProvider } from './contexts/ReviewsContext';
import { AlertsProvider } from './contexts/AlertsContext';
import { LanguageProvider } from './contexts/LanguageContext';

export function render(url: string) {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <ComparisonProvider>
                <FavoritesProvider>
                  <ReviewsProvider>
                    <AlertsProvider>
                      <App />
                    </AlertsProvider>
                  </ReviewsProvider>
                </FavoritesProvider>
              </ComparisonProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </StaticRouter>
    </React.StrictMode>
  );
}
