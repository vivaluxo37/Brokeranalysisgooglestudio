import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ComparisonProvider } from './contexts/ComparisonContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

export function render(url: string) {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <ThemeProvider>
          <AuthProvider>
            <ComparisonProvider>
              <FavoritesProvider>
                <App />
              </FavoritesProvider>
            </ComparisonProvider>
          </AuthProvider>
        </ThemeProvider>
      </StaticRouter>
    </React.StrictMode>
  );
}
