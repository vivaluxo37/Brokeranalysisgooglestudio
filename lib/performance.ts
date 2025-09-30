// Performance optimization utilities
import { lazy } from 'react';

/**
 * Lazy loading wrapper with retry capability
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  name?: string
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem(`retry-lazy-refreshed-${name || 'component'}`) || 'false'
    );

    try {
      const component = await factory();
      window.sessionStorage.setItem(`retry-lazy-refreshed-${name || 'component'}`, 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Retry once by refreshing the page
        window.sessionStorage.setItem(`retry-lazy-refreshed-${name || 'component'}`, 'true');
        window.location.reload();
        throw error;
      }
      
      // If still failing, log error and rethrow
      console.error(`Failed to load component ${name || 'unknown'}:`, error);
      throw error;
    }
  });
}

/**
 * Image lazy loading with intersection observer
 */
export class ImageLazyLoader {
  private observer: IntersectionObserver | null = null;
  private images: Set<HTMLImageElement> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              this.loadImage(img);
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.01
        }
      );
    }
  }

  observe(img: HTMLImageElement) {
    if (this.observer && img.dataset.src) {
      this.images.add(img);
      this.observer.observe(img);
    }
  }

  private loadImage(img: HTMLImageElement) {
    if (img.dataset.src) {
      // Create a new image to preload
      const imageLoader = new Image();
      
      imageLoader.onload = () => {
        img.src = img.dataset.src!;
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
        delete img.dataset.src;
      };

      imageLoader.onerror = () => {
        img.classList.add('lazy-error');
      };

      img.classList.add('lazy-loading');
      imageLoader.src = img.dataset.src;
    }

    if (this.observer) {
      this.observer.unobserve(img);
      this.images.delete(img);
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.images.clear();
  }
}

/**
 * Resource prefetching utilities
 */
export class ResourcePrefetcher {
  private static instance: ResourcePrefetcher;
  private prefetchedUrls: Set<string> = new Set();

  static getInstance(): ResourcePrefetcher {
    if (!ResourcePrefetcher.instance) {
      ResourcePrefetcher.instance = new ResourcePrefetcher();
    }
    return ResourcePrefetcher.instance;
  }

  prefetchRoute(route: string) {
    if (this.prefetchedUrls.has(route) || typeof window === 'undefined') {
      return;
    }

    this.prefetchedUrls.add(route);

    // Create prefetch link
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    
    // Add to head
    document.head.appendChild(link);

    // Clean up after 30 seconds
    setTimeout(() => {
      try {
        document.head.removeChild(link);
      } catch (e) {
        // Link already removed
      }
    }, 30000);
  }

  prefetchData(url: string, priority: 'high' | 'low' = 'low') {
    if (this.prefetchedUrls.has(url) || typeof window === 'undefined') {
      return;
    }

    this.prefetchedUrls.add(url);

    // Use fetch with low priority for data prefetching
    fetch(url, {
      method: 'GET',
      priority: priority,
      mode: 'cors'
    } as any).catch(() => {
      // Ignore prefetch errors
      this.prefetchedUrls.delete(url);
    });
  }
}

/**
 * Performance metrics collection
 */
export class PerformanceMetrics {
  private static metrics: { [key: string]: number } = {};
  private static observerInitialized = false;

  static mark(name: string) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  }

  static measure(name: string, startMark: string, endMark?: string) {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        if (endMark) {
          window.performance.measure(name, startMark, endMark);
        } else {
          window.performance.measure(name, startMark);
        }

        const measure = window.performance.getEntriesByName(name, 'measure')[0];
        this.metrics[name] = measure?.duration || 0;
        
        return measure?.duration || 0;
      } catch (e) {
        console.warn('Performance measurement failed:', e);
        return 0;
      }
    }
    return 0;
  }

  static getMetrics() {
    return { ...this.metrics };
  }

  static reportWebVitals() {
    if (typeof window === 'undefined' || this.observerInitialized) return;
    this.observerInitialized = true;

    // Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const { name, value } = entry as any;
        
        // Report to analytics (replace with your analytics service)
        console.log(`Web Vital: ${name}`, value);
        
        // Store locally
        this.metrics[name] = value;

        // Send to monitoring service if available
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', name, {
            event_category: 'Web Vitals',
            event_label: name,
            value: Math.round(name === 'CLS' ? value * 1000 : value)
          });
        }
      }
    });

    try {
      // Check if web-vitals are supported
      const supportedTypes = PerformanceObserver.supportedEntryTypes || [];
      if (supportedTypes.includes('web-vital')) {
        observer.observe({ type: 'web-vital', buffered: true });
      } else {
        // Fallback to supported performance metrics
        observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
      }
    } catch (e) {
      console.warn('Performance observer not supported:', e);
    }

    // Additional performance metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
          this.metrics.loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
          this.metrics.firstPaint = performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime || 0;
          this.metrics.firstContentfulPaint = performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0;
        }
      }, 0);
    });
  }
}

/**
 * Memory management utilities
 */
export class MemoryManager {
  private static cleanupTasks: (() => void)[] = [];

  static addCleanupTask(task: () => void) {
    this.cleanupTasks.push(task);
  }

  static cleanup() {
    this.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (e) {
        console.warn('Cleanup task failed:', e);
      }
    });
    this.cleanupTasks = [];
  }

  static watchMemory() {
    if (typeof window === 'undefined' || !(window as any).performance?.memory) {
      return;
    }

    const checkMemory = () => {
      const memory = (window as any).performance.memory;
      const usage = memory.usedJSHeapSize / memory.totalJSHeapSize;
      
      // If memory usage is above 90%, trigger cleanup
      if (usage > 0.9) {
        console.warn('High memory usage detected, running cleanup');
        this.cleanup();
        
        // Force garbage collection if available
        if ((window as any).gc) {
          (window as any).gc();
        }
      }
    };

    // Check every 30 seconds
    setInterval(checkMemory, 30000);
  }
}

/**
 * Bundle optimization utilities
 */
export const BundleOptimizer = {
  preloadCriticalChunks() {
    if (typeof window === 'undefined') return;

    // Preload critical route chunks
    const criticalRoutes = [
      '/best-brokers',
      '/admin'
    ];

    criticalRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  },

  optimizeImages() {
    if (typeof window === 'undefined') return;

    // Set up image format detection
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    const supportsAVIF = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    };

    // Store format support for later use
    (window as any).__imageFormats = {
      webp: supportsWebP(),
      avif: supportsAVIF()
    };
  }
};

/**
 * Track initialization state
 */
let isInitialized = false;

/**
 * Initialize all performance optimizations
 */
export function initializePerformanceOptimizations() {
  // Prevent multiple initializations
  if (isInitialized) {
    return;
  }
  isInitialized = true;

  // Start performance monitoring
  PerformanceMetrics.reportWebVitals();
  
  // Initialize memory management
  MemoryManager.watchMemory();
  
  // Optimize bundle loading
  BundleOptimizer.preloadCriticalChunks();
  BundleOptimizer.optimizeImages();

  // Cleanup on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      MemoryManager.cleanup();
    });
  }

  console.log('Performance optimizations initialized');
}
