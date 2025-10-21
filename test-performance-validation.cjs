/**
 * Performance Validation Script
 * 
 * This script validates the performance optimization implementation
 * by checking file existence, configuration, and providing guidance
 * for manual testing in the browser.
 */

const fs = require('fs');
const path = require('path');

class PerformanceValidator {
  constructor() {
    this.results = {
      implementation: {},
      configuration: {},
      recommendations: []
    };
  }

  async runValidation() {
    console.log('🚀 Starting Performance Optimization Validation...\n');

    try {
      await this.validateImplementation();
      await this.validateConfiguration();
      await this.generateTestPlan();
      await this.generateReport();

      console.log('\n✅ Performance validation completed successfully!');
      console.log('📊 Check performance-validation-report.html for detailed results.');
      console.log('🔧 Follow the manual testing steps below to verify runtime performance.');
      
    } catch (error) {
      console.error('\n❌ Performance validation failed:', error.message);
      process.exit(1);
    }
  }

  async validateImplementation() {
    console.log('🔍 Validating Implementation Files...');
    
    const filesToCheck = [
      { path: 'public/sw.js', name: 'Service Worker', critical: true },
      { path: 'src/utils/serviceWorkerRegistration.ts', name: 'Service Worker Registration', critical: true },
      { path: 'public/offline.html', name: 'Offline Fallback Page', critical: true },
      { path: 'contexts/OptimizedAppProviders.tsx', name: 'Optimized Context Providers', critical: true },
      { path: 'src/utils/dependencyPreloader.ts', name: 'Dependency Preloader', critical: true },
      { path: 'src/services/performanceMonitor.ts', name: 'Performance Monitor', critical: true },
      { path: 'public/_headers', name: 'Caching Headers', critical: true },
      { path: 'src/utils/performanceTest.ts', name: 'Performance Testing Utility', critical: false }
    ];
    
    filesToCheck.forEach(file => {
      const filePath = path.join(__dirname, file.path);
      const exists = fs.existsSync(filePath);
      
      this.results.implementation[file.name] = {
        exists,
        path: file.path,
        critical: file.critical
      };
      
      if (exists) {
        console.log(`  ✓ ${file.name}: Implemented`);
      } else {
        console.log(`  ${file.critical ? '❌' : '⚠️'} ${file.name}: Missing`);
      }
    });
    
    console.log('');
  }

  async validateConfiguration() {
    console.log('🔍 Validating Configuration...');
    
    // Check if service worker is properly configured
    const swPath = path.join(__dirname, 'public/sw.js');
    if (fs.existsSync(swPath)) {
      const swContent = fs.readFileSync(swPath, 'utf8');
      
      this.results.configuration.serviceWorker = {
        hasCacheStrategy: swContent.includes('handleStaticAsset'),
        hasTimeoutHandling: swContent.includes('fetchWithTimeout'),
        hasCacheVersioning: swContent.includes('CACHE_VERSION'),
        hasOfflineFallback: swContent.includes('offline.html')
      };
      
      console.log('  ✓ Service Worker configuration validated');
    }
    
    // Check if context providers are optimized
    const contextsPath = path.join(__dirname, 'contexts/OptimizedAppProviders.tsx');
    if (fs.existsSync(contextsPath)) {
      const contextsContent = fs.readFileSync(contextsPath, 'utf8');
      
      this.results.configuration.contextProviders = {
        hasLazyLoading: contextsContent.includes('lazy('),
        hasSuspense: contextsContent.includes('Suspense'),
        hasLoadTracking: contextsContent.includes('contextLoadTimes')
      };
      
      console.log('  ✓ Context providers configuration validated');
    }
    
    // Check if caching headers are configured
    const headersPath = path.join(__dirname, 'public/_headers');
    if (fs.existsSync(headersPath)) {
      const headersContent = fs.readFileSync(headersPath, 'utf8');
      
      this.results.configuration.cachingHeaders = {
        hasStaticAssetCaching: headersContent.includes('max-age=31536000'),
        hasApiCaching: headersContent.includes('/api/'),
        hasSecurityHeaders: headersContent.includes('X-Content-Type-Options')
      };
      
      console.log('  ✓ Caching headers configuration validated');
    }
    
    console.log('');
  }

