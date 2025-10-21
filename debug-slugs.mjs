// Debug script to check slug extraction
import { getSEOPageConfigBySlug, allSEOPageConfigs } from './data/seoPageConfigs.ts';

console.log('Total configs:', allSEOPageConfigs.length);
console.log('\nAll available slugs:');
console.log('='.repeat(50));

// Extract and display all slugs
const slugFromPath = (path) => {
  const cleanedPath = path.split('?')[0]?.replace(/\/+$/, '') || '';
  const segments = cleanedPath.split('/').filter(Boolean);
  return segments.pop()?.toLowerCase() || '';
};

const slugMap = new Map();
allSEOPageConfigs.forEach(config => {
  const slug = slugFromPath(config.path);
  if (slug) {
    slugMap.set(slug, config.title);
  }
});

// Display all available slugs
Array.from(slugMap.entries()).forEach(([slug, title]) => {
  console.log(`  ${slug} => "${title}"`);
});

console.log('\n' + '='.repeat(50));
console.log('\nTesting specific slugs:');
const testSlugs = [
  'crypto-cfd-brokers',
  'crypto-trading',
  'ecn-brokers',
  'metatrader4-mt4',
  'beginners',
  'mt5'
];

testSlugs.forEach(slug => {
  const config = getSEOPageConfigBySlug(slug);
  if (config) {
    console.log(`✓ ${slug}: FOUND - "${config.title}"`);
  } else {
    console.log(`✗ ${slug}: NOT FOUND`);
  }
});
