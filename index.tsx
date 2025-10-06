import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from './components/seo/HelmetAsync';
import './src/index.css';

// Import HMR helper for debugging (temporarily disabled)
// import './src/utils/vite-hmr-helper';

// Import real App component
import App from './App';

// Import optimized providers
import AppProviders from './contexts/AppProviders';

// Get Clerk publishable key from environment
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Removed React.StrictMode to prevent double-rendering that causes apparent reloads
const app = (
  <HelmetProvider>
    <AppProviders publishableKey={clerkPublishableKey}>
      <App />
    </AppProviders>
  </HelmetProvider>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(app);
}