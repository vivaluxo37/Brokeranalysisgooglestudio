/**
 * Minimal Vite HMR Helper - Debug logging only, no interference with HMR
 * Prevents reload loops by being completely passive
 */

if (import.meta.hot && import.meta.env.DEV) {
  let hmrErrorCount = 0;
  let lastErrorTime = 0;
  
  // Throttled error logging to prevent spam
  import.meta.hot.on('vite:error', (error) => {
    const now = Date.now();
    if (now - lastErrorTime > 5000) { // Only log errors every 5 seconds
      hmrErrorCount = 0;
    }
    
    if (hmrErrorCount < 3) { // Limit to 3 errors per 5 second window
      console.warn('⚠️ HMR Error (throttled):', error?.message || error);
      hmrErrorCount++;
      lastErrorTime = now;
    }
  });

  // Single connection log
  console.log('🔧 HMR Helper: Passive monitoring active');
}