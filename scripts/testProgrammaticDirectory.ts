#!/usr/bin/env node

/**
 * Test Script for Programmatic Directory Implementation
 * Validates all programmatic routes, components, and configurations
 */

import { allSEOPageConfigs } from '../data/seoPageConfigs';
import { COUNTRIES, getCountryBySlug } from '../lib/constants/countries';
import { validateCategoryRoute, validateCountryRoute, validateSEORoute } from '../services/programmaticRouting';

interface TestResult {
  category: string;
  test: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  details?: any;
}

const results: TestResult[] = [];

/**
 * Add test result
 */
function addResult(category: string, test: string, status: 'PASS' | 'FAIL' | 'WARN', message: string, details?: any) {
  results.push({ category, test, status, message, details });
}

/**
 * Test SEO Page Configurations
 */
function testSEOPageConfigurations(): void {
  console.log('\n🔍 Testing SEO Page Configurations...');

  // Test 1: Check if configurations exist
  if (allSEOPageConfigs.length === 0) {
    addResult('SEO Config', 'Configuration Count', 'FAIL', 'No SEO page configurations found');
    return;
  }

  addResult('SEO Config', 'Configuration Count', 'PASS', `${allSEOPageConfigs.length} configurations loaded`);

  // Test 2: Validate each configuration structure
  let validConfigs = 0;
  let invalidConfigs = 0;

  allSEOPageConfigs.forEach((config, index) => {
    const requiredFields = ['title', 'path', 'filters', 'highlights'];
    const missingFields = requiredFields.filter(field => !config[field]);

    if (missingFields.length === 0) {
      validConfigs++;
    } else {
      invalidConfigs++;
      addResult('SEO Config', `Config #${index + 1}`, 'FAIL', `Missing fields: ${missingFields.join(', ')}`, config.path);
    }
  });

  addResult('SEO Config', 'Structure Validation', validConfigs === allSEOPageConfigs.length ? 'PASS' : 'WARN',
    `${validConfigs} valid, ${invalidConfigs} invalid configurations`);

  // Test 3: Check for duplicate paths
  const paths = allSEOPageConfigs.map(config => config.path);
  const duplicates = paths.filter((path, index) => paths.indexOf(path) !== index);

  if (duplicates.length === 0) {
    addResult('SEO Config', 'Duplicate Paths', 'PASS', 'No duplicate paths found');
  } else {
    addResult('SEO Config', 'Duplicate Paths', 'FAIL', `Duplicate paths found: ${duplicates.join(', ')}`);
  }
}

/**
 * Test Country Configurations
 */
function testCountryConfigurations(): void {
  console.log('\n🌍 Testing Country Configurations...');

  // Test 1: Check if countries exist
  if (COUNTRIES.length === 0) {
    addResult('Country Config', 'Country Count', 'FAIL', 'No countries configured');
    return;
  }

  addResult('Country Config', 'Country Count', 'PASS', `${COUNTRIES.length} countries loaded`);

  // Test 2: Validate required fields
  let validCountries = 0;
  let invalidCountries = 0;

  COUNTRIES.forEach((country, index) => {
    const requiredFields = ['code', 'name', 'slug', 'flag'];
    const missingFields = requiredFields.filter(field => !country[field]);

    if (missingFields.length === 0) {
      validCountries++;
    } else {
      invalidCountries++;
      addResult('Country Config', `Country #${index + 1}`, 'FAIL', 
        `Missing fields: ${missingFields.join(', ')}`, country.name || `Index ${index}`);
    }
  });

  addResult('Country Config', 'Structure Validation', validCountries === COUNTRIES.length ? 'PASS' : 'WARN',
    `${validCountries} valid, ${invalidCountries} invalid countries`);

  // Test 3: Check for duplicate slugs
  const slugs = COUNTRIES.map(country => country.slug);
  const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);

  if (duplicateSlugs.length === 0) {
    addResult('Country Config', 'Duplicate Slugs', 'PASS', 'No duplicate slugs found');
  } else {
    addResult('Country Config', 'Duplicate Slugs', 'FAIL', `Duplicate slugs: ${duplicateSlugs.join(', ')}`);
  }

  // Test 4: Test getCountryBySlug function
  const testSlug = COUNTRIES[0]?.slug;
  if (testSlug) {
    const foundCountry = getCountryBySlug(testSlug);
    if (foundCountry) {
      addResult('Country Config', 'Slug Lookup', 'PASS', `Successfully found country: ${foundCountry.name}`);
    } else {
      addResult('Country Config', 'Slug Lookup', 'FAIL', `Failed to find country by slug: ${testSlug}`);
    }
  }
}

/**
 * Test Programmatic Routing
 */
