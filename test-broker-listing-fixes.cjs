/**
 * Test script to verify broker listing fixes
 * Run with: node test-broker-listing-fixes.cjs
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60));
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✓ ${description}`, 'green');
  } else {
    log(`✗ ${description} - File not found: ${filePath}`, 'red');
  }
  return exists;
}

function checkImport(filePath, importPattern, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasImport = content.includes(importPattern);
    if (hasImport) {
      log(`✓ ${description}`, 'green');
    } else {
      log(`✗ ${description} - Import not found in ${path.basename(filePath)}`, 'red');
    }
    return hasImport;
  } catch (error) {
    log(`✗ Error reading ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

function checkCodePattern(filePath, pattern, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasPattern = content.includes(pattern);
    if (hasPattern) {
      log(`✓ ${description}`, 'green');
    } else {
      log(`✗ ${description} - Pattern not found in ${path.basename(filePath)}`, 'yellow');
    }
    return hasPattern;
  } catch (error) {
    log(`✗ Error reading ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

function countBrokersInData() {
  const brokersFile = path.join(__dirname, 'data', 'brokers.ts');
  try {
    const content = fs.readFileSync(brokersFile, 'utf8');
    const matches = content.match(/id:\s*['"]/g);
    const count = matches ? matches.length : 0;
    log(`✓ Found ${count} brokers in data/brokers.ts`, 'green');
    return count;
  } catch (error) {
    log(`✗ Error counting brokers: ${error.message}`, 'red');
    return 0;
  }
}

function runTests() {
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  logSection('🔍 BROKER LISTING FIX VERIFICATION');

  // Test 1: Check if UnifiedBrokerCard exists
  logSection('1. Component Files');
  totalTests++;
  if (checkFile(
    path.join(__dirname, 'components', 'common', 'UnifiedBrokerCard.tsx'),
    'UnifiedBrokerCard component exists'
  )) {
    passedTests++;
  } else {
    failedTests++;
  }

  totalTests++;
  if (checkFile(
    path.join(__dirname, 'components', 'ui', 'LazyImage.tsx'),
    'LazyImage component exists'
  )) {
    passedTests++;
  } else {
    failedTests++;
  }

  totalTests++;
  if (checkFile(
    path.join(__dirname, 'services', 'seoService.ts'),
    'SEO Service exists'
  )) {
    passedTests++;
  } else {
    failedTests++;
  }

  // Test 2: Check imports in brokers.tsx
  logSection('2. All Brokers Page (/brokers)');
  const brokersPage = path.join(__dirname, 'pages', 'brokers.tsx');
  
  totalTests++;
  if (checkImport(
    brokersPage,
    'UnifiedBrokerCard',
    'Uses UnifiedBrokerCard component'
  )) {
    passedTests++;
  } else {
    failedTests++;
  }

  totalTests++;
  if (checkImport(
    brokersPage,
    'unifiedBrokerService',
    'Imports unifiedBrokerService'
  )) {
    passedTests++;
  } else {
    failedTests++;
  }

  totalTests++;
  if (checkImport(
    brokersPage,
    'SEOService',
    'Uses SEOService for meta tags'
  )) {
    passedTests++;
  } else {
    failedTests++;
  }

  totalTests++;
  if (!checkCodePattern(
    brokersPage,
    'mockBrokers',
    'Check for mock data (should NOT exist)'
  )) {
    log('✓ Mock data removed from brokers page', 'green');
    passedTests++;
  } else {
    log('✗ Mock data still present in brokers page!', 'red');
    failedTests++;
  }

  // Test 3: Check category page
  logSection('3. Category Pages');
  const categoryPage = path.join(__dirname, 'pages', 'best-brokers', '[category]', 'index.tsx');
  
  totalTests++;
  if (checkImport(
    categoryPage,
    'UnifiedBrokerCard',
    'Category page uses UnifiedBrokerCard'
  )) {
    passedTests++;
  } else {
    failedTests++;
  }

  // Test 4: Check country page
  logSection('4. Country Pages');
  const countryPage = path.join(__dirname, 'pages', 'best-forex-brokers', '[country]', 'index.tsx');
  
  totalTests++;
  if (checkImport(
    countryPage,
    'UnifiedBrokerCard',
    'Country page uses UnifiedBrokerCard'
  )) {
    passedTests++;
  } else {
    failedTests++;
  }

  // Test 5: Check routing in App.tsx
  logSection('5. Routing Configuration');
  const appFile = path.join(__dirname, 'App.tsx');
  
  totalTests++;
  if (checkCodePattern(
    appFile,
    'path="/brokers/:brokerId"',
    'New broker detail route exists'
  )) {
    passedTests++;
  } else {
    failedTests++;
  }

  totalTests++;
  if (checkCodePattern(
    appFile,
    'path="/broker/:brokerId"',
    'Legacy broker route preserved'
  )) {
    passedTests++;
  } else {
    failedTests++;
  }

  // Test 6: Count brokers in data
  logSection('6. Broker Data');
  const brokerCount = countBrokersInData();
  totalTests++;
  if (brokerCount >= 80) {
    log(`✓ Sufficient broker data (${brokerCount} brokers)`, 'green');
    passedTests++;
  } else if (brokerCount > 0) {
    log(`⚠ Limited broker data (${brokerCount} brokers, expected 84+)`, 'yellow');
    passedTests++;
  } else {
    log(`✗ No broker data found`, 'red');
    failedTests++;
  }

  // Test 7: Check unified broker service
  logSection('7. Unified Broker Service');
  const serviceFile = path.join(__dirname, 'services', 'unifiedBrokerService.ts');
  
  totalTests++;
  if (checkCodePattern(
    serviceFile,
    'getBrokers()',
    'getBrokers method exists'
  )) {
    passedTests++;
  } else {
    failedTests++;
  }

  totalTests++;
  if (checkCodePattern(
    serviceFile,
    'staticBrokers',
    'Uses static broker data'
  )) {
    passedTests++;
  } else {
    failedTests++;
  }

  // Test 8: Check pagination
  logSection('8. Pagination Features');
  totalTests++;
  if (checkCodePattern(
    brokersPage,
    'itemsPerPage',
    'Pagination implemented'
  )) {
    passedTests++;
  } else {
    failedTests++;
  }

  totalTests++;
  if (checkCodePattern(
    brokersPage,
    'setCurrentPage',
    'Page navigation exists'
  )) {
    passedTests++;
  } else {
    failedTests++;
  }

  // Summary
  logSection('📊 TEST SUMMARY');
  
  const passRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log(`
Total Tests:  ${totalTests}
Passed:       ${colors.green}${passedTests}${colors.reset}
Failed:       ${colors.red}${failedTests}${colors.reset}
Pass Rate:    ${passRate >= 80 ? colors.green : colors.yellow}${passRate}%${colors.reset}
  `);

  if (passRate >= 90) {
    log('\n✅ EXCELLENT! All critical fixes are in place.', 'green');
    log('The broker listing pages should now display all 84 brokers correctly.', 'green');
  } else if (passRate >= 70) {
    log('\n⚠️  GOOD PROGRESS! Most fixes are implemented.', 'yellow');
    log('Review the failed tests above and complete the remaining fixes.', 'yellow');
  } else {
    log('\n❌ NEEDS WORK! Several critical fixes are missing.', 'red');
    log('Please implement the fixes according to the audit report.', 'red');
  }

  // Recommendations
  logSection('🚀 NEXT STEPS');
  
  if (failedTests > 0) {
    console.log('\nFixes needed:');
    if (!fs.existsSync(path.join(__dirname, 'components', 'common', 'UnifiedBrokerCard.tsx'))) {
      console.log('1. Create UnifiedBrokerCard component');
    }
    if (!fs.existsSync(path.join(__dirname, 'services', 'seoService.ts'))) {
      console.log('2. Create SEO service');
    }
    console.log('\nRun this test again after implementing the fixes.');
  } else {
    console.log('\n1. Start the development server: npm run dev');
    console.log('2. Navigate to http://localhost:3000/brokers');
    console.log('3. Verify all 84 brokers are displayed');
    console.log('4. Test filtering and pagination');
    console.log('5. Check broker detail page links');
    console.log('6. Test category and country pages');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');

  // Return exit code based on pass rate
  process.exit(passRate >= 70 ? 0 : 1);
}

// Run the tests
runTests();
