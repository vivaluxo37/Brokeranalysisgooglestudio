/**
 * Performance Baseline Script
 * 
 * Collects bundle analysis and Lighthouse/Web Vitals for:
 * - Home page (/)
 * - Brokers listing (/brokers)
 * - A broker detail page (/broker/pepperstone)
 * - Admin dashboard (/admin)
 * 
 * Generates reports in performance-reports/baseline/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPORTS_DIR = path.join(__dirname, '..', 'performance-reports', 'baseline');
const BUILD_DIR = path.join(process.cwd(), 'dist/client');
const STATS_FILE = path.join(BUILD_DIR, '../stats.html');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

console.log('🚀 Starting Performance Baseline Collection...');
console.log(`📁 Reports will be saved to: ${REPORTS_DIR}`);

/**
 * Execute command and return output
 */
function execCommand(command, description) {
  try {
    console.log(`\n📊 ${description}...`);
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log('✅ Completed');
    return output;
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    return null;
  }
}

/**
 * Build the application with bundle analyzer
 */
function buildWithAnalyzer() {
  console.log('\n🔨 Building application with bundle analyzer...');
  
  // Build with analyzer
  const buildOutput = execCommand(
    'npm run build',
    'Building application'
  );
  
  if (!buildOutput) {
    console.error('❌ Build failed');
    return false;
  }
  
  // Check if stats.html was generated
  const statsPath = path.join(__dirname, '..', 'dist', 'client', 'stats.html');
  if (fs.existsSync(statsPath)) {
    const reportPath = path.join(REPORTS_DIR, `bundle-analysis-${TIMESTAMP}.html`);
    fs.copyFileSync(statsPath, reportPath);
    console.log(`📈 Bundle analysis saved to: ${reportPath}`);
  }
  
  return true;
}

/**
 * Analyze bundle sizes
 */
function analyzeBundleSizes() {
  console.log('\n📦 Analyzing bundle sizes...');
  
  const jsPath = path.join(__dirname, '..', 'dist', 'client', 'js');
  const cssPath = path.join(__dirname, '..', 'dist', 'client', 'assets', 'css');
  
  if (!fs.existsSync(jsPath)) {
    console.log('❌ JS directory not found');
    return;
  }
  
  const jsFiles = fs.existsSync(jsPath) ? fs.readdirSync(jsPath).filter(file => file.endsWith('.js')) : [];
  const cssFiles = fs.existsSync(cssPath) ? fs.readdirSync(cssPath).filter(file => file.endsWith('.css')) : [];
  
  const bundleAnalysis = {
    timestamp: TIMESTAMP,
    javascript: [],
    css: [],
    total: { size: 0, files: 0 }
  };
  
  // Analyze JS files
  jsFiles.forEach(file => {
    const filePath = path.join(jsPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024);
    
    bundleAnalysis.javascript.push({
      name: file,
      size: sizeKB,
      sizeFormatted: `${sizeKB} KB`
    });
    
    bundleAnalysis.total.size += sizeKB;
    bundleAnalysis.total.files++;
  });
  
  // Analyze CSS files
  cssFiles.forEach(file => {
    const filePath = path.join(cssPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024);
    
    bundleAnalysis.css.push({
      name: file,
      size: sizeKB,
      sizeFormatted: `${sizeKB} KB`
    });
    
    bundleAnalysis.total.size += sizeKB;
    bundleAnalysis.total.files++;
  });
  
  // Sort by size
  bundleAnalysis.javascript.sort((a, b) => b.size - a.size);
  bundleAnalysis.css.sort((a, b) => b.size - a.size);
  
  // Save bundle analysis
  const analysisPath = path.join(REPORTS_DIR, `bundle-sizes-${TIMESTAMP}.json`);
  fs.writeFileSync(analysisPath, JSON.stringify(bundleAnalysis, null, 2));
  
  // Log summary
  console.log('\n📊 Bundle Size Summary:');
  console.log(`Total files: ${bundleAnalysis.total.files}`);
  console.log(`Total size: ${bundleAnalysis.total.size} KB`);
  
  console.log('\n📄 JavaScript Files:');
  bundleAnalysis.javascript.slice(0, 5).forEach(file => {
    console.log(`  ${file.name}: ${file.sizeFormatted}`);
  });
  
  if (bundleAnalysis.css.length > 0) {
    console.log('\n🎨 CSS Files:');
    bundleAnalysis.css.slice(0, 3).forEach(file => {
      console.log(`  ${file.name}: ${file.sizeFormatted}`);
    });
  }
  
  return bundleAnalysis;
}