function testProgrammaticRouting(): void {
  console.log('\n🛣️ Testing Programmatic Routing...');

  // Test 1: Category route validation
  const testCategorySlug = allSEOPageConfigs[0]?.path.split('/').pop();
  if (testCategorySlug) {
    const categoryRoute = validateCategoryRoute(testCategorySlug);
    if (categoryRoute.isValid) {
      addResult('Routing', 'Category Validation', 'PASS', `Category route validated: ${categoryRoute.path}`);
    } else {
      addResult('Routing', 'Category Validation', 'FAIL', `Failed to validate category: ${testCategorySlug}`);
    }
  }

  // Test 2: Country route validation  
  const testCountrySlug = COUNTRIES[0]?.slug;
  if (testCountrySlug) {
    const countryRoute = validateCountryRoute(testCountrySlug);
    if (countryRoute.isValid) {
      addResult('Routing', 'Country Validation', 'PASS', `Country route validated: ${countryRoute.path}`);
    } else {
      addResult('Routing', 'Country Validation', 'FAIL', `Failed to validate country: ${testCountrySlug}`);
    }
  }

  // Test 3: SEO route validation
  const testSEOSlug = allSEOPageConfigs[0]?.path.split('/').pop();
  if (testSEOSlug) {
    const seoRoute = validateSEORoute(testSEOSlug);
    if (seoRoute.isValid) {
      addResult('Routing', 'SEO Validation', 'PASS', `SEO route validated: ${seoRoute.path}`);
    } else {
      addResult('Routing', 'SEO Validation', 'FAIL', `Failed to validate SEO route: ${testSEOSlug}`);
    }
  }
}

/**
 * Test File Structure
 */
function testFileStructure(): void {
  console.log('\n📁 Testing File Structure...');

  const fs = require('fs');
  const path = require('path');

  // Test programmatic page files exist
  const programmaticFiles = [
    'pages/best-brokers/[category]/index.tsx',
    'pages/best-forex-brokers/[country]/index.tsx',
    'pages/brokers/[seoSlug]/index.tsx',
    'services/programmaticRouting.ts'
  ];

  programmaticFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      addResult('File Structure', filePath, 'PASS', 'File exists');
    } else {
      addResult('File Structure', filePath, 'FAIL', 'File not found');
    }
  });
}

/**
 * Generate test report
 */
function generateReport(): void {
  console.log('\n📊 PROGRAMMATIC DIRECTORY TEST RESULTS');
  console.log('=====================================');

  const categories = [...new Set(results.map(r => r.category))];
  let totalTests = results.length;
  let passedTests = results.filter(r => r.status === 'PASS').length;
  let failedTests = results.filter(r => r.status === 'FAIL').length;
  let warnings = results.filter(r => r.status === 'WARN').length;

  console.log(`📈 Overall Results: ${passedTests}/${totalTests} tests passed`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`⚠️ Warnings: ${warnings}`);

  categories.forEach(category => {
    console.log(`\n📂 ${category}:`);
    const categoryResults = results.filter(r => r.category === category);
    
    categoryResults.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
      console.log(`   ${icon} ${result.test}: ${result.message}`);
      if (result.details) {
        console.log(`      Details: ${result.details}`);
      }
    });
  });

  // Summary statistics
  console.log('\n📊 CONFIGURATION SUMMARY:');
  console.log(`   🔍 SEO Pages: ${allSEOPageConfigs.length}`);
  console.log(`   🌍 Countries: ${COUNTRIES.length}`);
  console.log(`   📄 Total Programmatic Pages: ${allSEOPageConfigs.length * 2 + COUNTRIES.length}`);

  // Implementation status
  console.log('\n🚀 IMPLEMENTATION STATUS:');
  if (failedTests === 0) {
    console.log('   ✅ Ready for deployment');
    console.log('   ✅ All programmatic routes configured');
    console.log('   ✅ File structure complete');
  } else {
    console.log(`   ❌ ${failedTests} issues need to be resolved`);
    console.log('   🔧 Fix failed tests before deployment');
  }

  console.log('\n🔗 NEXT STEPS:');
  console.log('1. Run: npm run dev (start development server)');
  console.log('2. Test routes: /best-brokers/ecn-brokers');
  console.log('3. Test routes: /best-forex-brokers/united-states');  
  console.log('4. Test routes: /brokers/no-minimum-deposit');
  console.log('5. Generate sitemap: npm run sitemap:programmatic');
}

/**
 * Main test execution
 */
function main(): void {
  console.log('🧪 TESTING PROGRAMMATIC DIRECTORY IMPLEMENTATION');
  console.log('===============================================');

  try {
    testSEOPageConfigurations();
    testCountryConfigurations();
    testProgrammaticRouting();
    testFileStructure();
    
    generateReport();

  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

export { testSEOPageConfigurations, testCountryConfigurations, testProgrammaticRouting };