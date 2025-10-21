const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Performance test configuration
const PERFORMANCE_CONFIG = {
  urls: [
    'http://localhost:3000',
    'http://localhost:3000/brokers',
    'http://localhost:3000/brokers/interactive-brokers',
    'http://localhost:3000/admin'
  ],
  thresholds: {
    performance: 90, // Overall performance score
    firstContentfulPaint: 1800, // ms
    largestContentfulPaint: 2500, // ms
    cumulativeLayoutShift: 0.1,
    totalBlockingTime: 300, // ms
    speedIndex: 3400, // ms
  },
  outputDir: './performance-reports',
  reports: {
    lighthouse: true,
    bundle: true,
    webVitals: true
  }
};

// Ensure output directory exists
if (!fs.existsSync(PERFORMANCE_CONFIG.outputDir)) {
  fs.mkdirSync(PERFORMANCE_CONFIG.outputDir, { recursive: true });
}

// Function to run Lighthouse audit
async function runLighthouseAudit(url) {
  console.log(`🔍 Running Lighthouse audit for: ${url}`);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportName = `lighthouse-${path.basename(url)}-${timestamp}`;
  const reportPath = path.join(PERFORMANCE_CONFIG.outputDir, `${reportName}.html`);
  const jsonPath = path.join(PERFORMANCE_CONFIG.outputDir, `${reportName}.json`);
  
  try {
    // Run Lighthouse CLI
    const lighthouseCmd = `npx lighthouse "${url}" \
      --output=html,json \
      --output-path="${path.join(PERFORMANCE_CONFIG.outputDir, reportName)}" \
      --chrome-flags="--headless" \
      --quiet \
      --only-categories=performance,accessibility,best-practices,seo`;
    
    execSync(lighthouseCmd, { stdio: 'inherit' });
    
    // Read and parse results
    const jsonResult = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    return {
      url,
      timestamp,
      reportPath,
      metrics: {
        performance: jsonResult.lhr.categories.performance.score * 100,
        firstContentfulPaint: jsonResult.lhr.audits['first-contentful-paint'].numericValue,
        largestContentfulPaint: jsonResult.lhr.audits['largest-contentful-paint'].numericValue,
        cumulativeLayoutShift: jsonResult.lhr.audits['cumulative-layout-shift'].numericValue,
        totalBlockingTime: jsonResult.lhr.audits['total-blocking-time'].numericValue,
        speedIndex: jsonResult.lhr.audits['speed-index'].numericValue,
      },
      passed: Object.entries(PERFORMANCE_CONFIG.thresholds).every(([metric, threshold]) => {
        const value = jsonResult.lhr.audits[metric]?.numericValue || 
                    jsonResult.lhr.categories[metric]?.score * 100;
        return metric === 'cumulativeLayoutShift' ? value <= threshold : value >= threshold;
      })
    };
  } catch (error) {
    console.error(`❌ Error running Lighthouse for ${url}:`, error.message);
    return null;
  }
}

// Function to analyze bundle size
function analyzeBundleSize() {
  console.log('📦 Analyzing bundle size...');
  
  try {
    const distPath = './dist/client';
    if (!fs.existsSync(distPath)) {
      console.log('⚠️  Build directory not found. Run "npm run build" first.');
      return null;
    }
    
    const stats = {};
    let totalSize = 0;
    
    // Calculate sizes for different asset types
    const assetTypes = ['js', 'css', 'png', 'jpg', 'jpeg', 'svg', 'woff', 'woff2'];
    
    assetTypes.forEach(type => {
      const pattern = new RegExp(`\\.${type}$`);
      const files = fs.readdirSync(distPath, { recursive: true })
        .filter(file => pattern.test(file));
      
      let typeSize = 0;
      files.forEach(file => {
        const filePath = path.join(distPath, file);
        if (fs.statSync(filePath).isFile()) {
          const size = fs.statSync(filePath).size;
          typeSize += size;
          totalSize += size;
        }
      });
      
      stats[type] = {
        size: typeSize,
        sizeFormatted: formatBytes(typeSize),
        count: files.length
      };
    });
    
    // Check for compressed files
    const gzippedFiles = fs.readdirSync(distPath, { recursive: true })
      .filter(file => file.endsWith('.gz'));
    const brotliFiles = fs.readdirSync(distPath, { recursive: true })
      .filter(file => file.endsWith('.br'));
    
    return {
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      byType: stats,
      compression: {
        gzip: {
          count: gzippedFiles.length,
          enabled: gzippedFiles.length > 0
        },
        brotli: {
          count: brotliFiles.length,
          enabled: brotliFiles.length > 0
        }
      }
    };
  } catch (error) {
    console.error('❌ Error analyzing bundle size:', error.message);
    return null;
  }
}