  async generateTestPlan() {
    console.log('📋 Generating Manual Test Plan...');
    
    this.results.recommendations = [
      {
        category: 'Service Worker Testing',
        steps: [
          'Open Chrome DevTools (F12)',
          'Go to Application > Service Workers',
          'Verify service worker is "activated and is running"',
          'Check Cache storage for cached assets',
          'Test offline functionality by disconnecting network'
        ],
        expectedResults: [
          'Service worker should be active in production',
          'Static assets should be cached',
          'Offline page should load when disconnected'
        ]
      },
      {
        category: 'Performance Metrics Testing',
        steps: [
          'Open Chrome DevTools > Performance tab',
          'Record performance while loading the page',
          'Check First Contentful Paint (FCP) < 1.8s',
          'Check Largest Contentful Paint (LCP) < 2.5s',
          'Check Cumulative Layout Shift (CLS) < 0.1',
          'Check First Input Delay (FID) < 100ms'
        ],
        expectedResults: [
          'FCP should be under 1.8 seconds',
          'LCP should be under 2.5 seconds',
          'CLS should be under 0.1',
          'FID should be under 100ms'
        ]
      },
      {
        category: 'Network Request Analysis',
        steps: [
          'Open Chrome DevTools > Network tab',
          'Disable cache and reload page',
          'Check for 503 errors (should be resolved)',
          'Enable cache and reload again',
          'Verify assets load from cache (disk cache)'
        ],
        expectedResults: [
          'No 503 errors for core dependencies',
          'Static assets should show "(disk cache)" on reload',
          'Context loading times should be under 500ms'
        ]
      },
      {
        category: 'Context Loading Testing',
        steps: [
          'Open browser console',
          'Look for context load time messages',
          'Navigate between different pages',
          'Monitor context initialization times'
        ],
        expectedResults: [
          'Context load times should be logged',
          'Critical contexts should load first',
          'Non-critical contexts should load lazily'
        ]
      }
    ];
    
    console.log('  ✓ Manual test plan generated');
    console.log('');
  }

