import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, '../public');
const BASE_URL = 'https://brokeranalysis.com';

function generateRobotsTxt() {
  console.log('Generating enhanced robots.txt...');

  const robotsContent = `# Sitemap directives
Sitemap: ${BASE_URL}/sitemap-index.xml
Sitemap: ${BASE_URL}/sitemap-main.xml
Sitemap: ${BASE_URL}/sitemap-brokers.xml
Sitemap: ${BASE_URL}/sitemap-blog.xml
Sitemap: ${BASE_URL}/sitemap-tools.xml
Sitemap: ${BASE_URL}/sitemap-education.xml
Sitemap: ${BASE_URL}/sitemap-international.xml
Sitemap: ${BASE_URL}/sitemap-seo.xml
Sitemap: ${BASE_URL}/sitemap-pages.xml

# User-agent directives
User-agent: *
Allow: /
Allow: /api/

# Allow search engines to crawl CSS and JS files for better rendering
Allow: *.css
Allow: *.js
Allow: *.json

# Block sensitive directories and files
Disallow: /admin/
Disallow: /private/
Disallow: /_next/
Disallow: /api/admin/
Disallow: /api/internal/
Disallow: /*.env$
Disallow: /*.env.local$
Disallow: /*.env.development$
Disallow: /*.env.test$
Disallow: /*.env.production$

# Block low-value content
Disallow: /search?
Disallow: /filter?
Disallow: /sort?
Disallow: /page?
Disallow: */tag/
Disallow: */author/
Disallow: /login
Disallow: /register
Disallow: /dashboard
Disallow: /trading-journal
Disallow: /broker-matcher/results
Disallow: /*?*utm_*
Disallow: /*?*fbclid*
Disallow: /*?*gclid*
Disallow: /*?*msclkid*

# Allow specific search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Block aggressive bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# Crawl delay for respectful crawling
User-agent: *
Crawl-delay: 1

# Additional security headers suggestion
# X-Robots-Tag: noindex, nofollow for specific paths

# Allow all major search engines to access images
User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot-Image
Allow: /

# Allow news search engines
User-agent: Googlebot-News
Allow: /blog/
Allow: /market-news/

# Language-specific directives for better international SEO
User-agent: *
Allow: /en/
Allow: /es/
Allow: /fr/
Allow: /de/
Allow: /it/
Allow: /pt/
Allow: /ru/
Allow: /zh/
Allow: /ja/
Allow: /ko/
Allow: /ar/
Allow: /hi/
Allow: /tr/
Allow: /nl/
Allow: /sv/
Allow: /da/
Allow: /no/
Allow: /fi/
Allow: /pl/

# Block specific file types
Disallow: /*.pdf$
Disallow: /*.doc$
Disallow: /*.docx$
Disallow: /*.xls$
Disallow: /*.xlsx$
Disallow: /*.ppt$
Disallow: /*.pptx$

# Allow XML sitemaps to be discovered
Allow: /sitemap*.xml

# Generated on ${new Date().toISOString()}
# For questions, contact webmaster@brokeranalysis.com
`;

  const outputPath = path.join(OUTPUT_DIR, 'robots.txt');
  fs.writeFileSync(outputPath, robotsContent);

  console.log('✅ Enhanced robots.txt generated successfully!');
  console.log('📁 Location:', outputPath);
  console.log('🔍 Features included:');
  console.log('   • Multiple sitemap references');
  console.log('   • International SEO support');
  console.log('   • Bot-specific directives');
  console.log('   • Security and privacy protection');
  console.log('   • Performance optimization');
  console.log('   • Search engine friendly directives');
}

generateRobotsTxt();