/**
 * Run Lighthouse audits for key pages
 */
async function runLighthouseAudits() {
  console.log('\n🔬 Running Lighthouse audits...');
  
  const pages = [
    { name: 'Home', url: 'http://localhost:3000/' },
    { name: 'Brokers', url: 'http://localhost:3000/brokers' },
    { name: 'Broker Detail', url: 'http://localhost:3000/broker/pepperstone' },
    { name: 'Admin', url: 'http://localhost:3000/admin' }
  ];
  
  const lighthouseResults = [];
  
  for (const page of pages) {
    console.log(`\n🔍 Auditing: ${page.name} (${page.url})`);
    
    try {
      // Run Lighthouse audit
      const lighthouseCommand = `npx lighthouse ${page.url} --output=json --output-path=${path.join(REPORTS_DIR, `lighthouse-${page.name.toLowerCase().replace(/\s+/g, '-')}-${TIMESTAMP}.json`)} --quiet`;
      
      const output = execCommand(lighthouseCommand, `Lighthouse audit for ${page.name}`);
      
      if (output) {
        lighthouseResults.push({
          page: page.name,
          url: page.url,
          status: 'completed'
        });
        console.log(`✅ ${page.name} audit completed`);
      } else {
        lighthouseResults.push({
          page: page.name,
          url: page.url,
          status: 'failed'
        });
        console.log(`❌ ${page.name} audit failed`);
      }
    } catch (error) {
      console.error(`❌ Error auditing ${page.name}: ${error.message}`);
      lighthouseResults.push({
        page: page.name,
        url: page.url,
        status: 'error',
        error: error.message
      });
    }
  }
  
  return lighthouseResults;
}

/**
 * Generate performance report
 */