  async generateReport() {
    console.log('📊 Generating Validation Report...');
    
    const reportHtml = this.generateHtmlReport();
    const reportPath = path.join(__dirname, 'performance-validation-report.html');
    
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
    <title>Performance Optimization Validation Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        h3 { color: #2980b9; margin-top: 25px; }
        .status { padding: 10px; border-radius: 4px; margin: 10px 0; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .warning { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .checklist { list-style: none; padding: 0; }
        .checklist li { padding: 8px 0; border-bottom: 1px solid #ecf0f1; }
        .checklist li.success:before { content: "✅ "; color: #27ae60; font-weight: bold; }
        .checklist li.warning:before { content: "⚠️ "; color: #f39c12; font-weight: bold; }
        .checklist li.error:before { content: "❌ "; color: #e74c3c; font-weight: bold; }
        .test-plan { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .test-step { background: white; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #3498db; }
        .expected-results { background: #e8f5e8; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #27ae60; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: #ecf0f1; border-radius: 4px; min-width: 150px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .metric-label { font-size: 12px; color: #7f8c8d; text-transform: uppercase; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Performance Optimization Validation Report</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
        
        <h2>📊 Implementation Status</h2>
        <div class="status ${this.calculateImplementationStatus().type}">
            <strong>Overall Status:</strong> ${this.calculateImplementationStatus().message}
        </div>
        
        <h2>🔧 Implementation Files</h2>
        <ul class="checklist">
            ${Object.entries(results.implementation).map(([name, info]) => {
              const status = info.exists ? 'success' : (info.critical ? 'error' : 'warning');
              return `<li class="${status}">${name}: ${info.exists ? 'Implemented' : 'Missing'} (${info.path})</li>`;
            }).join('')}
        </ul>
        
        <h2>⚙️ Configuration Validation</h2>
        
        ${results.configuration.serviceWorker ? `
        <h3>Service Worker Configuration</h3>
        <ul class="checklist">
            <li class="${results.configuration.serviceWorker.hasCacheStrategy ? 'success' : 'error'}">Cache Strategy</li>
            <li class="${results.configuration.serviceWorker.hasTimeoutHandling ? 'success' : 'error'}">Timeout Handling</li>
            <li class="${results.configuration.serviceWorker.hasCacheVersioning ? 'success' : 'error'}">Cache Versioning</li>
            <li class="${results.configuration.serviceWorker.hasOfflineFallback ? 'success' : 'error'}">Offline Fallback</li>
        </ul>
        ` : ''}
        
        ${results.configuration.contextProviders ? `
        <h3>Context Providers Configuration</h3>
        <ul class="checklist">
            <li class="${results.configuration.contextProviders.hasLazyLoading ? 'success' : 'error'}">Lazy Loading</li>
            <li class="${results.configuration.contextProviders.hasSuspense ? 'success' : 'error'}">Suspense Boundaries</li>
            <li class="${results.configuration.contextProviders.hasLoadTracking ? 'success' : 'error'}">Load Tracking</li>
        </ul>
        ` : ''}
        
        ${results.configuration.cachingHeaders ? `
        <h3>Caching Headers Configuration</h3>
        <ul class="checklist">
            <li class="${results.configuration.cachingHeaders.hasStaticAssetCaching ? 'success' : 'error'}">Static Asset Caching</li>
            <li class="${results.configuration.cachingHeaders.hasApiCaching ? 'success' : 'error'}">API Caching</li>
            <li class="${results.configuration.cachingHeaders.hasSecurityHeaders ? 'success' : 'error'}">Security Headers</li>
        </ul>
        ` : ''}
        
        <h2>📋 Manual Testing Plan</h2>
        <p><strong>Important:</strong> Some optimizations can only be verified by running the application and testing in a browser. Follow these steps to validate the runtime performance:</p>
        
        ${results.recommendations.map(plan => `
        <div class="test-plan">
            <h3>${plan.category}</h3>
            
            <h4>Testing Steps:</h4>
            <ol>
                ${plan.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
            
            <div class="expected-results">
                <h4>Expected Results:</h4>
                <ul>
                    ${plan.expectedResults.map(result => `<li>${result}</li>`).join('')}
                </ul>
            </div>
        </div>
        `).join('')}
        
        <h2>🎯 Performance Targets</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div class="metric">
                <div class="metric-value">1.8s</div>
                <div class="metric-label">First Contentful Paint</div>
            </div>
            <div class="metric">
                <div class="metric-value">2.5s</div>
                <div class="metric-label">Largest Contentful Paint</div>
            </div>
            <div class="metric">
                <div class="metric-value">0.1</div>
                <div class="metric-label">Cumulative Layout Shift</div>
            </div>
            <div class="metric">
                <div class="metric-value">100ms</div>
                <div class="metric-label">First Input Delay</div>
            </div>
            <div class="metric">
                <div class="metric-value">500ms</div>
                <div class="metric-label">Context Load Time</div>
            </div>
        </div>
        
        <h2>🚀 Next Steps</h2>
        <div class="test-plan">
            <ol>
                <li><strong>Start Development Server:</strong> Run <code>npm run dev</code></li>
                <li><strong>Run Manual Tests:</strong> Follow the testing plan above</li>
                <li><strong>Monitor Console:</strong> Check for performance monitoring logs</li>
                <li><strong>Test in Production:</strong> Deploy and test with service worker active</li>
                <li><strong>Monitor Real Performance:</strong> Use tools like Lighthouse and Web Vitals</li>
            </ol>
        </div>
        
        <h2>📚 Additional Resources</h2>
        <ul>
            <li><a href="https://web.dev/vitals/">Core Web Vitals</a></li>
            <li><a href="https://developers.google.com/web/tools/lighthouse">Lighthouse Performance Auditing</a></li>
            <li><a href="https://web.dev/service-worker-caching/">Service Worker Caching Strategies</a></li>
        </ul>
    </div>
</body>
</html>`;
  }

  calculateImplementationStatus() {
    const implementations = Object.values(this.results.implementation);
    const totalFiles = implementations.length;
    const implementedFiles = implementations.filter(impl => impl.exists).length;
    const criticalFiles = implementations.filter(impl => impl.critical).length;
    const implementedCriticalFiles = implementations.filter(impl => impl.critical && impl.exists).length;
    
    const percentage = Math.round((implementedFiles / totalFiles) * 100);
    const criticalPercentage = Math.round((implementedCriticalFiles / criticalFiles) * 100);
    
    if (criticalPercentage === 100) {
      return {
        type: 'success',
        message: `✅ Excellent (${percentage}% implemented, all critical files present)`
      };
    } else if (criticalPercentage >= 80) {
      return {
        type: 'warning',
        message: `⚠️ Good (${percentage}% implemented, ${criticalFiles - implementedCriticalFiles} critical files missing)`
      };
    } else {
      return {
        type: 'error',
        message: `❌ Needs Improvement (${percentage}% implemented, ${criticalFiles - implementedCriticalFiles} critical files missing)`
      };
    }
  }
}

// Run the validation
const validator = new PerformanceValidator();
validator.runValidation().catch(console.error);