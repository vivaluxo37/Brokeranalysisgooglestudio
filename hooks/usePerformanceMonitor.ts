import { useEffect, useRef, useCallback, useState } from 'react'

interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte

  // Custom metrics
  renderTime?: number;
  componentMountTime?: number;
  interactionTime?: number;

  // Resource metrics
  resourceCount?: number;
  totalResourceSize?: number;

  // Memory usage (if available)
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

interface PerformanceEntry {
  name: string;
  value: number;
  timestamp: number;
  threshold?: number | undefined;
  status: 'good' | 'needs-improvement' | 'poor';
}

interface UsePerformanceMonitorOptions {
  enableCoreWebVitals?: boolean;
  enableCustomMetrics?: boolean;
  enableResourceMonitoring?: boolean;
  enableMemoryMonitoring?: boolean;
  thresholds?: {
    fcp?: { good: number; poor: number };
    lcp?: { good: number; poor: number };
    fid?: { good: number; poor: number };
    cls?: { good: number; poor: number };
    ttfb?: { good: number; poor: number };
    renderTime?: { good: number; poor: number };
    interactionTime?: { good: number; poor: number };
  };
  onMetricUpdate?: (metrics: PerformanceEntry[]) => void;
  sendToAnalytics?: (metrics: PerformanceMetrics) => void;
}

const DEFAULT_THRESHOLDS = {
  fcp: { good: 1800, poor: 3000 }, // ms
  lcp: { good: 2500, poor: 4000 }, // ms
  fid: { good: 100, poor: 300 }, // ms
  cls: { good: 0.1, poor: 0.25 }, // score
  ttfb: { good: 800, poor: 1800 }, // ms
  renderTime: { good: 100, poor: 300 }, // ms
  interactionTime: { good: 200, poor: 500 }, // ms
}

