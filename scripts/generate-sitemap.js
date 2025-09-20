
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'https://brokeranalysis.com';
const BROKERS_TS_PATH = path.join(__dirname, '../data/brokers.ts');
const OUTPUT_DIR = path.join(__dirname, '../public');

// --- Main Function ---
function generateSitemaps() {
  console.log('Generating sitemaps...');
  
  try {
    // Ensure the output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    const today = new Date().toISOString().split('T')[0];

    // --- 1. Generate sitemap-brokers.xml ---
    generateBrokerSitemap(today);

    // --- 2. Generate sitemap-index.xml ---
    generateSitemapIndex(today);
    
    console.log('\nSitemap generation complete!');

  } catch (error) {
    console.error('❌ Error generating sitemaps:', error.message);
    process.exit(1);
  }
}

function generateBrokerSitemap(lastmod) {
  console.log(' -> Generating sitemap-brokers.xml...');
  const fileContent = fs.readFileSync(BROKERS_TS_PATH, 'utf8');
  
  // Extract broker IDs using a regular expression
  const brokerIds = [];
  const idRegex = /id:\s*'([^']+)'/g;
  let match;
  while ((match = idRegex.exec(fileContent)) !== null) {
    brokerIds.push(match[1]);
  }

  // Build XML URL entries
  const urlEntries = brokerIds.map(id => `
  <url>
    <loc>${BASE_URL}/broker/${id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;

  const outputPath = path.join(OUTPUT_DIR, 'sitemap-brokers.xml');
  fs.writeFileSync(outputPath, sitemapContent.trim());
  console.log(`    ✅ Generated sitemap with ${brokerIds.length} broker URLs.`);
}

function generateSitemapIndex(lastmod) {
    console.log(' -> Generating sitemap-index.xml...');
    const childSitemaps = [
        'sitemap-brokers.xml',
    ];

    const sitemapEntries = childSitemaps.map(sitemapFile => `
  <sitemap>
    <loc>${BASE_URL}/${sitemapFile}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('');

    const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapEntries}
</sitemapindex>`;

    const outputPath = path.join(OUTPUT_DIR, 'sitemap-index.xml');
    fs.writeFileSync(outputPath, sitemapIndexContent.trim());
    console.log(`    ✅ Generated sitemap index referencing ${childSitemaps.length} sitemaps.`);
}

// --- Execute Script ---
generateSitemaps();