// Function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Function to generate performance report
function generateReport(results, bundleAnalysis) {
  console.log('📊 Generating performance report...');
  
  const timestamp = new Date().toISOString();
  const reportPath = path.join(PERFORMANCE_CONFIG.outputDir, `performance-report-${timestamp.replace(/[:.]/g, '-')}.json`);
  
  const report = {
    timestamp,
    config: PERFORMANCE_CONFIG,
    results,
    bundleAnalysis,
    summary: {
      totalTests: results.length,
      passedTests: results.filter(r => r && r.passed).length,
      averagePerformance: results.reduce((acc, r) => acc + (r?.metrics?.performance || 0), 0) / results.length,
      compressionEnabled: bundleAnalysis?.compression?.gzip?.enabled && bundleAnalysis?.compression?.brotli?.enabled
    }
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Generate markdown summary
  const markdownPath = path.join(PERFORMANCE_CONFIG.outputDir, `performance-summary-${timestamp.replace(/[:.]/g, '-')}.md`);
  const markdown = generateMarkdownSummary(report);
  fs.writeFileSync(markdownPath, markdown);
  
  console.log(`📄 Report saved to: ${reportPath}`);
  console.log(`📝 Summary saved to: ${markdownPath}`);
  
  return { reportPath, markdownPath };
}

// Function to generate markdown summary
function generateMarkdownSummary(report) {
  const { results, bundleAnalysis, summary } = report;
  
  let markdown = `# Performance Test Report\n\n`;
  markdown += `**Date:** ${new Date(report.timestamp).toLocaleString()}\n\n`;
  
  // Summary
  markdown += `## Summary\n\n`;
  markdown += `- **Total Tests:** ${summary.totalTests}\n`;
  markdown += `- **Passed Tests:** ${summary.passedTests}\n`;
  markdown += `- **Success Rate:** ${((summary.passedTests / summary.totalTests) * 100).toFixed(1)}%\n`;
  markdown += `- **Average Performance Score:** ${summary.averagePerformance.toFixed(1)}\n`;
  markdown += `- **Compression Enabled:** ${summary.compressionEnabled ? '✅ Yes' : '❌ No'}\n\n`;
  
  // Results by URL
  markdown += `## Test Results\n\n`;
  markdown += `| URL | Performance | FCP | LCP | CLS | TBT | Speed Index | Status |\n`;
  markdown += `|-----|-------------|-----|-----|-----|-----|-------------|--------|\n`;
  
  results.forEach(result => {
    if (!result) return;
    
    const { url, metrics, passed } = result;
    const status = passed ? '✅ Pass' : '❌ Fail';
    
    markdown += `| ${url} | ${metrics.performance.toFixed(1)} | ${metrics.firstContentfulPaint.toFixed(0)}ms | ${metrics.largestContentfulPaint.toFixed(0)}ms | ${metrics.cumulativeLayoutShift.toFixed(3)} | ${metrics.totalBlockingTime.toFixed(0)}ms | ${metrics.speedIndex.toFixed(0)}ms | ${status} |\n`;
  });
  
  // Bundle Analysis
  if (bundleAnalysis) {
    markdown += `\n## Bundle Analysis\n\n`;
    markdown += `**Total Size:** ${bundleAnalysis.totalSizeFormatted}\n\n`;
    markdown += `| Asset Type | Size | Count |\n`;
    markdown += `|-------------|------|-------|\n`;
    
    Object.entries(bundleAnalysis.byType).forEach(([type, data]) => {
      markdown += `| ${type.toUpperCase()} | ${data.sizeFormatted} | ${data.count} |\n`;
    });
    
    markdown += `\n**Compression:**\n`;
    markdown += `- Gzip: ${bundleAnalysis.compression.gzipped.enabled ? '✅ Enabled' : '❌ Disabled'} (${bundleAnalysis.compression.gzipped.count} files)\n`;
    markdown += `- Brotli: ${bundleAnalysis.compression.brotli.enabled ? '✅ Enabled' : '❌ Disabled'} (${bundleAnalysis.compression.brotli.count} files)\n`;
  }
  
  // Recommendations
  markdown += `\n## Recommendations\n\n`;
  
  if (summary.averagePerformance < 90) {
    markdown += `- **Performance:** Average performance score is below 90. Consider optimizing images, reducing bundle size, or improving server response times.\n`;
  }
  
  if (!summary.compressionEnabled) {
    markdown += `- **Compression:** Enable gzip and brotli compression to reduce file transfer sizes.\n`;
  }
  
  const failedTests = results.filter(r => r && !r.passed);
  if (failedTests.length > 0) {
    markdown += `- **Failed Tests:** ${failedTests.length} test(s) failed to meet thresholds. Review individual test results for specific issues.\n`;
  }
  
  if (bundleAnalysis && bundleAnalysis.totalSize > 1024 * 1024) { // > 1MB
    markdown += `- **Bundle Size:** Total bundle size is large. Consider code splitting, tree shaking, or removing unused dependencies.\n`;
  }
  
  return markdown;
}

// Main execution function
async function runPerformanceTests() {
  console.log('🚀 Starting performance tests...\n');
  
  // Check if dev server is running
  try {
    execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'ignore' });
    console.log('✅ Development server is running\n');
  } catch (error) {
    console.log('❌ Development server is not running. Please start it with "npm run dev"\n');
    process.exit(1);
  }
  
  // Run Lighthouse audits
  const results = [];
  for (const url of PERFORMANCE_CONFIG.urls) {
    const result = await runLighthouseAudit(url);
    if (result) {
      results.push(result);
      console.log(`✅ Completed audit for ${url}`);
      console.log(`   Performance: ${result.metrics.performance.toFixed(1)}/100`);
      console.log(`   Status: ${result.passed ? '✅ PASS' : '❌ FAIL'}\n`);
    }
  }
  
  // Analyze bundle size
  const bundleAnalysis = analyzeBundleSize();
  if (bundleAnalysis) {
    console.log(`✅ Bundle analysis completed`);
    console.log(`   Total size: ${bundleAnalysis.totalSizeFormatted}`);
    console.log(`   Compression: ${bundleAnalysis.compression.gzipped.enabled ? 'Gzip ✅' : 'Gzip ❌'} | ${bundleAnalysis.compression.brotli.enabled ? 'Brotli ✅' : 'Brotli ❌'}\n`);
  }
  
  // Generate report
  const reportPaths = generateReport(results, bundleAnalysis);
  
  console.log('🎉 Performance tests completed!');
  console.log(`📊 View detailed reports in: ${PERFORMANCE_CONFIG.outputDir}`);
  
  // Exit with error code if any tests failed
  const failedTests = results.filter(r => r && !r.passed);
  if (failedTests.length > 0) {
    console.log(`\n⚠️  ${failedTests.length} test(s) failed to meet performance thresholds`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runPerformanceTests().catch(error => {
    console.error('❌ Performance tests failed:', error);
    process.exit(1);
  });
}

module.exports = { runPerformanceTests, PERFORMANCE_CONFIG };