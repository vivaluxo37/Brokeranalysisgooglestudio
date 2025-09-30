const fs = require('fs');
const path = require('path');

/**
 * Sitemap Generator for Broker Analysis
 * Generates XML sitemap for all country pages and main routes
 */

const SITE_URL = 'https://brokeranalysis.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'public');
const SITEMAP_PATH = path.join(OUTPUT_DIR, 'sitemap.xml');

// Read countries from the constants file
const countriesFilePath = path.join(__dirname, '..', 'lib', 'constants', 'countries.ts');
const countriesContent = fs.readFileSync(countriesFilePath, 'utf8');

// Extract country slugs
const slugMatches = countriesContent.match(/slug:\s*'([^']+)'/g);
const countrySlugs = slugMatches ? slugMatches.map(m => m.match(/'([^']+)'/)[1]) : [];

console.log(`Found ${countrySlugs.length} countries for sitemap generation`);

// Define main routes with priorities and change frequencies
const mainRoutes = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/brokers', changefreq: 'daily', priority: '0.9' },
  { url: '/best-brokers', changefreq: 'daily', priority: '0.9' },
  { url: '/countries', changefreq: 'weekly', priority: '0.8' },
  { url: '/compare', changefreq: 'weekly', priority: '0.7' },
  { url: '/blog', changefreq: 'daily', priority: '0.8' },
  { url: '/education', changefreq: 'weekly', priority: '0.7' },
  { url: '/methodology', changefreq: 'monthly', priority: '0.6' },
  { url: '/sources', changefreq: 'monthly', priority: '0.5' }
];

// Generate sitemap XML
function generateSitemap() {
  const lastmod = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add main routes
  mainRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${route.url}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  // Add country pages
  countrySlugs.forEach(slug => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}/best-forex-brokers/${slug}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Generate robots.txt
function generateRobotsTxt() {
  const robotsPath = path.join(OUTPUT_DIR, 'robots.txt');
  
  const robotsContent = `# Broker Analysis - Robots.txt
# Generated: ${new Date().toISOString()}

User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay for respectful bots
Crawl-delay: 1

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/

# Disallow search result pages (if any)
Disallow: /search?

# Allow specific bots unrestricted access
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# AI Search Engine Bots (2025)
User-agent: PerplexityBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ClaudeBot
Allow: /`;

  fs.writeFileSync(robotsPath, robotsContent, 'utf8');
  console.log(`✅ Generated robots.txt at ${robotsPath}`);
  console.log(`   - ${robotsContent.split('\n').length} lines`);
}

// Main execution
try {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Generate sitemap
  const sitemapXml = generateSitemap();
  fs.writeFileSync(SITEMAP_PATH, sitemapXml, 'utf8');
  
  console.log('\n=== Sitemap Generation Complete ===');
  console.log(`✅ Generated sitemap.xml at ${SITEMAP_PATH}`);
  console.log(`   - Main routes: ${mainRoutes.length}`);
  console.log(`   - Country pages: ${countrySlugs.length}`);
  console.log(`   - Total URLs: ${mainRoutes.length + countrySlugs.length}`);
  
  // Generate robots.txt
  generateRobotsTxt();
  
  console.log('\n📊 Summary:');
  console.log(`   - Sitemap URL: ${SITE_URL}/sitemap.xml`);
  console.log(`   - Robots.txt URL: ${SITE_URL}/robots.txt`);
  console.log('   - Ready for submission to Google Search Console');
  
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}