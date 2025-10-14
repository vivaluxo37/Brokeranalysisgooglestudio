/**
 * Performance Optimization Service for Programmatic Pages
 * Provides lazy loading, prefetching, and resource optimization
 */

import { pageCache } from './pageCache';
import React from 'react';

interface PrefetchOptions {
  priority?: 'high' | 'medium' | 'low';
  delay?: number;
  onHover?: boolean;
  onViewport?: boolean;
}

interface ResourceOptimization {
  images: {
    lazyLoad: boolean;
    webpFallback: boolean;
    placeholder: 'blur' | 'skeleton' | 'none';
  };
  fonts: {
    preload: boolean;
    display: 'swap' | 'block' | 'fallback';
  };
  scripts: {
    defer: boolean;
    async: boolean;
    preconnect: string[];
  };
}

class PerformanceOptimizationService {
  private prefetchQueue = new Map<string, Promise<void>>();
  private intersectionObserver?: IntersectionObserver;
  private prefetchedUrls = new Set<string>();
  
  /**
   * Initialize performance optimizations
   */
  initialize(): void {
    if (typeof window === 'undefined') return;

    // Setup intersection observer for viewport-based prefetching
    this.setupIntersectionObserver();
    
    // Setup idle callback for background tasks
    this.setupIdleOptimizations();
    
    // Setup resource hints
    this.setupResourceHints();

    // Setup performance monitoring
    this.setupPerformanceMonitoring();
  }

  /**
   * Prefetch a programmatic page
   */
  async prefetchPage(
    path: string, 
    params?: Record<string, any>,
    options: PrefetchOptions = {}
  ): Promise<void> {
    const cacheKey = `${path}_${JSON.stringify(params || {})}`;
    
    // Avoid duplicate prefetching
    if (this.prefetchedUrls.has(cacheKey)) {
      return;
    }

    // Check if already in cache
    if (pageCache.has(path, params)) {
      return;
    }

    // Add to queue
    if (this.prefetchQueue.has(cacheKey)) {
      return this.prefetchQueue.get(cacheKey);
    }

    const prefetchPromise = this.executePrefetch(path, params, options);
    this.prefetchQueue.set(cacheKey, prefetchPromise);
    
    try {
      await prefetchPromise;
      this.prefetchedUrls.add(cacheKey);
    } finally {
      this.prefetchQueue.delete(cacheKey);
    }
  }

  /**
   * Execute the actual prefetch
   */
  private async executePrefetch(
    path: string,
    params?: Record<string, any>,
    options: PrefetchOptions = {}
  ): Promise<void> {
    // Add delay if specified
    if (options.delay) {
      await new Promise(resolve => setTimeout(resolve, options.delay));
    }

    // Check if user is on slow connection
    if (this.isSlowConnection()) {
      console.log('Skipping prefetch due to slow connection');
      return;
    }

    try {
      // Simulate data loading (in real app, this would fetch actual data)
      const mockData = await this.loadPageData(path, params);
      
      // Cache the prefetched data
      pageCache.set(path, mockData, {
        ttl: 30 * 60 * 1000, // 30 minutes for prefetched data
        tags: ['prefetched']
      }, params);

    } catch (error) {
      console.warn(`Prefetch failed for ${path}:`, error);
    }
  }