export function usePerformanceMonitor(options: UsePerformanceMonitorOptions = {}) {
  const {
    enableCoreWebVitals = true,
    enableCustomMetrics = true,
    enableResourceMonitoring = true,
    enableMemoryMonitoring = true,
    thresholds = {},
    onMetricUpdate,
    sendToAnalytics,
  } = options

  const [metrics, setMetrics] = useState<PerformanceEntry[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const mountTimeRef = useRef<number>(Date.now())
  const observerRefs = useRef<{
    performanceObserver?: PerformanceObserver;
    mutationObserver?: MutationObserver;
    resizeObserver?: ResizeObserver;
  }>({})

  // Merge thresholds with defaults
  const mergedThresholds = { ...DEFAULT_THRESHOLDS, ...thresholds }

  // Evaluate metric status based on thresholds
  const evaluateMetricStatus = useCallback((name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const threshold = mergedThresholds[name as keyof typeof mergedThresholds]
    if (!threshold || typeof threshold === 'number') {return 'good'}

    if (value <= threshold.good) {return 'good'}
    if (value <= threshold.poor) {return 'needs-improvement'}
    return 'poor'
  }, [mergedThresholds])

  // Add metric to state
  const addMetric = useCallback((name: string, value: number, timestamp?: number) => {
    const threshold = mergedThresholds[name as keyof typeof mergedThresholds]
    const status = evaluateMetricStatus(name, value)

    const entry: PerformanceEntry = {
      name,
      value,
      timestamp: timestamp || Date.now(),
      ...(threshold && typeof threshold === 'object' ? { threshold: threshold.good } : {}),
      status,
    }

    setMetrics(prev => {
      const existingIndex = prev.findIndex(m => m.name === name)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = entry
        return updated
      }
      return [...prev, entry]
    })

    onMetricUpdate?.([entry])
  }, [evaluateMetricStatus, mergedThresholds, onMetricUpdate])

  // Measure Core Web Vitals
  const measureCoreWebVitals = useCallback(() => {
    if (!enableCoreWebVitals || typeof window === 'undefined') {return}

    // First Contentful Paint
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformancePaintTiming
    if (fcpEntry) {
      addMetric('fcp', fcpEntry.startTime)
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformancePaintTiming
        if (lastEntry) {
          addMetric('lcp', lastEntry.startTime)
        }
      })

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        observerRefs.current.performanceObserver = lcpObserver
      } catch (e) {
        console.warn('LCP observer not supported')
      }
    }

    // First Input Delay
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const eventTiming = entry as PerformanceEventTiming
          if (eventTiming.processingStart && eventTiming.startTime) {
            addMetric('fid', eventTiming.processingStart - eventTiming.startTime)
          }
        })
      })

      try {
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        console.warn('FID observer not supported')
      }
    }

    // Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            addMetric('cls', clsValue)
          }
        })
      })

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.warn('CLS observer not supported')
      }
    }

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      addMetric('ttfb', navigationEntry.responseStart - navigationEntry.requestStart)
    }
  }, [enableCoreWebVitals, addMetric])

  // Measure custom metrics
  const measureCustomMetrics = useCallback(() => {
    if (!enableCustomMetrics) {return}

    // Component mount time
    const mountTime = Date.now() - mountTimeRef.current
    addMetric('componentMountTime', mountTime)

    // Render time (approximation)
    if (performance.mark) {
      performance.mark('render-start')
      requestAnimationFrame(() => {
        performance.mark('render-end')
        performance.measure('render-time', 'render-start', 'render-end')
        const measure = performance.getEntriesByName('render-time')[0]
        if (measure) {
          addMetric('renderTime', measure.duration)
        }
      })
    }
  }, [enableCustomMetrics, addMetric])

  // Measure resource metrics
  const measureResourceMetrics = useCallback(() => {
    if (!enableResourceMonitoring) {return}

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const totalSize = resources.reduce((acc, resource) => {
      return acc + (resource.transferSize || 0)
    }, 0)

    addMetric('resourceCount', resources.length)
    addMetric('totalResourceSize', totalSize)
  }, [enableResourceMonitoring, addMetric])

  // Measure memory usage
  const measureMemoryUsage = useCallback(() => {
    if (!enableMemoryMonitoring) {return}

    if ('memory' in performance) {
      const {memory} = (performance as any)
      addMetric('usedJSHeapSize', memory.usedJSHeapSize)
      addMetric('totalJSHeapSize', memory.totalJSHeapSize)
      addMetric('jsHeapSizeLimit', memory.jsHeapSizeLimit)
    }
  }, [enableMemoryMonitoring, addMetric])

  // Measure interaction time
  const measureInteraction = useCallback((startTime: number) => {
    const endTime = performance.now()
    const interactionTime = endTime - startTime
    addMetric('interactionTime', interactionTime)
    return interactionTime
  }, [addMetric])

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (isMonitoring || typeof window === 'undefined') {return}

    setIsMonitoring(true)

    // Start all measurements
    measureCoreWebVitals()
    measureCustomMetrics()

    // Delay resource and memory measurements slightly
    setTimeout(() => {
      measureResourceMetrics()
      measureMemoryUsage()
    }, 1000)
  }, [isMonitoring, measureCoreWebVitals, measureCustomMetrics, measureResourceMetrics, measureMemoryUsage])

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)

    // Clean up observers
    Object.values(observerRefs.current).forEach(observer => {
      if (observer && 'disconnect' in observer) {
        observer.disconnect()
      }
    })
  }, [])

  // Get current metrics as PerformanceMetrics object
  const getCurrentMetrics = useCallback((): PerformanceMetrics => {
    const metricsObj: PerformanceMetrics = {}

    metrics.forEach(metric => {
      (metricsObj as any)[metric.name] = metric.value
    })

    return metricsObj
  }, [metrics])

  // Send metrics to analytics
  const sendMetrics = useCallback(() => {
    const currentMetrics = getCurrentMetrics()
    sendToAnalytics?.(currentMetrics)
  }, [getCurrentMetrics, sendToAnalytics])

  // Auto-start monitoring on mount
  useEffect(() => {
    startMonitoring()

    return () => {
      stopMonitoring()
    }
  }, [startMonitoring, stopMonitoring])

  // Send metrics periodically if analytics function is provided
  useEffect(() => {
    if (!sendToAnalytics || !isMonitoring) {return}

    const interval = setInterval(sendMetrics, 30000) // Send every 30 seconds

    return () => clearInterval(interval)
  }, [sendToAnalytics, isMonitoring, sendMetrics])

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    measureInteraction,
    getCurrentMetrics,
    sendMetrics,

    // Convenience getters for important metrics
    getFCP: () => metrics.find(m => m.name === 'fcp'),
    getLCP: () => metrics.find(m => m.name === 'lcp'),
    getFID: () => metrics.find(m => m.name === 'fid'),
    getCLS: () => metrics.find(m => m.name === 'cls'),
    getTTFB: () => metrics.find(m => m.name === 'ttfb'),
    getRenderTime: () => metrics.find(m => m.name === 'renderTime'),
    getInteractionTime: () => metrics.find(m => m.name === 'interactionTime'),
  }
}

// Hook for measuring component-specific performance
export function useComponentPerformance(componentName: string) {
  const renderStartTime = useRef<number | undefined>(undefined)
  const mountTime = useRef<number>(Date.now())

  const [renderCount, setRenderCount] = useState(0)
  const [totalRenderTime, setTotalRenderTime] = useState(0)

  // Start render measurement
  const startRender = useCallback(() => {
    renderStartTime.current = performance.now()
  }, [])

  // End render measurement
  const endRender = useCallback(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current
      setTotalRenderTime(prev => prev + renderTime)
      setRenderCount(prev => prev + 1)

      // Log render performance
      console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`)

      renderStartTime.current = undefined
    }
  }, [componentName])

  // Get average render time
  const getAverageRenderTime = useCallback(() => {
    return renderCount > 0 ? totalRenderTime / renderCount : 0
  }, [renderCount, totalRenderTime])

  // Get component age
  const getComponentAge = useCallback(() => {
    return Date.now() - mountTime.current
  }, [])

  return {
    startRender,
    endRender,
    renderCount,
    totalRenderTime,
    averageRenderTime: getAverageRenderTime(),
    componentAge: getComponentAge(),
  }
}
