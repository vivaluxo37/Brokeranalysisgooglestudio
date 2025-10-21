/**
 * Performance Testing Utility
 *
 * Provides tools to test and validate performance improvements
 * including load time measurements and bottleneck identification.
 */

interface PerformanceTestResult {
  testName: string;
  duration: number;
  startTime: number;
  endTime: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

interface LoadTestResult {
  totalLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  resourceLoadTimes: Array<{
    name: string;
    duration: number;
    size: number;
  }>;
  contextLoadTimes: Array<{
    name: string;
    duration: number;
  }>;
  bottleneck: string;
  recommendations: string[];
}

class PerformanceTest {
  private tests: PerformanceTestResult[] = []
  private startTime: number = 0

  /**
   * Start performance testing
   */
  start(): void {
    this.startTime = performance.now()
    console.log('[Performance Test] Starting performance tests...')
  }

  /**
   * Measure a specific operation
   */
  async measure<T>(
    testName: string,
    operation: () => Promise<T> | T,
    metadata?: Record<string, any>,
  ): Promise<{ result: T; duration: number }> {
    const startTime = performance.now()

    try {
      const result = await operation()
      const endTime = performance.now()
      const duration = endTime - startTime

      this.tests.push({
        testName,
        duration,
        startTime,
        endTime,
        success: true,
        metadata,
      })

      console.log(`[Performance Test] ${testName}: ${duration.toFixed(2)}ms`)
      return { result, duration }
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime

      this.tests.push({
        testName,
        duration,
        startTime,
        endTime,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata,
      })

      console.error(`[Performance Test] ${testName} failed:`, error)
      throw error
    }
  }

  /**
   * Run comprehensive load test
   */
  async runLoadTest(): Promise<LoadTestResult> {
    console.log('[Performance Test] Running comprehensive load test...')

    const result: LoadTestResult = {
      totalLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      resourceLoadTimes: [],
      contextLoadTimes: [],
      bottleneck: '',
      recommendations: [],
    }

    // Wait for page to fully load
    await this.waitForPageLoad()

    // Get navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      result.totalLoadTime = navigation.loadEventEnd - navigation.fetchStart
    }

    // Get Core Web Vitals
    result.firstContentfulPaint = this.getFCP()
    result.largestContentfulPaint = this.getLCP()
    result.firstInputDelay = this.getFID()
    result.cumulativeLayoutShift = this.getCLS()

    // Analyze resource loading
    result.resourceLoadTimes = this.analyzeResourceLoadTimes()

    // Analyze context loading
    result.contextLoadTimes = this.analyzeContextLoadTimes()

    // Identify bottlenecks
    result.bottleneck = this.identifyBottleneck(result)

    // Generate recommendations
    result.recommendations = this.generateRecommendations(result)

    console.log('[Performance Test] Load test completed:', result)
    return result
  }

