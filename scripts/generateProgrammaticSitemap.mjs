#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SEO page configurations
const SEO_PAGE_CONFIGS = [
  {
    title: 'No Minimum Deposit Forex Brokers',
    path: '/brokers/no-minimum-deposit',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Low Deposit Forex Brokers ($1-50)',
    path: '/brokers/low-deposit',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: '$100 Deposit Forex Brokers',
    path: '/brokers/100-deposit',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    title: 'Best MetaTrader 4 (MT4) Forex Brokers',
    path: '/brokers/metatrader4-mt4',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Best MetaTrader 5 (MT5) Forex Brokers',
    path: '/brokers/metatrader5-mt5',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    title: 'Best cTrader Forex Brokers',
    path: '/brokers/ctrader',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    title: 'Best ECN Forex Brokers',
    path: '/brokers/ecn-brokers',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Best STP Forex Brokers',
    path: '/brokers/stp-brokers',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    title: 'Best Islamic (Swap-Free) Forex Brokers',
    path: '/brokers/islamic-swap-free',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Best Copy Trading Forex Brokers',
    path: '/brokers/copy-trading',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Best Forex Brokers in USA',
    path: '/brokers/usa-traders',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Best UK Forex Brokers (FCA Regulated)',
    path: '/brokers/uk-fca-regulated',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Best Forex Brokers for Scalping',
    path: '/brokers/scalping',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Best Forex Brokers for Swing Trading',
    path: '/brokers/swing-trading',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    title: 'Best Forex Brokers for Day Trading',
    path: '/brokers/day-trading',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Best Zero Commission Forex Brokers',
    path: '/brokers/zero-commission',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    title: 'Best Low Commission Forex Brokers',
    path: '/brokers/low-commission',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    title: 'Best High Leverage Forex Brokers (1:500+)',
    path: '/brokers/high-leverage',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    title: 'Best Crypto Forex Brokers',
    path: '/brokers/crypto-trading',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    title: 'Best Stock CFD Forex Brokers',
    path: '/brokers/stock-cfds',
    priority: 0.8,
    changefreq: 'weekly'
  }
];

const COUNTRIES = [
  'united-states', 'united-kingdom', 'australia', 'germany', 'canada',
  'france', 'italy', 'spain', 'netherlands', 'switzerland', 'singapore',
  'hong-kong', 'japan', 'south-africa', 'new-zealand', 'belgium',
  'sweden', 'norway', 'denmark', 'finland', 'poland', 'czech-republic',
  'austria', 'ireland', 'portugal', 'greece', 'cyprus', 'malta',
  'luxembourg', 'estonia', 'latvia', 'lithuania', 'slovakia', 'slovenia',
  'hungary', 'romania', 'bulgaria', 'croatia', 'serbia', 'bosnia-herzegovina',
  'montenegro', 'albania', 'macedonia'
];

/**
 * Generate XML sitemap
 */
