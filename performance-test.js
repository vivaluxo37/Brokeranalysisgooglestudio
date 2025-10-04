const { chromium } = require('playwright');

async function runPerformanceTest() {
  console.log('Starting performance analysis...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable performance monitoring
  await page.goto('http://localhost:5173');
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  
  // Get performance metrics
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      // Navigation timing
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      timeToFirstByte: navigation.responseStart - navigation.requestStart,
      
      // Paint timing
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      
      // Resource timing
      totalResources: performance.getEntriesByType('resource').length,
      
      // Memory usage (if available)
      memory: performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      } : null
    };
  });
  
  console.log('\n=== Performance Analysis Report ===');
  console.log(`Time to First Byte: ${metrics.timeToFirstByte.toFixed(2)}ms`);
  console.log(`First Paint: ${metrics.firstPaint.toFixed(2)}ms`);
  console.log(`First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
  console.log(`DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
  console.log(`Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
  console.log(`Total Resources Loaded: ${metrics.totalResources}`);
  
  if (metrics.memory) {
    console.log('\n=== Memory Usage ===');
    console.log(`Used JS Heap Size: ${(metrics.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total JS Heap Size: ${(metrics.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`JS Heap Size Limit: ${(metrics.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`);
  }
  
  // Get Core Web Vitals
  const webVitals = await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals = {};
      
      // LCP (Largest Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.lcp = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // FID (First Input Delay)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        vitals.fid = entries[0].processingStart - entries[0].startTime;
      }).observe({ entryTypes: ['first-input'] });
      
      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        vitals.cls = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
      
      // Wait a bit for metrics to be collected
      setTimeout(() => resolve(vitals), 3000);
    });
  });
  
  console.log('\n=== Core Web Vitals ===');
  console.log(`Largest Contentful Paint (LCP): ${webVitals.lcp ? webVitals.lcp.toFixed(2) + 'ms' : 'Not available'}`);
  console.log(`First Input Delay (FID): ${webVitals.fid ? webVitals.fid.toFixed(2) + 'ms' : 'Not available'}`);
  console.log(`Cumulative Layout Shift (CLS): ${webVitals.cls !== undefined ? webVitals.cls.toFixed(3) : 'Not available'}`);
  
  // Analyze bundle sizes
  const bundleAnalysis = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    const jsResources = resources.filter(r => r.name.includes('.js'));
    const cssResources = resources.filter(r => r.name.includes('.css'));
    
    return {
      js: {
        count: jsResources.length,
        totalSize: jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        largestFile: Math.max(...jsResources.map(r => r.transferSize || 0))
      },
      css: {
        count: cssResources.length,
        totalSize: cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        largestFile: Math.max(...cssResources.map(r => r.transferSize || 0))
      }
    };
  });
  
  console.log('\n=== Bundle Analysis ===');
  console.log(`JavaScript Files: ${bundleAnalysis.js.count}`);
  console.log(`Total JS Size: ${(bundleAnalysis.js.totalSize / 1024).toFixed(2)} KB`);
  console.log(`Largest JS File: ${(bundleAnalysis.js.largestFile / 1024).toFixed(2)} KB`);
  console.log(`CSS Files: ${bundleAnalysis.css.count}`);
  console.log(`Total CSS Size: ${(bundleAnalysis.css.totalSize / 1024).toFixed(2)} KB`);
  console.log(`Largest CSS File: ${(bundleAnalysis.css.largestFile / 1024).toFixed(2)} KB`);
  
  await browser.close();
  console.log('\nPerformance analysis completed!');
}

runPerformanceTest().catch(console.error);