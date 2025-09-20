import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ComparisonProvider } from './contexts/ComparisonContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ReviewsProvider } from './contexts/ReviewsContext';
import { AlertsProvider } from './contexts/AlertsContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const app = (
  <React.StrictMode>
    <ReactRouterDOM.HashRouter>
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
    </ReactRouterDOM.HashRouter>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(app);
}
