#!/usr/bin/env ts-node

import { writeFileSync } from 'fs';
import { join } from 'path';
import { generateSitemapEntries } from '../services/programmaticRouting';
import { allSEOPageConfigs } from '../data/seoPageConfigs';

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

/**
 * Generate XML sitemap for all programmatic pages
 */
function generateSitemapXML(entries: SitemapEntry[]): string {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const footer = `</urlset>`;

  const urls = entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`).join('\n');

  return `${header}\n${urls}\n${footer}`;
}

/**
 * Generate robots.txt with sitemap references
 */
function generateRobotsTxt(sitemapUrls: string[]): string {
  return `User-agent: *
Allow: /

# Sitemaps
${sitemapUrls.map(url => `Sitemap: ${url}`).join('\n')}

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
 * Main sitemap generation function
 */
async function generateProgrammaticSitemap() {
  const baseUrl = 'https://brokeranalysis.com';
  const outputDir = join(process.cwd(), 'public');
  
  console.log('🚀 Generating programmatic sitemap...');

  try {
    // Generate programmatic route entries
    const programmaticEntries = generateSitemapEntries(baseUrl);
    console.log(`📄 Found ${programmaticEntries.length} programmatic pages`);

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

    const staticEntries: SitemapEntry[] = staticPages.map(page => ({
      url: `${baseUrl}${page.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq as any,
      priority: page.priority
    }));

    // Combine all entries
    const allEntries = [...staticEntries, ...programmaticEntries];
    console.log(`📚 Total pages in sitemap: ${allEntries.length}`);

    // Sort by priority (highest first)
    allEntries.sort((a, b) => b.priority - a.priority);

    // Generate main sitemap
    const sitemapXML = generateSitemapXML(allEntries);
    const sitemapPath = join(outputDir, 'sitemap.xml');
    writeFileSync(sitemapPath, sitemapXML, 'utf8');
    console.log(`✅ Main sitemap generated: ${sitemapPath}`);

    // Generate category-specific sitemaps for better organization
    const categorySitemaps = generateCategorySitemaps(allEntries, baseUrl, outputDir);
    
    // Generate sitemap index if we have multiple sitemaps
    if (categorySitemaps.length > 0) {
      const sitemapIndex = generateSitemapIndex([`${baseUrl}/sitemap.xml`, ...categorySitemaps], baseUrl);
      const indexPath = join(outputDir, 'sitemap-index.xml');
      writeFileSync(indexPath, sitemapIndex, 'utf8');
      console.log(`✅ Sitemap index generated: ${indexPath}`);
    }

    // Generate robots.txt
    const robotsTxt = generateRobotsTxt([`${baseUrl}/sitemap.xml`]);
    const robotsPath = join(outputDir, 'robots.txt');
    writeFileSync(robotsPath, robotsTxt, 'utf8');
    console.log(`✅ Robots.txt generated: ${robotsPath}`);

    // Generate sitemap statistics
    generateSitemapStats(allEntries, programmaticEntries.length);

    console.log('🎉 Sitemap generation completed successfully!');

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

/**
 * Generate category-specific sitemaps
 */
function generateCategorySitemaps(allEntries: SitemapEntry[], baseUrl: string, outputDir: string): string[] {
  const categorySitemaps: string[] = [];

  // Group entries by category
  const categories = {
    brokers: allEntries.filter(e => e.url.includes('/brokers/')),
    countries: allEntries.filter(e => e.url.includes('/best-forex-brokers/')),
    categories: allEntries.filter(e => e.url.includes('/best-brokers/'))
  };

  Object.entries(categories).forEach(([category, entries]) => {
    if (entries.length > 0) {
      const categoryXML = generateSitemapXML(entries);
      const categoryPath = join(outputDir, `sitemap-${category}.xml`);
      writeFileSync(categoryPath, categoryXML, 'utf8');
      categorySitemaps.push(`${baseUrl}/sitemap-${category}.xml`);
      console.log(`✅ ${category} sitemap generated: ${entries.length} pages`);
    }
  });

  return categorySitemaps;
}

/**
 * Generate sitemap index XML
 */
function generateSitemapIndex(sitemapUrls: string[], baseUrl: string): string {
  const lastmod = new Date().toISOString();
  
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const footer = `</sitemapindex>`;

  const sitemaps = sitemapUrls.map(url => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n');

  return `${header}\n${sitemaps}\n${footer}`;
}

/**
 * Generate and display sitemap statistics
 */
function generateSitemapStats(allEntries: SitemapEntry[], programmaticCount: number) {
  const stats = {
    total: allEntries.length,
    programmatic: programmaticCount,
    static: allEntries.length - programmaticCount,
    byPriority: {
      high: allEntries.filter(e => e.priority >= 0.8).length,
      medium: allEntries.filter(e => e.priority >= 0.5 && e.priority < 0.8).length,
      low: allEntries.filter(e => e.priority < 0.5).length
    },
    byChangeFreq: {
      daily: allEntries.filter(e => e.changefreq === 'daily').length,
      weekly: allEntries.filter(e => e.changefreq === 'weekly').length,
      monthly: allEntries.filter(e => e.changefreq === 'monthly').length
    }
  };

  console.log('\n📊 Sitemap Statistics:');
  console.log(`Total pages: ${stats.total}`);
  console.log(`├── Programmatic: ${stats.programmatic}`);
  console.log(`└── Static: ${stats.static}`);
  console.log(`\nBy Priority:`);
  console.log(`├── High (≥0.8): ${stats.byPriority.high}`);
  console.log(`├── Medium (0.5-0.7): ${stats.byPriority.medium}`);
  console.log(`└── Low (<0.5): ${stats.byPriority.low}`);
  console.log(`\nBy Update Frequency:`);
  console.log(`├── Daily: ${stats.byChangeFreq.daily}`);
  console.log(`├── Weekly: ${stats.byChangeFreq.weekly}`);
  console.log(`└── Monthly: ${stats.byChangeFreq.monthly}`);
}

/**
 * Validate sitemap entries
 */
function validateSitemapEntries(entries: SitemapEntry[]): boolean {
  const errors: string[] = [];

  entries.forEach((entry, index) => {
    // Check URL format
    try {
      new URL(entry.url);
    } catch {
      errors.push(`Invalid URL at index ${index}: ${entry.url}`);
    }

    // Check priority range
    if (entry.priority < 0 || entry.priority > 1) {
      errors.push(`Invalid priority at index ${index}: ${entry.priority}`);
    }

    // Check changefreq values
    const validFreqs = ['daily', 'weekly', 'monthly'];
    if (!validFreqs.includes(entry.changefreq)) {
      errors.push(`Invalid changefreq at index ${index}: ${entry.changefreq}`);
    }

    // Check lastmod format
    if (!/\\d{4}-\\d{2}-\\d{2}/.test(entry.lastmod)) {
      errors.push(`Invalid lastmod format at index ${index}: ${entry.lastmod}`);
    }
  });

  if (errors.length > 0) {
    console.error('❌ Sitemap validation errors:');
    errors.forEach(error => console.error(`  ${error}`));
    return false;
  }

  console.log('✅ Sitemap validation passed');
  return true;
}

// Run the script if called directly
if (require.main === module) {
  generateProgrammaticSitemap()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { generateProgrammaticSitemap, generateSitemapXML, generateRobotsTxt };