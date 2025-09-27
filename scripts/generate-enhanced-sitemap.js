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

// Supported languages for internationalization
const SUPPORTED_LOCALES = [
  'en',    // English (default)
  'es',    // Spanish
  'fr',    // French
  'de',    // German
  'it',    // Italian
  'pt',    // Portuguese
  'ru',    // Russian
  'zh',    // Chinese
  'ja',    // Japanese
  'ko',    // Korean
  'ar',    // Arabic
  'hi',    // Hindi
  'tr',    // Turkish
  'nl',    // Dutch
  'sv',    // Swedish
  'da',    // Danish
  'no',    // Norwegian
  'fi',    // Finnish
  'pl'     // Polish
];

// Priority and change frequency mappings
const PRIORITY_MAPPING = {
  home: '1.0',
  brokers: '0.9',
  broker_detail: '0.8',
  blog: '0.7',
  blog_post: '0.6',
  category: '0.8',
  tools: '0.7',
  comparison: '0.8',
  education: '0.8'
};

const CHANGE_FREQ_MAPPING = {
  home: 'daily',
  brokers: 'weekly',
  broker_detail: 'weekly',
  blog: 'daily',
  blog_post: 'monthly',
  category: 'weekly',
  tools: 'monthly',
  comparison: 'weekly',
  education: 'weekly'
};

// --- Main Function ---
function generateEnhancedSitemaps() {
  console.log('Generating enhanced sitemaps with internationalization...');

  try {
    // Ensure the output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const today = new Date().toISOString().split('T')[0];

    // Generate different sitemap types
    generateMainSitemap(today);
    generateBrokerSitemaps(today);
    generateBlogSitemaps(today);
    generateToolsSitemap(today);
    generateEducationSitemap(today);
    generateInternationalSitemap(today);
    generateEnhancedSitemapIndex(today);

    console.log('\nEnhanced sitemap generation complete!');

  } catch (error) {
    console.error('❌ Error generating enhanced sitemaps:', error.message);
    process.exit(1);
  }
}

function generateMainSitemap(lastmod) {
  console.log(' -> Generating sitemap-main.xml...');

  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily', type: 'home' },
    { path: 'brokers', priority: '0.9', changefreq: 'weekly', type: 'brokers' },
    { path: 'compare', priority: '0.8', changefreq: 'weekly', type: 'comparison' },
    { path: 'cost-analyzer', priority: '0.7', changefreq: 'monthly', type: 'tools' },
    { path: 'broker-matcher', priority: '0.8', changefreq: 'weekly', type: 'tools' },
    { path: 'education', priority: '0.8', changefreq: 'weekly', type: 'education' },
    { path: 'blog', priority: '0.7', changefreq: 'daily', type: 'blog' },
    { path: 'tools/economic-calendar', priority: '0.7', changefreq: 'daily', type: 'tools' },
    { path: 'tools/market-data', priority: '0.7', changefreq: 'daily', type: 'tools' },
    { path: 'tools/calculators', priority: '0.6', changefreq: 'monthly', type: 'tools' },
    { path: 'market-news', priority: '0.8', changefreq: 'daily', type: 'blog' },
    { path: 'methodology', priority: '0.5', changefreq: 'yearly', type: 'static' },
    { path: 'sources', priority: '0.5', changefreq: 'yearly', type: 'static' },
  ];

  const urlEntries = staticPages.map(page => {
    // Generate entries for all supported locales
    const localeEntries = SUPPORTED_LOCALES.map(locale => {
      const urlPath = locale === 'en' ? page.path : `${locale}/${page.path}`;
      return `
    <url>
      <loc>${BASE_URL}/${urlPath}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
      <xhtml:link rel="alternate" hreflang="${locale}" href="${BASE_URL}/${urlPath}" />${SUPPORTED_LOCALES
        .filter(otherLocale => otherLocale !== locale)
        .map(otherLocale => {
          const otherUrlPath = otherLocale === 'en' ? page.path : `${otherLocale}/${page.path}`;
          return `
      <xhtml:link rel="alternate" hreflang="${otherLocale}" href="${BASE_URL}/${otherUrlPath}" />`;
        }).join('')}
    </url>`;
    }).join('');

    return localeEntries;
  }).join('');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlEntries}
