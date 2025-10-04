/**
 * Simplified Vite HMR Helper - Only logs errors without interfering with updates
 * This prevents the helper itself from causing reload issues
 */

if (import.meta.hot) {
  // Only log critical errors, don't intercept or modify HMR behavior
  import.meta.hot.on('vite:error', (error) => {
    console.error('❌ HMR Error:', error);
  });

  // Log when HMR connection is established
  console.log('🔧 Vite HMR connected');
}