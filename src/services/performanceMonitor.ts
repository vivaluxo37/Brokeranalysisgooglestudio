/**
 * Performance Monitoring Service
 *
 * Tracks Core Web Vitals and custom performance metrics
 * to identify and resolve performance issues.
 */

interface PerformanceMetrics {
  // Core Web Vitals
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  timeToInteractive?: number;

  // Custom metrics
  contextLoadTime?: number;
  dependencyLoadTime?: number;
  routeChangeTime?: number;

  // Navigation metrics
  pageLoadTime?: number;
  domContentLoaded?: number;

  // Resource metrics
  resourceCount?: number;
  resourceSize?: number;

  // Timestamps
  timestamp: string;
  url: string;
  userAgent: string;
}

interface PerformanceEntry {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

class PerformanceMonitor {
  private readonly metrics: PerformanceMetrics = {
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  }

  private observers: PerformanceObserver[] = []
  private readonly isSupported = typeof window !== 'undefined' && 'performance' in window

  // Core Web Vitals thresholds
  private readonly thresholds = {
    firstContentfulPaint: { good: 1800, poor: 3000 },
    largestContentfulPaint: { good: 2500, poor: 4000 },
    firstInputDelay: { good: 100, poor: 300 },
    cumulativeLayoutShift: { good: 0.1, poor: 0.25 },
    timeToInteractive: { good: 3800, poor: 7300 },
  }