  /**
   * Mock data loading (replace with actual API calls)
   */
  private async loadPageData(path: string, params?: Record<string, any>): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    return {
      path,
      params,
      timestamp: Date.now(),
      mockData: `Data for ${path}`
    };
  }

  /**
   * Setup intersection observer for viewport-based optimizations
   */
  private setupIntersectionObserver(): void {
    if (!window.IntersectionObserver) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const prefetchUrl = element.dataset.prefetch;
            
            if (prefetchUrl) {
              this.prefetchPage(prefetchUrl);
            }

            // Lazy load images
            if (element.tagName === 'IMG' && element.dataset.src) {
              this.lazyLoadImage(element as HTMLImageElement);
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );
  }

  /**
   * Lazy load image
   */
  private lazyLoadImage(img: HTMLImageElement): void {
    if (img.dataset.src) {
      // Create a new image to preload
      const imageLoader = new Image();
      
      imageLoader.onload = () => {
        img.src = img.dataset.src!;
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
      };
      
      imageLoader.onerror = () => {
        img.classList.add('lazy-error');
      };
      
      imageLoader.src = img.dataset.src;
    }
  }

  /**
   * Setup idle optimizations
   */
  private setupIdleOptimizations(): void {
    if (!window.requestIdleCallback) return;

    window.requestIdleCallback(() => {
      // Preload critical routes during idle time
      this.preloadCriticalRoutes();
      
      // Clean up old cache entries
      this.cleanupCache();
      
      // Optimize images in viewport
      this.optimizeViewportImages();
    });
  }

  /**
   * Preload critical routes
   */
  private preloadCriticalRoutes(): void {
    const criticalRoutes = [
      '/best-brokers',
      '/brokers',
      '/countries',
      '/brokers/no-minimum-deposit',
      '/brokers/metatrader4-mt4',
      '/brokers/ecn-brokers'
    ];

    criticalRoutes.forEach(route => {
      if (!pageCache.has(route)) {
        this.prefetchPage(route, undefined, { priority: 'low' });
      }
    });
  }

  /**
   * Clean up old cache entries
   */
  private cleanupCache(): void {
    // This would typically clean up expired entries
    // The pageCache service handles this automatically
  }

  /**
   * Optimize images in viewport
   */
  private optimizeViewportImages(): void {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (this.intersectionObserver) {
        this.intersectionObserver.observe(img);
      }
    });
  }

  /**
   * Setup resource hints
   */
  private setupResourceHints(): void {
    // Preconnect to external resources
    const preconnectUrls = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net'
    ];

    preconnectUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      document.head.appendChild(link);
    });

    // DNS prefetch for likely destinations
    const dnsPrefetchUrls = [
      '//www.google-analytics.com',
      '//fonts.googleapis.com'
    ];

    dnsPrefetchUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    if ('web-vital' in window || typeof window.performance !== 'undefined') {
      this.monitorCoreWebVitals();
    }

    // Monitor resource loading
    this.monitorResourceLoading();
  }

  /**
   * Monitor Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay) - handled by CLS observer
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log('FID:', entry.processingStart - entry.startTime);
      }
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log('CLS:', clsValue);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Monitor resource loading
   */
  private monitorResourceLoading(): void {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.duration > 1000) { // Log slow resources
          console.warn('Slow resource:', entry.name, entry.duration);
        }
      }
    }).observe({ entryTypes: ['resource'] });
  }

  /**
   * Check if user is on slow connection
   */
  private isSlowConnection(): boolean {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection.saveData || 
             connection.effectiveType === 'slow-2g' || 
             connection.effectiveType === '2g';
    }
    return false;
  }

  /**
   * Optimize images with WebP support
   */
  optimizeImage(src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  } = {}): string {
    // In a real implementation, this would use an image optimization service
    // For now, return the original src with query parameters
    const params = new URLSearchParams();
    
    if (options.width) params.set('w', options.width.toString());
    if (options.height) params.set('h', options.height.toString());
    if (options.quality) params.set('q', options.quality.toString());
    if (options.format) params.set('f', options.format);

    return `${src}${params.toString() ? '?' + params.toString() : ''}`;
  }

  /**
   * Create optimized resource loading configuration
   */
  getResourceOptimization(): ResourceOptimization {
    return {
      images: {
        lazyLoad: true,
        webpFallback: true,
        placeholder: 'skeleton'
      },
      fonts: {
        preload: true,
        display: 'swap'
      },
      scripts: {
        defer: true,
        async: false,
        preconnect: [
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com'
        ]
      }
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): {
    cacheHitRate: number;
    prefetchedPages: number;
    averageLoadTime: number;
  } {
    return {
      cacheHitRate: 0.85, // Would be calculated from actual metrics
      prefetchedPages: this.prefetchedUrls.size,
      averageLoadTime: 0 // Would be calculated from actual timing data
    };
  }
}

// Singleton instance
export const performanceOptimization = new PerformanceOptimizationService();

// React hook for performance optimizations
export function usePerformanceOptimization() {
  React.useEffect(() => {
    performanceOptimization.initialize();
  }, []);

  return {
    prefetchPage: performanceOptimization.prefetchPage.bind(performanceOptimization),
    optimizeImage: performanceOptimization.optimizeImage.bind(performanceOptimization),
    getMetrics: performanceOptimization.getPerformanceMetrics.bind(performanceOptimization)
  };
}

// Utility functions for programmatic pages
export const PageOptimization = {
  /**
   * Generate optimized meta tags for programmatic pages
   */
  generateMetaTags(config: {
    title: string;
    description: string;
    canonical: string;
    image?: string;
    type?: string;
  }): Array<{ name?: string; property?: string; content: string }> {
    const tags = [
      { name: 'description', content: config.description },
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:url', content: config.canonical },
      { property: 'og:type', content: config.type || 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: config.title },
      { name: 'twitter:description', content: config.description }
    ];

    if (config.image) {
      tags.push(
        { property: 'og:image', content: config.image },
        { name: 'twitter:image', content: config.image }
      );
    }

    return tags;
  },

  /**
   * Generate JSON-LD structured data
   */
  generateStructuredData(type: 'FAQPage' | 'BreadcrumbList' | 'ItemList', data: any): string {
    const baseStructure = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    };

    return JSON.stringify(baseStructure);
  }
};