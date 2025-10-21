// Automated test script to verify category configurations
const http = require('http');

// Map of slugs used in URLs to slugs expected in seoPageConfigs
const slugMappings = {
  'crypto-cfd-brokers': 'crypto-cfd-brokers',
  'crypto-trading': 'crypto-trading', 
  'ecn-brokers': 'ecn-brokers',
  'metatrader4-mt4': 'metatrader4-mt4',
  'metatrader5-mt5': 'metatrader5-mt5',
  'mt5': 'mt5',
  'beginners': 'beginners',
  'us-forex-brokers': 'us-forex-brokers',
  'uk-forex-brokers': 'uk-forex-brokers',
  'no-minimum-deposit': 'no-minimum-deposit',
  'low-deposit': 'low-deposit',
  '100-deposit': '100-deposit',
  'ctrader': 'ctrader',
  'stp-brokers': 'stp-brokers',
  'islamic-swap-free': 'islamic-swap-free',
  'copy-trading': 'copy-trading',
  'usa-traders': 'usa-traders',
  'uk-fca-regulated': 'uk-fca-regulated',
  'scalping': 'scalping',
  'swing-trading': 'swing-trading',
  'day-trading': 'day-trading',
  'zero-commission': 'zero-commission',
  'low-commission': 'low-commission',
  'high-leverage': 'high-leverage',
  'stock-cfds': 'stock-cfds',
  'top-10-cfd-brokers-platforms': 'top-10-cfd-brokers-platforms',
  'australian-forex-brokers': 'australian-forex-brokers'
};

function checkUrl(slug) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/#/best-brokers/${slug}`,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        // Check if the response contains "Category Not Found" or similar error
        const hasError = data.includes('Category Not Found') || 
                        data.includes('category not found') ||
                        data.includes('was not found');
        resolve({
          slug,
          status: res.statusCode,
          success: res.statusCode === 200 && !hasError,
          hasError
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        slug,
        status: 0,
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        slug,
        status: 0,
        success: false,
        error: 'Timeout'
      });
    });

    req.end();
  });
}

async function testCategories() {
  console.log('Testing category configurations:\n');
  console.log('='.repeat(60));
  console.log('Note: Make sure the dev server is running on port 3000\n');

  const slugs = Object.keys(slugMappings);
  const results = [];
  
  for (const slug of slugs) {
    const result = await checkUrl(slug);
    results.push(result);
    
    if (result.error) {
      console.log(`✗ ${slug}: ERROR - ${result.error}`);
    } else if (result.success) {
      console.log(`✓ ${slug}: OK (Status ${result.status})`);
    } else {
      console.log(`✗ ${slug}: FAILED (Status ${result.status}, Category not found)`);
    }
  }

  console.log('\n' + '='.repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\nResults: ${successful} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\nFailed categories need to be added to seoPageConfigs.ts');
    console.log('Failed slugs:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.slug}`);
    });
  } else {
    console.log('\n✓ All categories are working correctly!');
  }
}

// Check if server is running first
http.get('http://localhost:3000', (res) => {
  testCategories().catch(console.error);
}).on('error', (err) => {
  console.error('ERROR: Development server is not running on port 3000');
  console.error('Please start the server with: npm run dev');
  process.exit(1);
});
