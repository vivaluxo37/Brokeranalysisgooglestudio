/**
 * Dependency Preloader Utility
 * 
 * Preloads critical dependencies to improve loading performance
 * and prevent 503 errors for core modules.
 */

interface PreloadConfig {
  critical: string[];
  important: string[];
  optional: string[];
}

class DependencyPreloader {
  private preloadedAssets = new Set<string>();
  private preloadQueue: Promise<void>[] = [];

  // Configuration for different dependency types
  private readonly config: PreloadConfig = {
    critical: [
      // Core React dependencies
      '/node_modules/.vite/deps/react.js',
      '/node_modules/.vite/deps/react-dom.js',
      '/node_modules/.vite/deps/react-dom_client.js'
    ],
    important: [
      // Router and navigation
      '/node_modules/.vite/deps/react-router-dom.js',
      
      // Authentication
      '/node_modules/.vite/deps/@clerk_clerk-react.js',
      
      // UI components
      '/node_modules/.vite/deps/lucide-react.js'
      // Note: @radix_ui components removed due to 404 errors
    ],
    optional: [
      // Chart libraries (commented out due to 404 errors)
      // '/node_modules/.vite/deps/chart.js',
      '/node_modules/.vite/deps/react-chartjs-2.js',
      
      // Additional UI libraries
      '/node_modules/.vite/deps/@heroicons_react.js'
      
      // Removed pattern-based vendor chunks due to 404 errors
    ]
  };

  /**
   * Initialize preloading
   */
  init(): void {
    if (typeof window === 'undefined') return;

    // Preload critical dependencies immediately
    this.preloadCritical();

    // Preload important dependencies after initial render
    requestIdleCallback(() => {
      this.preloadImportant();
    });

    // Preload optional dependencies when user is likely idle
    setTimeout(() => {
      this.preloadOptional();
    }, 3000);
  }

  /**
   * Preload critical dependencies
   */
  private preloadCritical(): void {
    console.log('[Preloader] Loading critical dependencies...');
    
    this.config.critical.forEach(url => {
      this.preloadWithFallback(url, 'high');
    });
  }

  /**
   * Preload important dependencies
   */
  private preloadImportant(): void {
    console.log('[Preloader] Loading important dependencies...');
    
    this.config.important.forEach(url => {
      this.preloadWithFallback(url, 'auto');
    });
  }

  /**
   * Preload optional dependencies
   */
  private preloadOptional(): void {
    console.log('[Preloader] Loading optional dependencies...');
    
    this.config.optional.forEach(url => {
      this.preloadWithFallback(url, 'low');
    });
  }

  /**
   * Preload a resource with fallback handling
   */
  private preloadWithFallback(url: string, priority: 'high' | 'auto' | 'low'): void {
    if (this.preloadedAssets.has(url)) return;

    const preloadPromise = this.preloadResource(url, priority)
      .then(() => {
        this.preloadedAssets.add(url);
        console.log(`[Preloader] Preloaded: ${url}`);
      })
      .catch(error => {
        console.warn(`[Preloader] Failed to preload: ${url}`, error);
        
        // Try alternative URLs for failed resources
        this.tryAlternativeUrls(url);
      });

    this.preloadQueue.push(preloadPromise);
  }

  /**
   * Preload a single resource
   */
  private preloadResource(url: string, priority: 'high' | 'auto' | 'low'): Promise<void> {
    return new Promise((resolve, reject) => {
      // Determine resource type from URL
      const resourceType = this.getResourceType(url);
      
      // Create link element for preloading
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = resourceType;
      
      // Set priority
      if (priority === 'high') {
        link.setAttribute('importance', 'high');
      } else if (priority === 'low') {
        link.setAttribute('importance', 'low');
      }

      // Set cross origin if needed
      if (url.includes('node_modules')) {
        link.crossOrigin = 'anonymous';
      }

      // Handle load and error events
      link.onload = () => {
        document.head.removeChild(link);
        resolve();
      };

      link.onerror = () => {
        document.head.removeChild(link);
        reject(new Error(`Failed to preload ${url}`));
      };

      // Add to document
      document.head.appendChild(link);

      // Set timeout for slow resources
      const timeout = setTimeout(() => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
        reject(new Error(`Timeout preloading ${url}`));
      }, 10000);

      link.onload = () => {
        clearTimeout(timeout);
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
        resolve();
      };
    });
  }

  /**
   * Get resource type from URL
   */
  private getResourceType(url: string): string {
    if (url.endsWith('.js') || url.includes('react') || url.includes('router')) {
      return 'script';
    }
    if (url.endsWith('.css')) {
      return 'style';
    }
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
      return 'image';
    }
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) {
      return 'font';
    }
    return 'script'; // Default to script
  }

  /**
   * Try alternative URLs for failed resources
   */
  private tryAlternativeUrls(originalUrl: string): void {
    const alternatives = this.generateAlternativeUrls(originalUrl);
    
    alternatives.forEach(alternative => {
      setTimeout(() => {
        this.preloadWithFallback(alternative, 'low');
      }, 1000);
    });
  }

  /**
   * Generate alternative URLs for a failed resource
   */
  private generateAlternativeUrls(url: string): string[] {
    const alternatives: string[] = [];
    
    // Try without hash
    if (url.includes('#')) {
      alternatives.push(url.split('#')[0]);
    }
    
    // Try different file extensions
    if (url.endsWith('.js')) {
      alternatives.push(url.replace('.js', '.mjs'));
    }
    
    // Try different paths
    if (url.includes('node_modules/.vite/deps/')) {
      const moduleName = url.split('node_modules/.vite/deps/')[1];
      alternatives.push(`/assets/${moduleName}`);
    }
    
    return alternatives;
  }

  /**
   * Preload a specific module dynamically
   */
  async preloadModule(moduleName: string): Promise<any> {
    try {
      // Try to import the module
      const module = await import(moduleName);
      console.log(`[Preloader] Module preloaded: ${moduleName}`);
      return module;
    } catch (error) {
      console.warn(`[Preloader] Failed to preload module: ${moduleName}`, error);
      throw error;
    }
  }

  /**
   * Check if a resource is preloaded
   */
  isPreloaded(url: string): boolean {
    return this.preloadedAssets.has(url);
  }

  /**
   * Get preloading status
   */
  getStatus(): {
    preloaded: number;
    pending: number;
    total: number;
  } {
    return {
      preloaded: this.preloadedAssets.size,
      pending: this.preloadQueue.length,
      total: this.config.critical.length + this.config.important.length + this.config.optional.length
    };
  }

  /**
   * Wait for all preloading to complete
   */
  async waitForPreload(): Promise<void> {
    await Promise.allSettled(this.preloadQueue);
  }

  /**
   * Clear preloaded resources (for testing)
   */
  clear(): void {
    this.preloadedAssets.clear();
    this.preloadQueue = [];
  }
}

// Export singleton instance
export const dependencyPreloader = new DependencyPreloader();

// Export types
export type { PreloadConfig };

// Auto-initialize
if (typeof window !== 'undefined') {
  dependencyPreloader.init();
}