// Core Web Vitals optimization utilities

interface PerformanceMetrics {
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  FCP: number; // First Contentful Paint
  TTFB: number; // Time to First Byte
}

/**
 * Image optimization utilities
 */
export const imageOptimizer = {
  // Generate responsive image srcset
  generateSrcset: (baseUrl: string, widths: number[] = [320, 640, 1024, 1920]): string => {
    return widths
      .map(width => `${baseUrl}?w=${width} ${width}w`)
      .join(', ');
  },

  // Generate optimized image URL with quality parameter
  getOptimizedUrl: (url: string, options: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
  } = {}): string => {
    const params = new URLSearchParams();
    if (options.width) params.set('w', options.width.toString());
    if (options.quality) params.set('q', options.quality.toString());
    if (options.format) params.set('fm', options.format);

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  },

  // Lazy load images with Intersection Observer
  setupLazyLoading: (): void => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.getAttribute('data-src');
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
};

/**
 * Font optimization utilities
 */
export const fontOptimizer = {
  // Preload critical fonts
  preloadFonts: (fontUrls: string[]): void => {
    fontUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  },

  // Apply font-display: swap for better perceived performance
  setupFontLoading: (): void => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/inter-regular.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: url('/fonts/inter-semibold.woff2') format('woff2');
      }
    `;
    document.head.appendChild(style);
  }
};

/**
 * Resource hints optimization
 */
export const resourceHints = {
  // Preconnect to external domains
  preconnectTo: (domains: string[]): void => {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });
  },

  // DNS-prefetch for external resources
  dnsPrefetch: (domains: string[]): void => {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  },

  // Preload critical resources
  preloadCritical: (resources: Array<{ href: string; as: string }>): void => {
    resources.forEach(({ href, as }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (as === 'font') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }
};

/**
 * Code splitting optimization
 */
export const codeSplitOptimizer = {
  // Dynamic import with retry logic
  dynamicImport: async <T>(importFn: () => Promise<T>, retries = 3): Promise<T> => {
    try {
      return await importFn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return codeSplitOptimizer.dynamicImport(importFn, retries - 1);
      }
      throw error;
    }
  },

  // Prefetch non-critical chunks
  prefetchChunks: (chunkUrls: string[]): void => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        chunkUrls.forEach(url => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = url;
          document.head.appendChild(link);
        });
      });
    }
  }
};

/**
 * Performance monitoring
 */
export const performanceMonitor = {
  // Track Core Web Vitals
  trackCoreWebVitals: (callback: (metrics: PerformanceMetrics) => void): void => {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lcp = entries[entries.length - 1];
      callback({ ...callback(), LCP: lcp.startTime });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (entry instanceof PerformanceEventTiming) {
          callback({ ...callback(), FID: entry.processingStart - entry.startTime });
        }
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach(entry => {
        if (entry && !entry.hadRecentInput) {
          clsValue += (entry as any).value;
          callback({ ...callback(), CLS: clsValue });
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });

    // First Contentful Paint
    const paintObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        callback({ ...callback(), FCP: fcp.startTime });
      }
    });

    if (PerformanceObserver.supportedEntryTypes.includes('paint')) {
      paintObserver.observe({ entryTypes: ['paint'] });
    }
  },

  // Track custom performance metrics
  trackCustomMetric: (name: string, value: number, metadata?: Record<string, any>): void => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const metric = {
        name,
        value,
        metadata,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // Send to analytics service
      if ('sendBeacon' in navigator) {
        const data = JSON.stringify(metric);
        navigator.sendBeacon('/api/performance', data);
      }

      // Log to console for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance Metric: ${name}`, metric);
      }
    }
  }
};

/**
 * Debounce utility for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle utility for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Initialize all performance optimizations
 */
export const initializePerformanceOptimizations = (): void => {
  // Initialize image lazy loading
  imageOptimizer.setupLazyLoading();

  // Setup font loading
  fontOptimizer.setupFontLoading();

  // Preconnect to critical external domains
  resourceHints.preconnectTo([
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.googletagmanager.com'
  ]);

  // DNS prefetch for external resources
  resourceHints.dnsPrefetch([
    'https://cdn.jsdelivr.net',
    'https://tradingview.com'
  ]);

  // Initialize performance monitoring
  if (process.env.NODE_ENV === 'production') {
    performanceMonitor.trackCoreWebVitals((metrics) => {
      console.log('Core Web Vitals:', metrics);

      // Track metrics in analytics
      Object.entries(metrics).forEach(([key, value]) => {
        performanceMonitor.trackCustomMetric(key, value);
      });
    });
  }
};

// Export all utilities
export default {
  imageOptimizer,
  fontOptimizer,
  resourceHints,
  codeSplitOptimizer,
  performanceMonitor,
  debounce,
  throttle,
  initializePerformanceOptimizations
};