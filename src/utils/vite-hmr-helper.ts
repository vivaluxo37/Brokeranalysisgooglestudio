// Vite HMR Helper - Loop Free Version
// This file provides hot module replacement without causing restart loops

// Prevent multiple initializations
if (typeof window !== 'undefined' && window.__hmrHelperInitialized) {
  console.log('🔄 HMR: Already initialized, skipping');
} else {
  // Mark as initialized
  if (typeof window !== 'undefined') {
    window.__hmrHelperInitialized = true;
  }

  // Check if we're in a Vite environment with HMR support
  const isNoLoopMode =
    typeof __DEV_NO_LOOP__ !== 'undefined' && __DEV_NO_LOOP__

  if (typeof import.meta !== 'undefined' && import.meta.hot && !isNoLoopMode) {
    try {
      // Only enable HMR if explicitly allowed
      const enableHMR = import.meta.env.DEV && !import.meta.env.VITE_DISABLE_HMR;
      
      if (enableHMR) {
        // Very conservative HMR setup
        console.log('🔥 HMR: Setting up conservative hot module replacement');
        
        // Accept updates only for this specific module
        if (import.meta.hot.accept) {
          import.meta.hot.accept((newModule) => {
            console.log('🔄 HMR: Module updated', newModule);
            // Don't do anything that could cause loops
          });
        }
        
        // Handle cleanup safely
        if (import.meta.hot.dispose) {
          import.meta.hot.dispose((data) => {
            console.log('🔥 HMR: Module disposed');
            // Clean up if needed
          });
        }
      } else {
        console.log('📝 HMR: Disabled in this environment');
      }
    } catch (error) {
      console.error('❌ HMR setup failed:', error);
      // Don't throw - this could cause restart loops
    }
  } else {
    console.log('📝 HMR: Not available or disabled');
  }
}

// Type declaration for global window
declare global {
  interface Window {
    __hmrHelperInitialized?: boolean;
  }
}

// Environment variable declaration
declare const __DEV_NO_LOOP__: boolean | undefined;