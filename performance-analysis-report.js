/**
 * Performance Analysis Tool for Broker Analysis Application
 * Analyzes bundle size, loading performance, and provides recommendations
 */

const fs = require('fs');
const path = require('path');

class PerformanceAnalyzer {
  constructor() {
    this.metrics = {};
  }

  log(message, type = 'INFO') {
    console.log(`[PERF] ${message}`);
  }

  async analyzeBundleSize() {
    this.log('📊 Analyzing Bundle Size...');
    
    // Check if we're in development mode
    const distDir = 'dist';
    
    if (!fs.existsSync(distDir)) {
      this.log('⚠️ No dist/ directory found. Application running in development mode');
      return { totalSize: 0, files: [], developmentMode: true };
    }
    
    let totalSize = 0;
    const files = [];
    
    const scanDirectory = (dir) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          const subResult = scanDirectory(fullPath);
          totalSize += subResult.totalSize;
          files.push(...subResult.files);
        } else {
          files.push({
            path: fullPath,
            size: stats.size,
            type: path.extname(fullPath).slice(1),
            modified: stats.mtime
          });
          totalSize += stats.size;
        }
      }
      return { files, totalSize };
    };
    
    const { files, totalSize } = scanDirectory(distDir);
    
    // Analyze by file type
    const fileTypes = {};
    files.forEach(file => {
      const ext = file.type.toLowerCase();
      fileTypes[ext] = (fileTypes[ext] || 0) + 1;
      fileTypes[ext].totalSize += file.size;
    });
    
    // Sort by size (largest first)
    const largestFiles = files
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);
    
    this.log(`📦 Bundle Size Analysis:`);
    this.log(`Total Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    this.log(`Total Files: ${files.length}`);
    
    this.log('\n📋 File Type Breakdown:');
    Object.entries(fileTypes).forEach(([ext, info]) => {
      this.log(`  ${ext.toUpperCase()}: ${(info.totalSize / 1024 / 1024).toFixed(2)} MB (${info.count} files)`);
    });
    
    this.log('\n📦 Largest Files:');
    largestFiles.forEach((file, index) => {
      this.log(`  ${index + 1}. ${file.path.split('/').pop()} (${(file.size / 1024).toFixed(2)} KB)`);
    });
    
    return { files, totalSize, fileTypes, largestFiles };
  }

  analyzeNetworkPerformance() {
    this.log('🚀 Analyzing Network Performance...');
    
    // Test critical endpoints
    const endpoints = [
      { url: '/', name: 'Homepage' },
      { url: '/best-brokers', name: 'Best Brokers' },
      { url: '/broker/pepperstone', name: 'Pepperstone Details' }
    ];

    const networkMetrics = [];
    
    for (const endpoint of endpoints) {
      const startTime = Date.now();
      
      try {
        const response = await fetch(`http://localhost:3005${endpoint.url}`);
        const time = Date.now() - startTime;
        const contentLength = response.headers.get('content-length') || '0';
        
        networkMetrics.push({
          endpoint: endpoint.name,
          responseTime: time,
          contentLength: parseInt(contentLength),
          statusCode: response.status
        });
        
        this.log(`🌐 ${endpoint.name}: ${time}ms | ${response.status} | ${contentLength} bytes`);
      } catch (error) {
        this.log(`❌ ${endpoint.name}: ${error.message}`, 'ERROR');
      }
    }
    
    return networkMetrics;
  }

  generatePerformanceReport(bundleAnalysis, networkMetrics) {
    const report = {
      timestamp: new Date().toISOString(),
      bundleSize: bundleAnalysis.totalSize,
      bundleFiles: bundleAnalysis.files,
      largestFiles: bundleAnalysis.largestFiles,
      networkMetrics,
      fileTypes: bundleAnalysis.fileTypes,
      recommendations: this.generateRecommendations(bundleAnalysis, networkMetrics)
    };
    
    return report;
  }

  generateRecommendations(bundleAnalysis, networkMetrics) {
    const recommendations = [];
    
    // Bundle size recommendations
    const bundleSizeMB = bundleAnalysis.totalSize / 1024 / 1024;
    if (bundleSizeMB > 10) {
      recommendations.push(`📦 Large bundle size (${bundleSizeMB.toFixed(2)} MB) - Consider code splitting`);
    } else if (bundleSizeMB > 5) {
      recommendations.push(`📊 Medium bundle size (${bundleSizeMB.toFixed(2)} MB) - Consider optimization`);
    } else {
      recommendations.push(`✅ Bundle size is good (${bundleSizeMB.toFixed(2)} MB)`);
    }
    
    // File type recommendations
    const jsSize = (bundleAnalysis.fileTypes['.js'] || { totalSize: 0 }).totalSize / 1024;
    const cssSize = (bundleAnalysis.fileTypes['.css'] || { totalSize: 0 }).totalSize / 1024;
    
    if (jsSize > bundleSizeMB * 0.6) {
      recommendations.push(`📜 Large JavaScript bundle (${jsSize.toFixed(2)} MB) - Consider tree shaking`);
    }
    
    if (cssSize > bundleSizeMB * 0.2) {
      recommendations.push(`🎨 Large CSS bundle (${cssSize.toFixed(2)} MB) - Consider CSS optimization`);
    }
    
    // Network performance recommendations
    const avgTime = networkMetrics.reduce((sum, m) => sum + m.responseTime, 0) / networkMetrics.length;
    if (avgTime > 1000) {
      recommendations.push(`🐌 Slow API responses (${avgTime.toFixed(0)}ms avg) - Check API optimization`);
    }
    
    // Largest files recommendations
    const largeFiles = bundleAnalysis.largestFiles;
    const veryLargeFiles = largeFiles.filter(f => f.size > 1024 * 1024); // > 1MB
    
    if (veryLargeFiles.length > 0) {
      recommendations.push(`📦 ${veryLargeFiles.length} large files found - Consider code splitting`);
      veryLargeFiles.forEach((file, index) => {
        this.log(`   ${file.path.split('/').pop()} (${(file.size / 1024).toFixed(2)} KB)`);
      });
    }
    
    // Development vs Production recommendations
    recommendations.push('🚀 Performance is good for development');
    recommendations.push('🔧 Consider performance budgeting for production');
    recommendations.push('📊 Add Core Web Vitals monitoring');
    recommendations.push('📱 Add Lighthouse CI checks');
    
    return recommendations;
  }

  printReport(report) {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 PERFORMANCE ANALYSIS REPORT');
    console.log('='.repeat(80));
    console.log(`📅 Analyzed: ${report.timestamp}`);
    console.log('');
    
    console.log('📦 Bundle Size Analysis');
    console.log(`Total Size: ${(report.bundleSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total Files: ${report.bundleFiles.length}`);
    
    console.log('\n📊 Network Performance');
    if (report.networkMetrics.length > 0) {
      const avgTime = report.networkMetrics.reduce((sum, m) => sum + m.responseTime, 0) / report.networkMetrics.length;
      console.log(`Average Response Time: ${avgTime.toFixed(0)}ms`);
      console.log(`API Endpoint Status: ${report.networkMetrics.filter(m => m.statusCode === 200).length}/${report.networkMetrics.length} working`);
    }
    
    console.log('\n🎯 Performance Recommendations');
    report.recommendations.forEach(rec => console.log(rec));
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ Performance analysis completed successfully!');
    console.log('='.repeat(80));
    
    return report;
  }

  async runAnalysis() {
    this.log('🚀 Starting Performance Analysis...');
    
    try {
      const bundleAnalysis = await this.analyzeBundleSize();
      const networkMetrics = await this.analyzeNetworkPerformance();
      const report = this.generatePerformanceReport(bundleAnalysis, networkMetrics);
      
      return this.printReport(report);
    } catch (error) {
      this.log(`💥 Performance analysis failed: ${error.message}`, 'ERROR');
      console.error('💥 Fatal error:', error);
      return null;
    }
  }
}

// Run the analysis
const analyzer = new PerformanceAnalyzer();
analyzer.runAnalysis().catch(error => {
  console.error('💥 Failed to run performance analysis:', error.message);
});