  /**
   * Initialize performance monitoring
   */
  init(): void {
    if (!this.isSupported) {
      console.warn('[Performance] Performance monitoring not supported')
      return
    }

    // Observe Core Web Vitals
    this.observeFCP()
    this.observeLCP()
    this.observeFID()
    this.observeCLS()
    this.observeTTI()

    // Track navigation timing
    this.trackNavigationTiming()

    // Track resource loading
    this.trackResourceLoading()

    // Track custom metrics
    this.trackContextLoading()
    this.trackDependencyLoading()

    // Send metrics after page load
    if (document.readyState === 'complete') {
      this.sendMetrics()
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.sendMetrics(), 1000)
      })
    }
  }

  /**
   * Observe First Contentful Paint
   */
  private observeFCP(): void {
    if (!('PerformanceObserver' in window)) {return}

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')

        if (fcpEntry) {
          this.metrics.firstContentfulPaint = fcpEntry.startTime
          console.log(`[Performance] First Contentful Paint: ${fcpEntry.startTime.toFixed(2)}ms`)
        }
      })

      observer.observe({ entryTypes: ['paint'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('[Performance] FCP observation failed:', error)
    }
  }

  /**
   * Observe Largest Contentful Paint
   */
  private observeLCP(): void {
    if (!('PerformanceObserver' in window)) {return}

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]

        if (lastEntry) {
          this.metrics.largestContentfulPaint = lastEntry.startTime
          console.log(`[Performance] Largest Contentful Paint: ${lastEntry.startTime.toFixed(2)}ms`)
        }
      })

      observer.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('[Performance] LCP observation failed:', error)
    }
  }

  /**
   * Observe First Input Delay
   */
  private observeFID(): void {
    if (!('PerformanceObserver' in window)) {return}

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime
          this.metrics.firstInputDelay = fid
          console.log(`[Performance] First Input Delay: ${fid.toFixed(2)}ms`)
        })
      })

      observer.observe({ entryTypes: ['first-input'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('[Performance] FID observation failed:', error)
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  private observeCLS(): void {
    if (!('PerformanceObserver' in window)) {return}

    try {
      let clsValue = 0

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })

        this.metrics.cumulativeLayoutShift = clsValue
        console.log(`[Performance] Cumulative Layout Shift: ${clsValue.toFixed(3)}`)
      })

      observer.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('[Performance] CLS observation failed:', error)
    }
  }

  /**
   * Observe Time to Interactive (simplified)
   */
  private observeTTI(): void {
    // TTI is complex to calculate accurately
    // This is a simplified approximation
    setTimeout(() => {
      if (performance.now) {
        this.metrics.timeToInteractive = performance.now()
        console.log(`[Performance] Time to Interactive: ${this.metrics.timeToInteractive.toFixed(2)}ms`)
      }
    }, 5000)
  }

  /**
   * Track navigation timing
   */
  private trackNavigationTiming(): void {
    if (!performance.getEntriesByType) {return}

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

    if (navigation) {
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart

      console.log(`[Performance] Page Load Time: ${this.metrics.pageLoadTime.toFixed(2)}ms`)
      console.log(`[Performance] DOM Content Loaded: ${this.metrics.domContentLoaded.toFixed(2)}ms`)
    }
  }

  /**
   * Track resource loading
   */
  private trackResourceLoading(): void {
    if (!performance.getEntriesByType) {return}

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]

    this.metrics.resourceCount = resources.length
    this.metrics.resourceSize = resources.reduce((total, resource) => {
      return total + (resource.transferSize || 0)
    }, 0)

    console.log(`[Performance] Resources loaded: ${this.metrics.resourceCount}`)
    console.log(`[Performance] Total resource size: ${(this.metrics.resourceSize / 1024).toFixed(2)}KB`)
  }

  /**
   * Track context loading time
   */
  private trackContextLoading(): void {
    // This would be called from context providers
    // We'll expose a method for context providers to report their load time
    (window as any).__reportContextLoadTime = (contextName: string, loadTime: number) => {
      console.log(`[Performance] Context ${contextName} loaded in ${loadTime.toFixed(2)}ms`)

      // Store the maximum context load time
      if (!this.metrics.contextLoadTime || loadTime > this.metrics.contextLoadTime) {
        this.metrics.contextLoadTime = loadTime
      }
    }
  }

  /**
   * Track dependency loading time
   */
  private trackDependencyLoading(): void {
    // Track when key dependencies are loaded
    const startTime = performance.now()

    // Check for React
    const checkReact = () => {
      if ((window as any).React) {
        const loadTime = performance.now() - startTime
        this.metrics.dependencyLoadTime = loadTime
        console.log(`[Performance] React loaded in ${loadTime.toFixed(2)}ms`)
      } else {
        setTimeout(checkReact, 100)
      }
    }

    checkReact()
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Get performance rating
   */
  getRating(metric: keyof PerformanceMetrics): 'good' | 'needs-improvement' | 'poor' {
    const value = this.metrics[metric] as number
    if (!value) {return 'good'}

    const threshold = this.thresholds[metric as keyof typeof this.thresholds]
    if (!threshold) {return 'good'}

    if (value <= threshold.good) {return 'good'}
    if (value <= threshold.poor) {return 'needs-improvement'}
    return 'poor'
  }

  /**
   * Send metrics to analytics
   */
  private sendMetrics(): void {
    // Send to Google Analytics if available
    if (typeof (window as any).gtag !== 'undefined') {
      const {gtag} = (window as any)
      Object.entries(this.metrics).forEach(([key, value]) => {
        if (typeof value === 'number') {
          gtag('event', 'web_vital', {
            metric_name: key,
            metric_value: value,
            metric_rating: this.getRating(key as keyof PerformanceMetrics),
            page_location: this.metrics.url,
          })
        }
      })
    }

    // Send to custom analytics endpoint
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.metrics),
    }).catch(error => {
      console.warn('[Performance] Failed to send metrics:', error)
    })

    // Log summary
    this.logSummary()
  }

  /**
   * Log performance summary
   */
  private logSummary(): void {
    console.group('[Performance] Summary')
    console.log('FCP:', `${this.metrics.firstContentfulPaint?.toFixed(2) }ms`, this.getRating('firstContentfulPaint'))
    console.log('LCP:', `${this.metrics.largestContentfulPaint?.toFixed(2) }ms`, this.getRating('largestContentfulPaint'))
    console.log('FID:', `${this.metrics.firstInputDelay?.toFixed(2) }ms`, this.getRating('firstInputDelay'))
    console.log('CLS:', this.metrics.cumulativeLayoutShift?.toFixed(3), this.getRating('cumulativeLayoutShift'))
    console.log('TTI:', `${this.metrics.timeToInteractive?.toFixed(2) }ms`, this.getRating('timeToInteractive'))
    console.log('Context Load:', `${this.metrics.contextLoadTime?.toFixed(2) }ms`)
    console.log('Page Load:', `${this.metrics.pageLoadTime?.toFixed(2) }ms`)
    console.groupEnd()
  }

  /**
   * Send metrics to analytics service
   */
  sendAnalyticsData = async (): Promise<void> => {
    try {
      // Commented out the analytics API call since it doesn't exist
      // await fetch('/api/analytics/performance', {
      // method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      // body: JSON.stringify(this.metrics),
      // console.log('📊 Analytics API not available - metrics tracked locally');
    } catch (error) {
      console.error('Failed to send analytics data:', error)
    }
  }

  /**
   * Cleanup observers
   */
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }

  /**
   * Measure custom performance mark
   */
  static mark(name: string): void {
    if (performance.mark) {
      performance.mark(name)
    }
  }

  /**
   * Measure time between marks
   */
  static measure(name: string, startMark: string, endMark?: string): number {
    if (performance.measure) {
      try {
        performance.measure(name, startMark, endMark)
        const entries = performance.getEntriesByName(name, 'measure')
        return entries[entries.length - 1]?.duration || 0
      } catch (error) {
        console.warn('[Performance] Measure failed:', error)
      }
    }
    return 0
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Export types
export type { PerformanceMetrics, PerformanceEntry }

// Auto-initialize in production
if (process.env.NODE_ENV === 'production') {
  performanceMonitor.init()
}
