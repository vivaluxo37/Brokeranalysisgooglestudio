// Simple test to check for infinite reload loops
console.log('🔍 Testing for infinite reload loops...');

let reloadCount = 0;
const maxReloads = 10;

// Track page loads
if (typeof window !== 'undefined') {
  const originalReload = window.location.reload;

  window.location.reload = function() {
    console.warn(`🔄 Page reload detected! Count: ${++reloadCount}`);
    if (reloadCount > maxReloads) {
      console.error('❌ Infinite reload loop detected!');
      return;
    }
    return originalReload.call(this);
  };
}

// Check for navigation changes
if (typeof window !== 'undefined' && 'navigation' in window) {
  window.addEventListener('beforeunload', () => {
    console.log('📄 Page unloading...');
  });

  window.addEventListener('load', () => {
    console.log('✅ Page loaded successfully!');

    // Check for common issues
    setTimeout(() => {
      const hasError = console.error.toString().includes('Error');
      if (hasError) {
        console.warn('⚠️ There might be errors in the console');
      } else {
        console.log('✅ No obvious errors detected');
      }
    }, 5000);
  });
}