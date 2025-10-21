// Script to test the debug output by making a request
const http = require('http');

function testCategory(slug) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/#/best-brokers/${slug}`,
      method: 'GET'
    };

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: http://localhost:3000/#/best-brokers/${slug}`);
    console.log('Watch the dev server console for debug output...');
    console.log('='.repeat(60));

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`Response received, status: ${res.statusCode}`);
        // Only show a snippet of the response to check for errors
        if (data.includes('Category Not Found') || data.includes('category not found')) {
          console.log('❌ Category not found in response');
        } else {
          console.log('✅ Response received (check browser console for debug logs)');
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error.message);
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('Testing category routes with debug output enabled');
  console.log('Check the DEV SERVER console for detailed debug logs\n');

  // Test a few key categories
  await testCategory('crypto-cfd-brokers');
  await new Promise(r => setTimeout(r, 1000)); // Wait 1 second between requests
  
  await testCategory('beginners');
  await new Promise(r => setTimeout(r, 1000));
  
  await testCategory('mt5');
  
  console.log('\n' + '='.repeat(60));
  console.log('Tests complete. Check the dev server console for debug output.');
  console.log('Look for lines starting with:');
  console.log('  [BrokerCategoryPage]');
  console.log('  [useCachedProgrammaticData]');
  console.log('  [getSEOPageConfigBySlug]');
  console.log('  [seoPageConfigs DEBUG]');
}

// Check if server is running
http.get('http://localhost:3000', (res) => {
  console.log('Dev server is running. Starting tests...\n');
  runTests().catch(console.error);
}).on('error', (err) => {
  console.error('ERROR: Development server is not running on port 3000');
  console.error('Please start the server with: npm run dev');
  process.exit(1);
});