  /**
   * Wait for page to fully load
   */
  private async waitForPageLoad(): Promise<void> {
    return new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve()
      } else {
        window.addEventListener('load', () => {
          setTimeout(resolve, 1000) // Extra delay for dynamic content
        })
      }
    })
  }

  /**
   * Get First Contentful Paint
   */
  private getFCP(): number {
    const paintEntries = performance.getEntriesByType('paint')
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    return fcpEntry ? fcpEntry.startTime : 0
  }

  /**
   * Get Largest Contentful Paint
   */
  private getLCP(): number {
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
    return lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : 0
  }

  /**
   * Get First Input Delay
   */
  private getFID(): number {
    const fidEntries = performance.getEntriesByType('first-input')
    return fidEntries.length > 0 ? (fidEntries[0] as any).processingStart - fidEntries[0].startTime : 0
  }

  /**
   * Get Cumulative Layout Shift
   */
  private getCLS(): number {
    let clsValue = 0
    const clsEntries = performance.getEntriesByType('layout-shift')
    clsEntries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value
      }
    })
    return clsValue
  }

  /**
   * Analyze resource load times
   */
  private analyzeResourceLoadTimes(): Array<{ name: string; duration: number; size: number }> {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]

    return resources
      .filter(resource => resource.transferSize > 0)
      .map(resource => ({
        name: resource.name.split('/').pop() || resource.name,
        duration: resource.responseEnd - resource.requestStart,
        size: resource.transferSize,
      }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10) // Top 10 slowest resources
  }

  /**
   * Analyze context load times
   */
  private analyzeContextLoadTimes(): Array<{ name: string; duration: number }> {
    // This would be populated by context providers reporting their load times
    const contextLoadTimes: Array<{ name: string; duration: number }> = []

    // Check if any context providers reported their load times
    if ((window as any).__contextLoadTimes) {
      Object.entries((window as any).__contextLoadTimes).forEach(([name, duration]) => {
        contextLoadTimes.push({ name, duration: Number(duration) })
      })
    }

    return contextLoadTimes.sort((a, b) => b.duration - a.duration)
  }

  /**
   * Identify performance bottleneck
   */
  private identifyBottleneck(result: LoadTestResult): string {
    const bottlenecks: Array<{ type: string; impact: number }> = []

    // Check Core Web Vitals
    if (result.firstContentfulPaint > 1800) {
      bottlenecks.push({ type: 'First Contentful Paint', impact: result.firstContentfulPaint })
    }
    if (result.largestContentfulPaint > 2500) {
      bottlenecks.push({ type: 'Largest Contentful Paint', impact: result.largestContentfulPaint })
    }
    if (result.firstInputDelay > 100) {
      bottlenecks.push({ type: 'First Input Delay', impact: result.firstInputDelay })
    }
    if (result.cumulativeLayoutShift > 0.1) {
      bottlenecks.push({ type: 'Cumulative Layout Shift', impact: result.cumulativeLayoutShift * 1000 })
    }

    // Check resource loading
    const slowestResource = result.resourceLoadTimes[0]
    if (slowestResource && slowestResource.duration > 1000) {
      bottlenecks.push({
        type: `Slow Resource (${slowestResource.name})`,
        impact: slowestResource.duration,
      })
    }

    // Check context loading
    const slowestContext = result.contextLoadTimes[0]
    if (slowestContext && slowestContext.duration > 500) {
      bottlenecks.push({
        type: `Slow Context (${slowestContext.name})`,
        impact: slowestContext.duration,
      })
    }

    // Return the bottleneck with highest impact
    if (bottlenecks.length > 0) {
      bottlenecks.sort((a, b) => b.impact - a.impact)
      return bottlenecks[0].type
    }

    return 'No significant bottlenecks identified'
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(result: LoadTestResult): string[] {
    const recommendations: string[] = []

    // Core Web Vitals recommendations
    if (result.firstContentfulPaint > 1800) {
      recommendations.push('Optimize initial HTML and critical CSS to improve First Contentful Paint')
    }
    if (result.largestContentfulPaint > 2500) {
      recommendations.push('Optimize images and lazy load non-critical content to improve LCP')
    }
    if (result.firstInputDelay > 100) {
      recommendations.push('Reduce JavaScript execution time and break up long tasks')
    }
    if (result.cumulativeLayoutShift > 0.1) {
      recommendations.push('Include size attributes for images and avoid dynamic content shifts')
    }

    // Resource loading recommendations
    const slowResources = result.resourceLoadTimes.filter(r => r.duration > 500)
    if (slowResources.length > 0) {
      recommendations.push(`Optimize ${slowResources.length} slow resources (${slowResources.map(r => r.name).join(', ')})`)
    }

    // Context loading recommendations
    const slowContexts = result.contextLoadTimes.filter(c => c.duration > 300)
    if (slowContexts.length > 0) {
      recommendations.push(`Consider lazy loading ${slowContexts.length} slow contexts (${slowContexts.map(c => c.name).join(', ')})`)
    }

    // General recommendations
    if (result.totalLoadTime > 3000) {
      recommendations.push('Consider code splitting and lazy loading to reduce total load time')
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance is excellent! Consider monitoring for regressions.')
    }

    return recommendations
  }

  /**
   * Get test results
   */
  getResults(): PerformanceTestResult[] {
    return [...this.tests]
  }

  /**
   * Clear test results
   */
  clear(): void {
    this.tests = []
    this.startTime = 0
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const report = [
      '# Performance Test Report',
      `Generated: ${new Date().toISOString()}`,
      '',
      '## Test Results',
      ...this.tests.map(test =>
        `- ${test.testName}: ${test.success ? `${test.duration.toFixed(2) }ms` : 'FAILED'}`,
      ),
      '',
      '## Summary',
      `Total tests: ${this.tests.length}`,
      `Successful: ${this.tests.filter(t => t.success).length}`,
      `Failed: ${this.tests.filter(t => !t.success).length}`,
      `Total duration: ${(performance.now() - this.startTime).toFixed(2)}ms`,
    ]

    return report.join('\n')
  }
}

// Export singleton instance
export const performanceTest = new PerformanceTest()

// Export types
export type { PerformanceTestResult, LoadTestResult }

// Utility function for context providers to report load times
export function reportContextLoadTime(contextName: string, loadTime: number): void {
  if (!(window as any).__contextLoadTimes) {
    (window as any).__contextLoadTimes = {}
  }
  (window as any).__contextLoadTimes[contextName] = loadTime
  console.log(`[Performance] Context ${contextName} loaded in ${loadTime.toFixed(2)}ms`)
}
