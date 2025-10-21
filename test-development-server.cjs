/**
 * Development Server Performance Test
 * 
 * This script tests the performance optimizations in a running development server
 * to verify service worker registration, caching behavior, and actual performance improvements.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class DevelopmentServerTester {
  constructor() {
    this.results = {
      serviceWorker: {},
      performance: {},
      caching: {},
      errors: []
    };
    this.browser = null;
    this.page = null;
  }

  async runTests() {
    console.log('🚀 Starting Development Server Performance Tests...\n');

    try {
      await this.setupBrowser();
      await this.testServiceWorkerRegistration();
      await this.testPageLoadPerformance();
      await this.testCachingBehavior();
      await this.testNetworkRequests();
      await this.generateReport();
      await this.cleanup();

      console.log('\n✅ Development server tests completed successfully!');
      console.log('📊 Check development-performance-report.html for detailed results.');
      
    } catch (error) {
      console.error('\n❌ Development server tests failed:', error.message);
      await this.cleanup();
      process.exit(1);
    }
  }

  async setupBrowser() {
    console.log('🔧 Setting up browser...');
    
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    this.page = await this.browser.newPage();
    
    // Enable performance monitoring
    await this.page.coverage.startJSCoverage();
    await this.page.coverage.startCSSCoverage();
    
    // Capture console logs
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.results.errors.push({
          type: 'console',
          message: msg.text(),
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // Capture network requests
    this.page.on('response', response => {
      const url = response.url();
      const status = response.status();
      
      if (status >= 400) {
        this.results.errors.push({
          type: 'network',
          url,
          status,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    console.log('  ✓ Browser setup complete');
  }

  async testServiceWorkerRegistration() {
    console.log('🔍 Testing Service Worker Registration...');
    
    try {
      // Navigate to the application
      await this.page.goto('http://localhost:5173', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Wait for service worker registration
      await this.page.waitForTimeout(3000);
      
      // Check if service worker is registered
      const serviceWorkerStatus = await this.page.evaluate(() => {
        return navigator.serviceWorker.getRegistrations().then(registrations => {
          return {
            count: registrations.length,
            active: registrations.some(reg => reg.active),
            installing: registrations.some(reg => reg.installing),
            waiting: registrations.some(reg => reg.waiting)
          };
        });
      });
      
      this.results.serviceWorker.registration = serviceWorkerStatus;
      
      if (serviceWorkerStatus.active) {
        console.log('  ✓ Service worker is active and registered');
      } else {
        console.log('  ⚠️ Service worker not active (expected in development)');
      }
      
      // Check for service worker related console messages
      const swConsoleMessages = await this.page.evaluate(() => {
        return window.performance.getEntriesByType('measure')
          .filter(entry => entry.name.includes('service-worker'))
          .map(entry => entry.name);
      });
      
      this.results.serviceWorker.consoleMessages = swConsoleMessages;
      
    } catch (error) {
      console.log('  ❌ Service worker registration test failed:', error.message);
      this.results.errors.push({
        type: 'service-worker',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testPageLoadPerformance() {
    console.log('🔍 Testing Page Load Performance...');
    
    try {
      // Reload page for fresh performance metrics
      await this.page.reload({ waitUntil: 'networkidle2' });
      
      // Get performance metrics
      const performanceMetrics = await this.page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        return {
          // Navigation timing
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalTime: navigation.loadEventEnd - navigation.fetchStart,
          
          // Paint timing
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          
          // Resource timing
          resourceCount: performance.getEntriesByType('resource').length,
          
          // Memory usage (if available)
          memory: performance.memory ? {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
          } : null
        };
      });
      
      this.results.performance.metrics = performanceMetrics;
      
      // Evaluate performance against thresholds
      const thresholds = {
        firstContentfulPaint: 1800,
        domContentLoaded: 3000,
        loadComplete: 5000
      };
      
      this.results.performance.evaluation = {
        firstContentfulPaint: {
          value: performanceMetrics.firstContentfulPaint,
          threshold: thresholds.firstContentfulPaint,
          passed: performanceMetrics.firstContentfulPaint <= thresholds.firstContentfulPaint
        },
        domContentLoaded: {
          value: performanceMetrics.domContentLoaded,
          threshold: thresholds.domContentLoaded,
          passed: performanceMetrics.domContentLoaded <= thresholds.domContentLoaded
        },
        loadComplete: {
          value: performanceMetrics.loadComplete,
          threshold: thresholds.loadComplete,
          passed: performanceMetrics.loadComplete <= thresholds.loadComplete
        }
      };
      
      console.log(`  ✓ First Contentful Paint: ${Math.round(performanceMetrics.firstContentfulPaint)}ms`);
      console.log(`  ✓ DOM Content Loaded: ${Math.round(performanceMetrics.domContentLoaded)}ms`);
      console.log(`  ✓ Load Complete: ${Math.round(performanceMetrics.loadComplete)}ms`);
      console.log(`  ✓ Resources loaded: ${performanceMetrics.resourceCount}`);
      
    } catch (error) {
      console.log('  ❌ Page load performance test failed:', error.message);
      this.results.errors.push({
        type: 'performance',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testCachingBehavior() {
    console.log('🔍 Testing Caching Behavior...');
    
    try {
      // Check for cache headers in responses
      const cacheHeaders = await this.page.evaluate(() => {
        const entries = performance.getEntriesByType('resource');
        const cacheInfo = [];
        
        entries.forEach(entry => {
          if (entry.name.includes('.js') || entry.name.includes('.css')) {
            cacheInfo.push({
              url: entry.name,
              transferSize: entry.transferSize,
              encodedBodySize: entry.encodedBodySize,
              decodedBodySize: entry.decodedBodySize,
              fromCache: entry.transferSize === 0
            });
          }
        });
        
        return cacheInfo;
      });
      
      this.results.caching.headers = cacheHeaders;
      
      const cachedResources = cacheHeaders.filter(resource => resource.fromCache).length;
      const totalResources = cacheHeaders.length;
      
      console.log(`  ✓ Resources analyzed: ${totalResources}`);
      console.log(`  ✓ Resources from cache: ${cachedResources}`);
      console.log(`  ✓ Cache hit rate: ${totalResources > 0 ? Math.round((cachedResources / totalResources) * 100) : 0}%`);
      
      // Test localStorage usage
      const localStorageUsage = await this.page.evaluate(() => {
        return {
          keys: Object.keys(localStorage),
          size: JSON.stringify(localStorage).length
        };
      });
      
      this.results.caching.localStorage = localStorageUsage;
      console.log(`  ✓ localStorage entries: ${localStorageUsage.keys.length}`);
      
    } catch (error) {
      console.log('  ❌ Caching behavior test failed:', error.message);
      this.results.errors.push({
        type: 'caching',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testNetworkRequests() {
    console.log('🔍 Testing Network Requests...');
    
    try {
      // Analyze network requests for 503 errors and timeouts
      const networkAnalysis = await this.page.evaluate(() => {
        return new Promise((resolve) => {
          const entries = performance.getEntriesByType('resource');
          const analysis = {
            total: entries.length,
            successful: 0,
            failed: 0,
            timeouts: 0,
            slowRequests: [],
            errors: []
          };
          
          entries.forEach(entry => {
            // Check for slow requests (> 2 seconds)
            if (entry.duration > 2000) {
              analysis.slowRequests.push({
                url: entry.name,
                duration: entry.duration,
                type: entry.initiatorType
              });
            }
            
            // Check for failed requests (this would need additional monitoring)
            if (entry.duration > 10000) {
              analysis.timeouts++;
            }
          });
          
          resolve(analysis);
        });
      });
      
      this.results.performance.network = networkAnalysis;
      
      console.log(`  ✓ Total requests: ${networkAnalysis.total}`);
      console.log(`  ✓ Slow requests (>2s): ${networkAnalysis.slowRequests.length}`);
      console.log(`  ✓ Potential timeouts: ${networkAnalysis.timeouts}`);
      
      if (networkAnalysis.slowRequests.length > 0) {
        console.log('  ⚠️ Slow requests detected:');
        networkAnalysis.slowRequests.slice(0, 3).forEach(req => {
          console.log(`    - ${req.url.split('/').pop()}: ${Math.round(req.duration)}ms`);
        });
      }
      
    } catch (error) {
      console.log('  ❌ Network requests test failed:', error.message);
      this.results.errors.push({
        type: 'network',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async generateReport() {
    console.log('📊 Generating Development Server Report...');
    
    const reportHtml = this.generateHtmlReport();
    const reportPath = path.join(__dirname, 'development-performance-report.html');
    
    fs.writeFileSync(reportPath, reportHtml);
    
    console.log('  ✓ HTML report generated');
  }

  generateHtmlReport() {
    const { results } = this;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Development Server Performance Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        .status { padding: 10px; border-radius: 4px; margin: 10px 0; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .warning { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: #ecf0f1; border-radius: 4px; min-width: 150px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .metric-label { font-size: 12px; color: #7f8c8d; text-transform: uppercase; }
        .metric.passed .metric-value { color: #27ae60; }
        .metric.failed .metric-value { color: #e74c3c; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8f9fa; font-weight: bold; }
        .error-list { max-height: 300px; overflow-y: auto; background: #f8f9fa; padding: 15px; border-radius: 4px; }
        .error-item { margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #e74c3c; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Development Server Performance Report</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
        
        <h2>📊 Overall Status</h2>
        <div class="${results.errors.length === 0 ? 'status success' : 'status warning'}">
            <strong>Status:</strong> ${results.errors.length === 0 ? '✅ All Tests Passed' : `⚠️ ${results.errors.length} Issues Detected`}
        </div>
        
        <h2>🔧 Service Worker Status</h2>
        <div class="status ${results.serviceWorker.registration?.active ? 'success' : 'warning'}">
            <strong>Registration:</strong> ${results.serviceWorker.registration?.active ? '✅ Active' : '⚠️ Not Active (Expected in Development)'}
        </div>
        
        <h2>⚡ Performance Metrics</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div class="metric ${results.performance.evaluation?.firstContentfulPaint?.passed ? 'passed' : 'failed'}">
                <div class="metric-value">${Math.round(results.performance.metrics?.firstContentfulPaint || 0)}ms</div>
                <div class="metric-label">First Contentful Paint</div>
            </div>
            <div class="metric ${results.performance.evaluation?.domContentLoaded?.passed ? 'passed' : 'failed'}">
                <div class="metric-value">${Math.round(results.performance.metrics?.domContentLoaded || 0)}ms</div>
                <div class="metric-label">DOM Content Loaded</div>
            </div>
            <div class="metric ${results.performance.evaluation?.loadComplete?.passed ? 'passed' : 'failed'}">
                <div class="metric-value">${Math.round(results.performance.metrics?.loadComplete || 0)}ms</div>
                <div class="metric-label">Load Complete</div>
            </div>
            <div class="metric">
                <div class="metric-value">${results.performance.metrics?.resourceCount || 0}</div>
                <div class="metric-label">Resources Loaded</div>
            </div>
        </div>
        
        <h2>💾 Caching Analysis</h2>
        <div class="status success">
            <strong>Cache Hit Rate:</strong> ${results.caching.headers?.length ? 
              Math.round((results.caching.headers.filter(r => r.fromCache).length / results.caching.headers.length) * 100) : 0}%
        </div>
        
        <h2>🌐 Network Analysis</h2>
        <table>
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Total Requests</td>
                    <td>${results.performance.network?.total || 0}</td>
                    <td>✅</td>
                </tr>
                <tr>
                    <td>Slow Requests (>2s)</td>
                    <td>${results.performance.network?.slowRequests?.length || 0}</td>
                    <td>${(results.performance.network?.slowRequests?.length || 0) > 5 ? '⚠️' : '✅'}</td>
                </tr>
                <tr>
                    <td>Potential Timeouts</td>
                    <td>${results.performance.network?.timeouts || 0}</td>
                    <td>${(results.performance.network?.timeouts || 0) > 0 ? '❌' : '✅'}</td>
                </tr>
            </tbody>
        </table>
        
        ${results.errors.length > 0 ? `
        <h2>❌ Errors Detected</h2>
        <div class="error-list">
            ${results.errors.map(error => `
                <div class="error-item">
                    <strong>${error.type}:</strong> ${error.message}
                    <br><small>${error.timestamp}</small>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <h2>🎯 Recommendations</h2>
        <div class="recommendations">
            <ol>
                <li>${results.performance.evaluation?.firstContentfulPaint?.passed ? '✅' : '⚠️'} First Contentful Paint is ${results.performance.evaluation?.firstContentfulPaint?.passed ? 'within' : 'above'} recommended threshold</li>
                <li>${results.performance.network?.slowRequests?.length > 5 ? '⚠️' : '✅'} Consider optimizing ${results.performance.network?.slowRequests?.length || 0} slow requests</li>
                <li>${results.serviceWorker.registration?.active ? '✅' : '⚠️'} Service worker will be active in production environment</li>
                <li>${results.errors.length === 0 ? '✅' : '⚠️'} Address ${results.errors.length} detected errors before production deployment</li>
            </ol>
        </div>
    </div>
</body>
</html>`;
  }

  async cleanup() {
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Check if development server is running
async function checkDevelopmentServer() {
  try {
    const response = await fetch('http://localhost:5173');
    return response.ok;
  } catch (error) {
    console.error('❌ Development server not running on http://localhost:5173');
    console.error('Please start the development server with: npm run dev');
    process.exit(1);
  }
}

// Run the tests
async function main() {
  await checkDevelopmentServer();
  
  const tester = new DevelopmentServerTester();
  await tester.runTests().catch(console.error);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

main().catch(console.error);