</urlset>`;

  const outputPath = path.join(OUTPUT_DIR, 'sitemap-main.xml');
  fs.writeFileSync(outputPath, sitemapContent.trim());
  console.log(`    ✅ Generated main sitemap with ${staticPages.length} pages across ${SUPPORTED_LOCALES.length} languages.`);
}

function generateBrokerSitemaps(lastmod) {
  console.log(' -> Generating sitemap-brokers.xml...');
  const fileContent = fs.readFileSync(BROKERS_TS_PATH, 'utf8');

  // Extract broker IDs
  const brokerIds = [];
  const idRegex = /id:\s*'([^']+)'/g;
  let match;
  while ((match = idRegex.exec(fileContent)) !== null) {
    brokerIds.push(match[1]);
  }

  // Generate entries for each broker with all locales
  const urlEntries = brokerIds.map(id => {
    const localeEntries = SUPPORTED_LOCALES.map(locale => {
      const urlPath = locale === 'en' ? `broker/${id}` : `${locale}/broker/${id}`;
      return `
  <url>
    <loc>${BASE_URL}/${urlPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="${locale}" href="${BASE_URL}/${urlPath}" />${SUPPORTED_LOCALES
      .filter(otherLocale => otherLocale !== locale)
      .map(otherLocale => {
        const otherUrlPath = otherLocale === 'en' ? `broker/${id}` : `${otherLocale}/broker/${id}`;
        return `
    <xhtml:link rel="alternate" hreflang="${otherLocale}" href="${BASE_URL}/${otherUrlPath}" />`;
      }).join('')}
  </url>`;
    }).join('');

    return localeEntries;
  }).join('');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlEntries}
</urlset>`;

  const outputPath = path.join(OUTPUT_DIR, 'sitemap-brokers.xml');
  fs.writeFileSync(outputPath, sitemapContent.trim());
  console.log(`    ✅ Generated broker sitemap with ${brokerIds.length} brokers across ${SUPPORTED_LOCALES.length} languages.`);
}

function generateBlogSitemaps(lastmod) {
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

  const urlEntries = postSlugs.map(slug => {
    const localeEntries = SUPPORTED_LOCALES.map(locale => {
      const urlPath = locale === 'en' ? `blog/${slug}` : `${locale}/blog/${slug}`;
      return `
  <url>
    <loc>${BASE_URL}/${urlPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="${locale}" href="${BASE_URL}/${urlPath}" />${SUPPORTED_LOCALES
      .filter(otherLocale => otherLocale !== locale)
      .map(otherLocale => {
        const otherUrlPath = otherLocale === 'en' ? `blog/${slug}` : `${otherLocale}/blog/${slug}`;
        return `
    <xhtml:link rel="alternate" hreflang="${otherLocale}" href="${BASE_URL}/${otherUrlPath}" />`;
      }).join('')}
  </url>`;
    }).join('');

    return localeEntries;
  }).join('');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlEntries}
</urlset>`;

  const outputPath = path.join(OUTPUT_DIR, 'sitemap-blog.xml');
  fs.writeFileSync(outputPath, sitemapContent.trim());
  console.log(`    ✅ Generated blog sitemap with ${postSlugs.length} posts across ${SUPPORTED_LOCALES.length} languages.`);
}

function generateToolsSitemap(lastmod) {
  console.log(' -> Generating sitemap-tools.xml...');

  const tools = [
    { path: 'tools/economic-calendar', priority: '0.7' },
    { path: 'tools/market-data', priority: '0.7' },
    { path: 'tools/calculators', priority: '0.6' },
    { path: 'tools/volatility-calculator', priority: '0.6' },
    { path: 'tools/position-size-calculator', priority: '0.6' },
    { path: 'tools/pip-value-calculator', priority: '0.6' },
    { path: 'tools/margin-calculator', priority: '0.6' },
    { path: 'tools/swap-calculator', priority: '0.6' }
  ];

  const urlEntries = tools.map(tool => {
    const localeEntries = SUPPORTED_LOCALES.map(locale => {
      const urlPath = locale === 'en' ? tool.path : `${locale}/${tool.path}`;
      return `
  <url>
    <loc>${BASE_URL}/${urlPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${tool.priority}</priority>
    <xhtml:link rel="alternate" hreflang="${locale}" href="${BASE_URL}/${urlPath}" />${SUPPORTED_LOCALES
      .filter(otherLocale => otherLocale !== locale)
      .map(otherLocale => {
        const otherUrlPath = otherLocale === 'en' ? tool.path : `${otherLocale}/${tool.path}`;
        return `
    <xhtml:link rel="alternate" hreflang="${otherLocale}" href="${BASE_URL}/${otherUrlPath}" />`;
      }).join('')}
  </url>`;
    }).join('');

    return localeEntries;
  }).join('');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlEntries}
</urlset>`;

  const outputPath = path.join(OUTPUT_DIR, 'sitemap-tools.xml');
  fs.writeFileSync(outputPath, sitemapContent.trim());
  console.log(`    ✅ Generated tools sitemap with ${tools.length} tools across ${SUPPORTED_LOCALES.length} languages.`);
}