function generateSitemapXML(entries) {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const footer = `</urlset>`;

  const urls = entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`).join('\\n');

  return `${header}\\n${urls}\\n${footer}`;
}

/**
 * Generate robots.txt
 */
function generateRobotsTxt(sitemapUrls) {
  return `User-agent: *
Allow: /

# Sitemaps
${sitemapUrls.map(url => `Sitemap: ${url}`).join('\\n')}

# Block admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Allow important pages
Allow: /brokers/
Allow: /best-brokers/
Allow: /best-forex-brokers/

# Crawl delay for bots
Crawl-delay: 1`;
}

/**
 * Main sitemap generation
 */
async function generateProgrammaticSitemap() {
  const baseUrl = 'https://brokeranalysis.com';
  const outputDir = path.join(path.dirname(__dirname), 'public');
  const lastmod = new Date().toISOString().split('T')[0];
  
  console.log('🚀 Generating programmatic sitemap...');

  try {
    // Ensure public directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate all entries
    const allEntries = [];

    // Add static pages
    const staticPages = [
      { path: '/', priority: 1.0, changefreq: 'daily' },
      { path: '/brokers', priority: 0.9, changefreq: 'daily' },
      { path: '/best-brokers', priority: 0.9, changefreq: 'daily' },
      { path: '/countries', priority: 0.8, changefreq: 'weekly' },
      { path: '/compare', priority: 0.7, changefreq: 'weekly' },
      { path: '/blog', priority: 0.6, changefreq: 'weekly' },
      { path: '/education', priority: 0.6, changefreq: 'weekly' },
      { path: '/methodology', priority: 0.5, changefreq: 'monthly' },
      { path: '/sources', priority: 0.4, changefreq: 'monthly' }
    ];

    staticPages.forEach(page => {
      allEntries.push({
        url: `${baseUrl}${page.path}`,
        lastmod,
        changefreq: page.changefreq,
        priority: page.priority
      });
    });

    // Add SEO category pages
    SEO_PAGE_CONFIGS.forEach(config => {
      allEntries.push({
        url: `${baseUrl}${config.path}`,
        lastmod,
        changefreq: config.changefreq,
        priority: config.priority
      });
    });

    // Add country pages
    COUNTRIES.forEach(country => {
      allEntries.push({
        url: `${baseUrl}/best-forex-brokers/${country}`,
        lastmod,
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    // Add best-brokers category pages (mapped from seo configs)
    SEO_PAGE_CONFIGS.forEach(config => {
      if (config.path.startsWith('/brokers/')) {
        const categorySlug = config.path.replace('/brokers/', '');
        allEntries.push({
          url: `${baseUrl}/best-brokers/${categorySlug}`,
          lastmod,
          changefreq: config.changefreq,
          priority: config.priority
        });
      }
    });

    console.log(`📚 Total pages in sitemap: ${allEntries.length}`);

    // Sort by priority
    allEntries.sort((a, b) => b.priority - a.priority);

    // Generate main sitemap
    const sitemapXML = generateSitemapXML(allEntries);
    const sitemapPath = path.join(outputDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXML, 'utf8');
    console.log(`✅ Main sitemap generated: ${sitemapPath}`);

    // Generate robots.txt
    const robotsTxt = generateRobotsTxt([`${baseUrl}/sitemap.xml`]);
    const robotsPath = path.join(outputDir, 'robots.txt');
    fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
    console.log(`✅ Robots.txt generated: ${robotsPath}`);

    // Generate statistics
    const stats = {
      total: allEntries.length,
      seoPages: SEO_PAGE_CONFIGS.length,
      countries: COUNTRIES.length,
      static: staticPages.length,
      categoryPages: SEO_PAGE_CONFIGS.length // best-brokers categories
    };

    console.log('\\n📊 Sitemap Statistics:');
    console.log(`Total pages: ${stats.total}`);
    console.log(`├── SEO category pages (/brokers/*): ${stats.seoPages}`);
    console.log(`├── Best brokers categories (/best-brokers/*): ${stats.categoryPages}`);
    console.log(`├── Country pages (/best-forex-brokers/*): ${stats.countries}`);
    console.log(`└── Static pages: ${stats.static}`);

    // Generate breakdown by priority
    const byPriority = {
      high: allEntries.filter(e => e.priority >= 0.8).length,
      medium: allEntries.filter(e => e.priority >= 0.5 && e.priority < 0.8).length,
      low: allEntries.filter(e => e.priority < 0.5).length
    };

    console.log('\\nBy Priority:');
    console.log(`├── High (≥0.8): ${byPriority.high}`);
    console.log(`├── Medium (0.5-0.7): ${byPriority.medium}`);
    console.log(`└── Low (<0.5): ${byPriority.low}`);

    // Generate sitemap report
    const reportPath = path.join(outputDir, 'sitemap-report.json');
    const report = {
      generated: new Date().toISOString(),
      baseUrl,
      stats: { ...stats, byPriority },
      summary: {
        programmaticPages: stats.seoPages + stats.countries + stats.categoryPages,
        staticPages: stats.static,
        totalPages: stats.total
      },
      pages: allEntries.map(e => ({
        url: e.url,
        priority: e.priority,
        changefreq: e.changefreq
      }))
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`📋 Sitemap report generated: ${reportPath}`);

    console.log('🎉 Sitemap generation completed successfully!');

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run if called directly
generateProgrammaticSitemap()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export { generateProgrammaticSitemap, generateSitemapXML, generateRobotsTxt };