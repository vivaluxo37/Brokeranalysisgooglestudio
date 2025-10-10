/**
 * Performance Optimization Utilities
 * Addresses CLS, FCP, and TTI performance issues
 */

interface PerformanceMetrics {
  cls: number;
  fcp: number;
  lcp: number;
  fid: number;
  tti: number;
}

class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private metrics: PerformanceMetrics = {
    cls: 0,
    fcp: 0,
    lcp: 0,
    fid: 0,
    tti: 0
  };

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  /**
   * Initialize performance optimizations
   */
  init(): void {
    console.log('🚀 Initializing performance optimizations...');
    
    // Fix Cumulative Layout Shift (CLS)
    this.fixLayoutShift();
    
    // Improve First Contentful Paint (FCP)
    this.optimizeFCP();
    
    // Reduce Time to Interactive (TTI)
    this.optimizeTTI();
    
    // Monitor performance metrics
    this.monitorPerformance();
  }

  /**
   * Fix Cumulative Layout Shift issues
   */
  private fixLayoutShift(): void {
    // Add appropriate dimensions to images to prevent layout shift
    const style = document.createElement('style');
    style.textContent = `
      /* Prevent layout shift by adding explicit dimensions */
      img:not([width]):not([height]) {
        aspect-ratio: 16/9;
        background-color: #f3f4f6;
      }
      
      /* Fix for TradingView widget layout shift */
      .tradingview-widget-container {
        min-height: 400px;
        background-color: #f9fafb;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      /* Prevent font loading layout shift */
      body {
        font-display: swap;
      }
      
      /* Fix skeleton loading layout shift */
      .skeleton-loader {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        min-height: 1em;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Layout shift optimizations applied');
  }

  /**
   * Optimize First Contentful Paint
   */
  private optimizeFCP(): void {
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Inline critical CSS
    this.inlineCriticalCSS();
    
    console.log('✅ FCP optimizations applied');
  }

  /**
   * Optimize Time to Interactive
   */
  private optimizeTTI(): void {
    // Defer non-critical JavaScript
    this.deferNonCriticalJS();
    
    // Optimize bundle loading
    this.optimizeBundleLoading();
    
    console.log('✅ TTI optimizations applied');
  }

  /**
   * Preload critical resources
   */
  private preloadCriticalResources(): void {
    const criticalResources = [
      // Add critical font preloads
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      // Add critical CSS
      { href: '/assets/index.css', as: 'style' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      document.head.appendChild(link);
    });
  }

  /**
   * Inline critical CSS
   */
  private inlineCriticalCSS(): void {
    const criticalCSS = `
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
      .loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }

  /**
   * Defer non-critical JavaScript
   */
  private deferNonCriticalJS(): void {
    // Use requestIdleCallback for non-critical tasks
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        // Load non-critical features when browser is idle
        this.loadNonCriticalFeatures();
      });
    }
  }

  /**
   * Optimize bundle loading
   */
  private optimizeBundleLoading(): void {
    // Implement code splitting hints for better caching
    if ('intersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Lazy load components when they come into view
            this.lazyLoadComponent(entry.target);
            observer.unobserve(entry.target);
          }
        });
      });

      // Observe lazy-load elements
      document.querySelectorAll('[data-lazy]').forEach(el => {
        observer.observe(el);
      });
    }
  }

  /**
   * Load non-critical features
   */
  private loadNonCriticalFeatures(): void {
    console.log('🔄 Loading non-critical features...');
    
    // Load analytics, chat widgets, etc.
    // This is where you would load things that don't block initial render
  }

  /**
   * Lazy load components
   */
  private lazyLoadComponent(element: Element): void {
    const componentName = element.getAttribute('data-lazy');
    if (componentName) {
      console.log(`🔄 Lazy loading component: ${componentName}`);
      // Implement component lazy loading logic here
    }
  }

  /**
   * Monitor performance metrics
   */
  private monitorPerformance(): void {
    if ('PerformanceObserver' in window) {
      // Monitor CLS
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            this.metrics.cls += (entry as any).value;
          }
        }
        console.log(`📊 CLS: ${this.metrics.cls.toFixed(3)}`);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Monitor FCP
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            console.log(`📊 FCP: ${this.metrics.fcp.toFixed(0)}ms`);
          }
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Monitor LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const lastEntry = list.getEntries().pop();
        if (lastEntry) {
          this.metrics.lcp = lastEntry.startTime;
          console.log(`📊 LCP: ${this.metrics.lcp.toFixed(0)}ms`);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor FID
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-input') {
            this.metrics.fid = (entry as any).processingStart - entry.startTime;
            console.log(`📊 FID: ${this.metrics.fid.toFixed(0)}ms`);
          }
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Report performance metrics
   */
  reportMetrics(): void {
    const metrics = this.getMetrics();
    console.log('📊 Performance Metrics Report:');
    console.log(`   CLS: ${metrics.cls.toFixed(3)} ${metrics.cls > 0.1 ? '(❌ Poor)' : metrics.cls > 0.25 ? '(❌ Needs Improvement)' : '(✅ Good)'}`);
    console.log(`   FCP: ${metrics.fcp.toFixed(0)}ms ${metrics.fcp > 3000 ? '(❌ Poor)' : metrics.fcp > 1800 ? '(❌ Needs Improvement)' : '(✅ Good)'}`);
    console.log(`   LCP: ${metrics.lcp.toFixed(0)}ms ${metrics.lcp > 4000 ? '(❌ Poor)' : metrics.lcp > 2500 ? '(❌ Needs Improvement)' : '(✅ Good)'}`);
    console.log(`   FID: ${metrics.fid.toFixed(0)}ms ${metrics.fid > 300 ? '(❌ Poor)' : metrics.fid > 100 ? '(❌ Needs Improvement)' : '(✅ Good)'}`);
  }
}

export default PerformanceOptimizer;
export { PerformanceOptimizer };
