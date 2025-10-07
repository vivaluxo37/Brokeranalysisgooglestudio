#!/usr/bin/env node

/**
 * Generate Sitemap for Programmatic Directory Pages
 * Creates sitemap.xml entries for all programmatic broker category and country pages
 */

import fs from 'fs';
import path from 'path';
import { allSEOPageConfigs } from '../data/seoPageConfigs';
import { COUNTRIES } from '../lib/constants/countries';

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}

const BASE_URL = 'https://brokeranalysis.com';
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'sitemap-programmatic.xml');

/**
 * Generate sitemap entries for programmatic pages
 */
function generateProgrammaticSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const today = new Date().toISOString().split('T')[0];

  // 1. Category pages (/best-brokers/[category])
  allSEOPageConfigs.forEach(config => {
    const categorySlug = config.path.split('/').pop();
    if (categorySlug) {
      entries.push({
        url: `${BASE_URL}/best-brokers/${categorySlug}`,
        lastmod: today,
        changefreq: config.changefreq || 'weekly',
        priority: config.priority || 0.8
      });
    }
  });

  // 2. SEO pages (/brokers/[seo-slug])
  allSEOPageConfigs.forEach(config => {
    const seoSlug = config.path.split('/').pop();
    if (seoSlug) {
      entries.push({
        url: `${BASE_URL}/brokers/${seoSlug}`,
        lastmod: today,
        changefreq: config.changefreq || 'weekly',
        priority: config.priority || 0.7
      });
    }
  });

  // 3. Country pages (/best-forex-brokers/[country])
  COUNTRIES.forEach(country => {
    entries.push({
      url: `${BASE_URL}/best-forex-brokers/${country.slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: country.priority / 100 || 0.6
    });
  });

  return entries;
}

/**
 * Generate XML sitemap content
 */
function generateSitemapXML(entries: SitemapEntry[]): string {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  const footer = '</urlset>';

  const urls = entries
    .sort((a, b) => b.priority - a.priority)
    .map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`)
    .join('\n');

  return `${header}\n${urls}\n${footer}`;
}

/**
 * Generate robots.txt entry for the programmatic sitemap
 */
function generateRobotsTxtEntry(): string {
  return `\n# Programmatic Directory Sitemap\nSitemap: ${BASE_URL}/sitemap-programmatic.xml`;
}

/**
 * Generate summary report
 */
function generateSummaryReport(entries: SitemapEntry[]): void {
  const categoryPages = entries.filter(e => e.url.includes('/best-brokers/')).length;
  const countryPages = entries.filter(e => e.url.includes('/best-forex-brokers/')).length;
  const seoPages = entries.filter(e => e.url.includes('/brokers/')).length;

  console.log('\n📊 PROGRAMMATIC SITEMAP GENERATION COMPLETE');
  console.log('===========================================');
  console.log(`✅ Total Pages Generated: ${entries.length}`);
  console.log(`   📂 Category Pages: ${categoryPages}`);
  console.log(`   🌍 Country Pages: ${countryPages}`);
  console.log(`   🔍 SEO Pages: ${seoPages}`);
  console.log(`📄 Output File: ${OUTPUT_FILE}`);
  console.log(`🌐 Base URL: ${BASE_URL}`);
  
  console.log('\n📋 TOP 10 HIGHEST PRIORITY PAGES:');
  const topPages = entries
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 10);
  
  topPages.forEach((page, index) => {
    const type = page.url.includes('/best-brokers/') ? 'Category' : 
                 page.url.includes('/best-forex-brokers/') ? 'Country' : 'SEO';
    console.log(`   ${index + 1}. [${type}] ${page.url} (${page.priority})`);
  });

  console.log('\n🔄 UPDATE INSTRUCTIONS:');
  console.log('1. Add this line to your main robots.txt:');
  console.log(`   Sitemap: ${BASE_URL}/sitemap-programmatic.xml`);
  console.log('2. Submit sitemap to Google Search Console');
  console.log('3. Update main sitemap index to include this file');
  console.log('\n✨ Programmatic directory is now SEO-ready!');
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  try {
    console.log('🚀 Generating programmatic directory sitemap...');

    // Generate sitemap entries
    const entries = generateProgrammaticSitemapEntries();

    if (entries.length === 0) {
      console.error('❌ No programmatic pages found to generate sitemap');
      process.exit(1);
    }

    // Generate XML content
    const sitemapXML = generateSitemapXML(entries);

    // Ensure public directory exists
    const publicDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write sitemap file
    fs.writeFileSync(OUTPUT_FILE, sitemapXML, 'utf-8');

    // Generate summary report
    generateSummaryReport(entries);

    // Generate robots.txt entry (optional)
    const robotsEntry = generateRobotsTxtEntry();
    console.log(`\n📝 Add to robots.txt: ${robotsEntry}`);

  } catch (error) {
    console.error('❌ Error generating programmatic sitemap:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { generateProgrammaticSitemapEntries, generateSitemapXML };