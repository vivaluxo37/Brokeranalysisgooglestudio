const fs = require('fs');
const path = require('path');

/**
 * Manual Route and Link Audit Script
 * Analyzes the codebase to identify potential 404 issues
 */

class RouteAndLinkAuditor {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.results = {
      routes: [],
      brokenLinks: [],
      potentialIssues: [],
      recommendations: []
    };
  }

  async scanRouteFiles() {
    console.log('📁 Scanning route files...');
    
    const pagesDir = path.join(__dirname, 'pages');
    const routes = [];

    // Scan pages directory
    if (fs.existsSync(pagesDir)) {
      this.scanDirectory(pagesDir, routes, 'pages/');
    }

    // Check for dynamic route configurations
    const seoConfigPath = path.join(__dirname, 'data', 'seoPageConfigs.ts');
    if (fs.existsSync(seoConfigPath)) {
      console.log('📄 Analyzing SEO page configurations...');
      const seoContent = fs.readFileSync(seoConfigPath, 'utf8');
      
      // Extract path patterns from SEO configs
      const pathMatches = seoContent.match(/path:\s*['"`]([^'"`]+)['"`]/g);
      if (pathMatches) {
        pathMatches.forEach(match => {
          const path = match[1];
          routes.push({
            path,
            type: 'seo-dynamic',
            source: 'seoPageConfigs.ts',
            category: 'category'
          });
        });
      }
    }

    console.log(`📊 Found ${routes.length} route configurations`);
    this.results.routes = routes;
    return routes;
  }

  scanDirectory(dir, routes, prefix = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.scanDirectory(fullPath, routes, path.join(prefix, item, '/'));
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        // Check if it's a dynamic route
        const relativePath = path.join(prefix, item);
        routes.push({
          path: relativePath,
          type: 'static',
          source: fullPath,
          category: this.categorizePath(relativePath)
        });
      }
    });
  }

  categorizePath(filePath) {
    if (filePath.includes('best-brokers/')) return 'category';
    if (filePath.includes('best-forex-brokers/')) return 'country';
    if (filePath.includes('brokers/')) return 'broker';
    if (filePath.includes('categories/')) return 'category';
    if (filePath.includes('countries/')) return 'country';
    if (filePath.includes('tools/')) return 'tools';
    if (filePath.includes('compare')) return 'comparison';
    if (filePath.includes('education/')) return 'education';
    return 'other';
  }

  scanComponentLinks() {
    console.log('🔗 Scanning component files for links...');
    
    const componentsDir = path.join(__dirname, 'components');
    const linkPatterns = [];
    const potentialIssues = [];

    if (fs.existsSync(componentsDir)) {
      this.scanComponentLinksRecursive(componentsDir, linkPatterns, potentialIssues);
    }

    console.log(`📊 Found ${linkPatterns.length} link patterns in components`);
    
    // Analyze patterns for potential issues
    linkPatterns.forEach(pattern => {
      if (pattern.href.startsWith('/')) {
        // Check if the route exists
        const matchingRoute = this.results.routes.find(route => {
          if (pattern.href === route.path) return true;
          if (route.type === 'seo-dynamic') {
            // Check if pattern matches dynamic route
            return this.matchesDynamicRoute(pattern.href, route.path);
          }
          return false;
        });

        if (!matchingRoute) {
          potentialIssues.push({
            type: 'missing-route',
            pattern: pattern.href,
            location: pattern.file,
            suggestion: `Create route file for ${pattern.href}`
          });
        }
      }
    });

    this.results.potentialIssues = potentialIssues;
    return linkPatterns;
  }

  scanComponentLinksRecursive(dir, linkPatterns, potentialIssues, currentPath = 'components/') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.scanComponentLinksRecursive(fullPath, linkPatterns, potentialIssues, path.join(currentPath, item, '/'));
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Find link patterns
        const linkRegex = /(?:to=|href=["']([^"']+)["']|<Link[^>]+to=["']([^"']+)["']|router\.push\(["']([^"']+)["']|router\.navigate\(["']([^"']+)["'])/g;
        let match;
        
        while ((match = linkRegex.exec(content)) !== null) {
          const href = match[1] || match[2] || match[3] || match[4] || match[5];
          if (href && href.startsWith('/')) {
            linkPatterns.push({
              href: href,
              file: path.join(currentPath, item),
              context: this.getContextAroundMatch(content, match.index)
            });
          }
        }

        // Check for hardcoded URLs that might be problematic
        const hardcodedUrls = content.match(/https?:\/\/[^\s"'>]+/g);
        if (hardcodedUrls) {
          hardcodedUrls.forEach(url => {
            potentialIssues.push({
              type: 'hardcoded-external-url',
              url: url,
              location: path.join(currentPath, item),
              suggestion: 'Consider if this external link is necessary'
            });
          });
        }
      }
    });
  }

  getContextAroundMatch(content, index) {
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + 50);
    return '...' + content.substring(start, end) + '...';
  }

  matchesDynamicRoute(href, routePattern) {
    // Simple matching for dynamic routes
    if (href.includes('[') && routePattern.includes(':')) return true;
    if (href.includes('/[category]') && routePattern.includes('/[category]')) return true;
    if (href.includes('/[country]') && routePattern.includes('/[country]')) return true;
    return false;
  }

  scanNavigationFiles() {
    console.log('🧭 Scanning navigation and menu configurations...');
    
    const navigationFiles = [
      'lib/constants/categories.ts',
      'lib/constants/countries.ts',
      'pages/countries/index.tsx',
      'pages/best-brokers/index.tsx',
      'pages/brokers.tsx'
    ];

    const navigationConfig = [];

    navigationFiles.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Look for navigation configurations
          if (file.includes('categories')) {
            const categoryMatches = content.match(/slug:\s*['"`]([^'"`]+)['"`]/g);
            if (categoryMatches) {
              navigationConfig.push({
                type: 'categories',
                file: file,
                items: categoryMatches.map(match => match[1])
              });
            }
          }
          
          if (file.includes('countries')) {
            const countryMatches = content.match(/slug:\s*['"`]([^'"`]+)['"`]/g);
            if (countryMatches) {
              navigationConfig.push({
                type: 'countries',
                file: file,
                items: countryMatches.map(match => match[1])
              });
            }
          }
        } catch (error) {
          console.log(`⚠️ Could not read ${file}: ${error.message}`);
        }
      }
    });

    console.log(`📊 Found navigation configurations for ${navigationConfig.length} sections`);
    return navigationConfig;
  }

  analyzeHomePageStructure() {
    console.log('🏠 Analyzing homepage structure...');
    
    const homePagePath = path.join(__dirname, 'pages', 'HomePage.tsx');
    if (fs.existsSync(homePagePath)) {
      try {
        const content = fs.readFileSync(homePagePath, 'utf8');
        
        // Look for common homepage sections
        const sections = {
          header: content.includes('<header') || content.includes('Header'),
          hero: content.includes('hero') || content.includes('Hero'),
          features: content.includes('features') || content.includes('Features'),
          categories: content.includes('categories') || content.includes('Categories'),
          countries: content.includes('countries') || content.includes('Countries'),
          tools: content.includes('tools') || content.includes('Tools'),
          footer: content.includes('footer') || content.includes('Footer')
        };

        console.log('📄 Homepage sections detected:');
        Object.entries(sections).forEach(([section, exists]) => {
          console.log(`  ${section}: ${exists ? '✅' : '❌'}`);
        });

        return sections;
      } catch (error) {
          console.log(`⚠️ Could not analyze HomePage: ${error.message}`);
          return {};
        }
    } else {
      console.log('❌ HomePage.tsx not found');
      return {};
    }
  }

  generateReport() {
    const { routes, brokenLinks, potentialIssues } = this.results;
    
    const report = {
      summary: {
        totalRoutes: routes.length,
        staticRoutes: routes.filter(r => r.type === 'static').length,
        dynamicRoutes: routes.filter(r => r.type === 'seo-dynamic').length,
        potentialIssues: potentialIssues.length
      },
      routes: routes,
      issues: potentialIssues,
      recommendations: []
    };

    // Generate recommendations
    if (potentialIssues.length > 0) {
      const missingRoutes = potentialIssues.filter(issue => issue.type === 'missing-route');
      if (missingRoutes.length > 0) {
        report.recommendations.push({
          type: 'missing-routes',
          count: missingRoutes.length,
          items: missingRoutes.map(issue => ({
            path: issue.pattern,
            location: issue.location,
            suggestion: issue.suggestion
          }))
        });
      }

      const hardcodedUrls = potentialIssues.filter(issue => issue.type === 'hardcoded-external-url');
      if (hardcodedUrls.length > 0) {
        report.recommendations.push({
          type: 'hardcoded-external-urls',
          count: hardcodedUrls.length,
          items: hardcodedUrls.map(issue => ({
            url: issue.url,
            location: issue.location,
            suggestion: issue.suggestion
          }))
        });
      }
    }

    return report;
  }

  async runAudit() {
    console.log('🎯 Starting Comprehensive Route and Link Audit');
    console.log('⏰ Started at:', new Date().toISOString());
    console.log('');

    try {
      const routes = await this.scanRouteFiles();
      const navigationConfig = await this.scanNavigationFiles();
      const componentLinks = await this.scanComponentLinks();
      const homePageStructure = this.analyzeHomePageStructure();
      const report = this.generateReport();

      console.log('\n' + '='.repeat(80));
      console.log('📊 ROUTE AND LINK AUDIT REPORT');
      console.log('='.repeat(80));
      
      console.log(`\n📈 SUMMARY:`);
      console.log(`  Total Routes: ${report.summary.totalRoutes}`);
      console.log(`  Static Routes: ${report.summary.staticRoutes}`);
      console.log(`  Dynamic Routes: ${report.summary.dynamicRoutes}`);
      console.log(`  Potential Issues: ${report.summary.potentialIssues}`);

      console.log(`\n📂 ROUTES BY CATEGORY:`);
      const routeCategories = {};
      routes.forEach(route => {
        if (!routeCategories[route.category]) {
          routeCategories[route.category] = [];
        }
        routeCategories[route.category].push(route);
      });

      Object.entries(routeCategories).forEach(([category, categoryRoutes]) => {
        console.log(`  ${category.toUpperCase()}: ${categoryRoutes.length} routes`);
      });

      if (report.issues.length > 0) {
        console.log(`\n⚠️  POTENTIAL ISSUES (${report.issues.length}):`);
        report.issues.forEach((issue, index) => {
          console.log(`  ${index + 1}. ${issue.type.toUpperCase()}`);
          console.log(`     Location: ${issue.location}`);
          console.log(`     Details: ${issue.pattern || issue.url}`);
          console.log(`     Suggestion: ${issue.suggestion}`);
          console.log('');
        });
      }

      if (report.recommendations.length > 0) {
        console.log(`💡 RECOMMENDATIONS:`);
        report.recommendations.forEach((rec, index) => {
          console.log(`  ${index + 1}. ${rec.type.toUpperCase()}`);
          console.log(`     Count: ${rec.count}`);
          console.log(`     Action: ${rec.suggestion}`);
          console.log('');
        });
      }

      // Check for common issues
      this.checkCommonIssues();

      // Save detailed report
      const reportPath = path.join(__dirname, 'route-audit-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n💾 Detailed report saved to: ${reportPath}`);

      console.log('\n' + '='.repeat(80));
      console.log(report.issues.length === 0 ? '✅ No major issues found!' : '⚠️ Some issues need attention');
      console.log('='.repeat(80));

      return report;

    } catch (error) {
      console.error('❌ Audit failed:', error.message);
      return {
        summary: {
          error: error.message
        }
      };
    }
  }

  checkCommonIssues() {
    console.log('\n🔍 Checking for common issues...');

    // Check if essential files exist
    const essentialFiles = [
      'pages/HomePage.tsx',
      'pages/countries/index.tsx',
      'pages/brokers.tsx',
      'lib/constants/countries.ts',
      'lib/constants/categories.ts',
      'data/seoPageConfigs.ts'
    ];

    console.log('📋 Essential files:');
    essentialFiles.forEach(file => {
      const exists = fs.existsSync(path.join(__dirname, file));
      console.log(`  ${file}: ${exists ? '✅' : '❌'}`);
      
      if (!exists && this.results.potentialIssues.length < 10) {
        this.results.potentialIssues.push({
          type: 'missing-essential-file',
          file: file,
          suggestion: `Create missing essential file: ${file}`
        });
      }
    });
  }
}

// Main execution
async function main() {
  console.log('🎯 Starting Comprehensive Route and Link Audit');
  console.log('⏰ Started at:', new Date().toISOString());
  console.log('');

  const auditor = new RouteAndLinkAuditor();

  try {
    const report = await auditor.runAudit();
    
    if (report.summary.error) {
      console.error('\n💥 Audit failed:', report.summary.error);
      process.exit(1);
    }
    
    // Exit with warning if there are potential issues
    process.exit(report.summary.potentialIssues > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n💥 Audit execution failed:', error.message);
    process.exit(1);
  }
}

// Run the audit
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { RouteAndLinkAuditor };
