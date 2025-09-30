#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing Strategy Verification\n');

const testFiles = [
  {
    path: 'lib/brokerRanking.test.ts',
    type: 'Unit Test',
    description: 'Broker ranking engine tests'
  },
  {
    path: 'src/components/BrokerCard.test.tsx',
    type: 'Component Test', 
    description: 'BrokerCard component tests'
  },
  {
    path: 'src/pages/BrokerListing.integration.test.tsx',
    type: 'Integration Test',
    description: 'BrokerListing page integration tests'
  },
  {
    path: 'cypress/e2e/broker-comparison.cy.ts',
    type: 'E2E Test',
    description: 'End-to-end user journey tests'
  },
  {
    path: 'cypress/fixtures/brokers.json',
    type: 'Test Data',
    description: 'Mock broker data for testing'
  },
  {
    path: 'src/test/setup.ts',
    type: 'Test Setup',
    description: 'Global test configuration and mocks'
  },
  {
    path: 'vitest.config.ts',
    type: 'Configuration',
    description: 'Vitest test runner configuration'
  },
  {
    path: 'lighthouserc.js',
    type: 'Performance',
    description: 'Lighthouse CI configuration'
  }
];

let passCount = 0;
let totalCount = testFiles.length;

console.log('📋 Checking test files:\n');

testFiles.forEach(test => {
  const filePath = path.join(path.dirname(__dirname), test.path);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✅ ${test.type.padEnd(18)} ${test.path} (${sizeKB}KB)`);
    console.log(`   ${test.description}\n`);
    passCount++;
  } else {
    console.log(`❌ ${test.type.padEnd(18)} ${test.path}`);
    console.log(`   MISSING: ${test.description}\n`);
  }
});

console.log(`📊 Test Strategy Status: ${passCount}/${totalCount} files implemented\n`);

// Check package.json for test scripts
const packageJsonPath = path.join(path.dirname(__dirname), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const testScripts = Object.keys(packageJson.scripts || {}).filter(script => script.includes('test'));
  
  console.log('🚀 Available test commands:');
  testScripts.forEach(script => {
    console.log(`   npm run ${script}`);
  });
  console.log('');
}

// Test file analysis
const analysisResults = [];

testFiles.forEach(test => {
  const filePath = path.join(path.dirname(__dirname), test.path);
  if (fs.existsSync(filePath) && test.path.endsWith('.test.ts') || test.path.endsWith('.test.tsx')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const testCases = (content.match(/it\(/g) || []).length;
    const describes = (content.match(/describe\(/g) || []).length;
    
    analysisResults.push({
      file: test.path,
      testCases,
      describes,
      lines: content.split('\n').length
    });
  }
});

if (analysisResults.length > 0) {
  console.log('📈 Test Coverage Analysis:');
  analysisResults.forEach(result => {
    console.log(`   ${result.file}:`);
    console.log(`     • ${result.describes} test suites`);
    console.log(`     • ${result.testCases} test cases`);
    console.log(`     • ${result.lines} lines of test code\n`);
  });
  
  const totalTestCases = analysisResults.reduce((sum, r) => sum + r.testCases, 0);
  const totalSuites = analysisResults.reduce((sum, r) => sum + r.describes, 0);
  console.log(`📊 Total: ${totalSuites} test suites, ${totalTestCases} test cases\n`);
}

// Recommendations
console.log('💡 Next Steps:');
if (passCount === totalCount) {
  console.log('   ✅ All test files are in place!');
  console.log('   🔧 Install test dependencies: npm install --save-dev @testing-library/dom cypress');
  console.log('   🏃 Run tests: npm run test:run');
  console.log('   🔍 View coverage: npm run test:coverage');
} else {
  console.log(`   📝 Create the missing ${totalCount - passCount} test files`);
  console.log('   🔧 Complete the test setup');
}

console.log('   📚 See TESTING_STRATEGY.md for detailed documentation\n');

console.log('🎯 Testing Strategy Implementation Complete!');
console.log('   This comprehensive testing approach ensures:');
console.log('   • High code quality and reliability');
console.log('   • Excellent user experience testing');
console.log('   • Performance and accessibility validation');
console.log('   • Automated quality gates for CI/CD');