function generateEducationSitemap(lastmod) {
  console.log(' -> Generating sitemap-education.xml...');

  const educationPages = [
    { path: 'education', priority: '0.8' },
    { path: 'education/quizzes', priority: '0.7' },
    { path: 'education/webinars', priority: '0.7' },
    { path: 'education/simulators', priority: '0.7' },
    { path: 'education/quizzes/forex-basics', priority: '0.6' },
    { path: 'education/quizzes/risk-management', priority: '0.6' },
    { path: 'education/quizzes/technical-analysis', priority: '0.6' },
    { path: 'education/quizzes/trading-psychology', priority: '0.6' }
  ];

  const urlEntries = educationPages.map(page => {
    const localeEntries = SUPPORTED_LOCALES.map(locale => {
      const urlPath = locale === 'en' ? page.path : `${locale}/${page.path}`;
      return `
  <url>
    <loc>${BASE_URL}/${urlPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="${locale}" href="${BASE_URL}/${urlPath}" />${SUPPORTED_LOCALES
      .filter(otherLocale => otherLocale !== locale)
      .map(otherLocale => {
        const otherUrlPath = otherLocale === 'en' ? page.path : `${otherLocale}/${page.path}`;
        return `
    <xhtml:link rel="alternate" hreflang="${otherLocale}" href="${BASE_URL}/${otherUrlPath}" />`;
      }).join('')}
  </url>`;
    }).join('');

    return localeEntries;
  }).join('');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlEntries}
</urlset>`;

  const outputPath = path.join(OUTPUT_DIR, 'sitemap-education.xml');
  fs.writeFileSync(outputPath, sitemapContent.trim());
  console.log(`    ✅ Generated education sitemap with ${educationPages.length} pages across ${SUPPORTED_LOCALES.length} languages.`);
}

function generateInternationalSitemap(lastmod) {
  console.log(' -> Generating sitemap-international.xml...');

  // Generate language-specific home pages
  const urlEntries = SUPPORTED_LOCALES.map(locale => {
    const urlPath = locale === 'en' ? '' : locale;
    return `
  <url>
    <loc>${BASE_URL}/${urlPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${locale === 'en' ? '1.0' : '0.9'}</priority>
    <xhtml:link rel="alternate" hreflang="${locale}" href="${BASE_URL}/${urlPath}" />${SUPPORTED_LOCALES
      .filter(otherLocale => otherLocale !== locale)
      .map(otherLocale => {
        const otherUrlPath = otherLocale === 'en' ? '' : otherLocale;
        return `
    <xhtml:link rel="alternate" hreflang="${otherLocale}" href="${BASE_URL}/${otherUrlPath}" />`;
      }).join('')}
  </url>`;
  }).join('');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlEntries}
</urlset>`;

  const outputPath = path.join(OUTPUT_DIR, 'sitemap-international.xml');
  fs.writeFileSync(outputPath, sitemapContent.trim());
  console.log(`    ✅ Generated international sitemap with ${SUPPORTED_LOCALES.length} language versions.`);
}

function generateEnhancedSitemapIndex(lastmod) {
  console.log(' -> Generating sitemap-index.xml...');

  const childSitemaps = [
    'sitemap-main.xml',
    'sitemap-brokers.xml',
    'sitemap-blog.xml',
    'sitemap-tools.xml',
    'sitemap-education.xml',
    'sitemap-international.xml',
    'sitemap-seo.xml',  // Generated by existing script
    'sitemap-pages.xml' // Generated by existing script
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
  console.log(`    ✅ Generated enhanced sitemap index referencing ${childSitemaps.length} sitemaps.`);
}

// --- Execute Script ---
generateEnhancedSitemaps();