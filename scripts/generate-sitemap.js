
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'https://brokeranalysis.com';
const BROKERS_TS_PATH = path.join(__dirname, '../data/brokers.ts');
const BLOG_TS_PATH = path.join(__dirname, '../data/blog.ts');
const CATEGORY_PAGES_PATH = path.join(__dirname, '../pages/categoryPageData.ts');
const SEO_PAGES_CONFIG_PATH = path.join(__dirname, '../data/seoPageConfigs.ts');
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

    // --- 2. Generate sitemap-blog.xml ---
    generateBlogSitemap(today);

    // --- 3. Generate sitemap-pages.xml ---
    generatePagesSitemap(today);

    // --- 4. Generate sitemap-seo.xml ---
    generateSEOPagesSitemap(today);

    // --- 5. Generate sitemap-index.xml ---
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

function generateBlogSitemap(lastmod) {
  console.log(' -> Generating sitemap-blog.xml...');
  if (!fs.existsSync(BLOG_TS_PATH)) {
    console.log('    ⚠️ blog.ts not found, skipping blog sitemap.');
    return;
  }
  const fileContent = fs.readFileSync(BLOG_TS_PATH, 'utf8');
  
  const postSlugs = [];
  const slugRegex = /slug:\s*'([^']+)'/g;
  let match;
  while ((match = slugRegex.exec(fileContent)) !== null) {
    postSlugs.push(match[1]);
  }

  const urlEntries = postSlugs.map(slug => `
  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;

  const outputPath = path.join(OUTPUT_DIR, 'sitemap-blog.xml');
  fs.writeFileSync(outputPath, sitemapContent.trim());
  console.log(`    ✅ Generated sitemap with ${postSlugs.length} blog post URLs.`);
}


function generatePagesSitemap(lastmod) {
  console.log(' -> Generating sitemap-pages.xml...');

  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: 'brokers', priority: '0.9', changefreq: 'weekly' },
    { url: 'compare', priority: '0.8', changefreq: 'weekly' },
    { url: 'cost-analyzer', priority: '0.7', changefreq: 'monthly' },
    { url: 'broker-matcher', priority: '0.8', changefreq: 'weekly' },
    { url: 'education', priority: '0.8', changefreq: 'weekly' },
    { url: 'blog', priority: '0.7', changefreq: 'daily' },
    { url: 'tools/economic-calendar', priority: '0.7', changefreq: 'daily' },
    { url: 'tools/market-data', priority: '0.7', changefreq: 'daily' },
    { url: 'tools/calculators', priority: '0.6', changefreq: 'monthly' },
    { url: 'market-news', priority: '0.8', changefreq: 'daily' },
    { url: 'methodology', priority: '0.5', changefreq: 'yearly' },
    { url: 'sources', priority: '0.5', changefreq: 'yearly' },
  ];

  // Generate category pages from categoryPageData
  let categoryPages = [];
  try {
    if (fs.existsSync(CATEGORY_PAGES_PATH)) {
      const categoryContent = fs.readFileSync(CATEGORY_PAGES_PATH, 'utf8');
      const pathMatch = categoryContent.match(/path:\s*['"`]([^'"`]+)['"`]/g);
      if (pathMatch) {
        categoryPages = pathMatch.map(match => {
          const path = match.match(/['"`]([^'"`]+)['"`]/)[1];
          return {
            url: path.replace(/^\//, ''),
            priority: '0.8',
            changefreq: 'weekly'
          };
        });
      }
    }
  } catch (error) {
    console.log('    ⚠️ Could not read category pages, skipping...');
  }

  const allPages = [...staticPages, ...categoryPages];

  const urlEntries = allPages.map(page => `
  <url>
    <loc>${BASE_URL}/${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;

  const outputPath = path.join(OUTPUT_DIR, 'sitemap-pages.xml');
  fs.writeFileSync(outputPath, sitemapContent.trim());
  console.log(`    ✅ Generated sitemap with ${allPages.length} page URLs.`);
}

function generateSEOPagesSitemap(lastmod) {
  console.log(' -> Generating sitemap-seo.xml...');

  // Read SEO page configurations directly from the TypeScript file
  try {
    const fileContent = fs.readFileSync(SEO_PAGES_CONFIG_PATH, 'utf8');

    // Extract allSEOPageConfigs array
    const pathMatch = fileContent.match(/path:\s*['"`]([^'"`]+)['"`]/g);
    const changefreqMatch = fileContent.match(/changefreq:\s*['"`]([^'"`]+)['"`]/g);
    const priorityMatch = fileContent.match(/priority:\s*([\d.]+)/g);

    if (pathMatch && pathMatch.length > 0) {
      const urlEntries = pathMatch.map((path, index) => {
        const cleanPath = path.match(/['"`]([^'"`]+)['"`]/)[1];
        const changefreq = changefreqMatch && changefreqMatch[index]
          ? changefreqMatch[index].match(/['"`]([^'"`]+)['"`]/)[1]
          : 'weekly';
        const priority = priorityMatch && priorityMatch[index]
          ? priorityMatch[index].match(/([\d.]+)/)[1]
          : '0.8';

        return `
  <url>
    <loc>${BASE_URL}${cleanPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      }).join('');

      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;

      const outputPath = path.join(OUTPUT_DIR, 'sitemap-seo.xml');
      fs.writeFileSync(outputPath, sitemapContent.trim());
      console.log(`    ✅ Generated sitemap with ${pathMatch.length} SEO page URLs.`);
    } else {
      console.log('    ⚠️ No SEO page paths found in configuration file.');
    }
  } catch (error) {
    console.log('    ⚠️ Could not generate SEO pages sitemap:', error.message);
  }
}

function generateSitemapIndex(lastmod) {
    console.log(' -> Generating sitemap-index.xml...');
    const childSitemaps = [
        'sitemap-brokers.xml',
        'sitemap-blog.xml',
        'sitemap-pages.xml',
        'sitemap-seo.xml',
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