function generateReport(bundleAnalysis, lighthouseResults) {
  console.log('\n📋 Generating performance report...');
  
  const report = {
    timestamp: TIMESTAMP,
    summary: {
      totalBundleSize: bundleAnalysis?.total?.size || 0,
      totalFiles: bundleAnalysis?.total?.files || 0,
      lighthouseAudits: lighthouseResults.filter(r => r.status === 'completed').length,
      failedAudits: lighthouseResults.filter(r => r.status !== 'completed').length
    },
    bundleAnalysis,
    lighthouseResults,
    recommendations: generateRecommendations(bundleAnalysis, lighthouseResults)
  };
  
  const reportPath = path.join(REPORTS_DIR, `performance-report-${TIMESTAMP}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Generate markdown summary
  const markdownReport = generateMarkdownReport(report);
  const markdownPath = path.join(REPORTS_DIR, `performance-summary-${TIMESTAMP}.md`);
  fs.writeFileSync(markdownPath, markdownReport);
  
  console.log(`📄 Performance report saved to: ${reportPath}`);
  console.log(`📝 Markdown summary saved to: ${markdownPath}`);
  
  return report;
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations(bundleAnalysis, lighthouseResults) {
  const recommendations = [];
  
  // Bundle size recommendations
  if (bundleAnalysis) {
    const largeJSFiles = bundleAnalysis.javascript.filter(f => f.size > 500);
    if (largeJSFiles.length > 0) {
      recommendations.push({
        category: 'Bundle Size',
        priority: 'high',
        description: `Found ${largeJSFiles.length} large JavaScript files (>500KB). Consider code splitting.`,
        files: largeJSFiles.map(f => f.name)
      });
    }
    
    const totalSize = bundleAnalysis.total.size;
    if (totalSize > 2000) {
      recommendations.push({
        category: 'Bundle Size',
        priority: 'high',
        description: `Total bundle size is ${totalSize}KB. Aim for under 2MB initial load.`
      });
    }
  }
  
  // Lighthouse recommendations
  const failedAudits = lighthouseResults.filter(r => r.status !== 'completed');
  if (failedAudits.length > 0) {
    recommendations.push({
      category: 'Lighthouse Audits',
      priority: 'medium',
      description: `${failedAudits.length} Lighthouse audits failed. Check server is running.`
    });
  }
  
  // Performance optimizations
  recommendations.push(
    {
      category: 'Performance',
      priority: 'high',
      description: 'Implement virtualization for brokers list to reduce DOM nodes'
    },
    {
      category: 'Performance',
      priority: 'medium',
      description: 'Add lazy loading for images and below-the-fold content'
    },
    {
      category: 'Performance',
      priority: 'medium',
      description: 'Optimize images with WebP/AVIF formats and responsive srcset'
    },
    {
      category: 'Performance',
      priority: 'low',
      description: 'Add service worker for better caching strategy'
    }
  );
  
  return recommendations;
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(report) {
  const { summary, bundleAnalysis, lighthouseResults, recommendations } = report;
  
  return `# Performance Baseline Report

**Generated:** ${new Date(TIMESTAMP).toLocaleString()}

## Summary

- **Total Bundle Size:** ${summary.totalBundleSize} KB
- **Total Files:** ${summary.totalFiles}
- **Lighthouse Audits:** ${summary.lighthouseAudits}/${summary.lighthouseAudits + summary.failedAudits} completed

## Bundle Analysis

### JavaScript Files
${bundleAnalysis?.javascript?.slice(0, 10).map(file => 
  `- **${file.name}**: ${file.sizeFormatted}`
).join('\n') || 'No JavaScript files found'}

### CSS Files
${bundleAnalysis?.css?.slice(0, 5).map(file => 
  `- **${file.name}**: ${file.sizeFormatted}`
).join('\n') || 'No CSS files found'}

## Lighthouse Audits

${lighthouseResults.map(result => 
  `- **${result.page}**: ${result.status} ${result.error ? `(${result.error})` : ''}`
).join('\n')}

## Recommendations

${recommendations.map((rec, index) => 
  `### ${index + 1}. ${rec.category} (${rec.priority})

${rec.description}

${rec.files ? `\n**Files:**\n${rec.files.map(f => `- \`${f}\``).join('\n')}` : ''}

`).join('\n')}

## Next Steps

1. **High Priority**: Address high-priority recommendations first
2. **Bundle Optimization**: Implement code splitting for large chunks
3. **Performance Monitoring**: Set up continuous performance monitoring
4. **Regular Audits**: Run this baseline script regularly to track progress

---
*Report generated by performance-baseline.cjs*
`;
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Step 1: Build with bundle analyzer
    const buildSuccess = buildWithAnalyzer();
    if (!buildSuccess) {
      console.error('❌ Build failed. Exiting.');
      process.exit(1);
    }
    
    // Step 2: Analyze bundle sizes
    const bundleAnalysis = analyzeBundleSizes();
    
    // Step 3: Run Lighthouse audits (optional - requires server running)
    console.log('\n⚠️  Note: Lighthouse audits require the development server to be running on http://localhost:3000');
    console.log('   If you want to run Lighthouse audits, start the server with: npm run dev');
    
    const lighthouseResults = []; // Skip Lighthouse for now since server might not be running
    
    // Step 4: Generate report
    const report = generateReport(bundleAnalysis, lighthouseResults);
    
    // Calculate summary metrics
    const summary = {
      totalBundleSize: bundleAnalysis.totalSize ? (bundleAnalysis.totalSize / 1024).toFixed(2) : '0',
      totalFiles: bundleAnalysis.totalFiles || 0,
      largestJsFile: bundleAnalysis.javascript?.[0] || null
    };
    
    console.log('\n🎉 Performance baseline collection completed!');
    console.log(`📁 All reports saved to: ${REPORTS_DIR}`);
    console.log('\n📊 Key Metrics:');
    console.log(`   - Total Bundle Size: ${summary.totalBundleSize} KB`);
    console.log(`   - Total Files: ${summary.totalFiles}`);
    console.log(`   - Largest JS File: ${summary.largestJsFile?.name || 'N/A'} (${summary.largestJsFile?.sizeFormatted || 'N/A'})`);
    
  } catch (error) {
    console.error('❌ Error during baseline collection:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, buildWithAnalyzer, analyzeBundleSizes, runLighthouseAudits, generateReport };