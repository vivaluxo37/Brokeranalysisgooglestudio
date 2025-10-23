import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from './components/seo/HelmetAsync';
import './src/index.css';

// Import HMR helper for debugging
import './src/utils/vite-hmr-helper';

// Import hook validation
// Temporarily disabled - file not found
// import { initializeHookValidation } from './utils/hookValidation';

// Import service worker registration
// Temporarily disabled - service worker file not found
// import * as serviceWorkerRegistration from './src/utils/serviceWorkerRegistration';

// Import performance monitoring
import { performanceMonitoring as performanceMonitor } from './services/performanceMonitoring';
import PerformanceOptimizer from './utils/performanceOptimization';

// Import dependency preloader
import './src/utils/dependencyPreloader';

// Import real App component
import App from './App';

// Import optimized providers
import OptimizedAppProviders from './contexts/OptimizedAppProviders';

// Global chunk loading error handler
window.addEventListener('error', (event) => {
  if (event.message.includes('ChunkLoadError') || event.message.includes('Loading chunk')) {
    console.warn('🔄 Chunk loading error detected, attempting refresh...');

    // Clear the problematic chunk from cache
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name.includes('clerk') || name.includes('chunk')) {
            caches.delete(name);
          }
        });
      });
    }

    // Optionally refresh the page after a short delay
    setTimeout(() => {
      if (confirm('The application needs to reload to update some components. Would you like to refresh now?')) {
        window.location.reload();
      }
    }, 1000);
  }
});

// Handle unhandled promise rejections (including chunk loading failures)
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('ChunkLoadError')) {
    console.warn('🔄 Promise rejection due to chunk loading error:', event.reason);
    event.preventDefault(); // Prevent the error from showing in console

    // Attempt to recover by clearing problematic chunks
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }
  }
});

// Initialize hook validation system
initializeHookValidation();

// Get Clerk publishable key from environment
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Removed React.StrictMode to prevent double-rendering that causes apparent reloads
const app = (
  <HelmetProvider>
    <OptimizedAppProviders publishableKey={clerkPublishableKey}>
      <App />
    </OptimizedAppProviders>
  </HelmetProvider>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(app);
}

// Initialize performance monitoring
performanceMonitor.init();

// Initialize performance optimizations
PerformanceOptimizer.getInstance().init();

// Report performance metrics after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    PerformanceOptimizer.getInstance().reportMetrics();
  }, 2000);
});

// Register service worker with proper configuration
// Temporarily disabled - service worker file not found
/* serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    console.log('[App] New content available, please refresh');
    // Show update notification
    if (confirm('A new version is available. Would you like to refresh?')) {
      window.location.reload();
    }
  },
  onSuccess: (registration) => {
    console.log('[App] Content is cached for offline use');
  },
  onError: (error) => {
    console.error('[App] Service worker registration failed:', error);
  }
}); */

// Log performance metrics for debugging
if (import.meta.env.DEV) {
  setTimeout(() => {
    const metrics = performanceMonitor.getMetrics();
    console.log('[Performance] Initial load metrics:', metrics);
  }, 5000);
}