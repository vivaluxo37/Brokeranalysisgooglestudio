const { chromium } = require('playwright');

async function testProgrammaticRoutes() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test the development server
    console.log('🧪 Testing programmatic routes...');

    // Wait for development server to be ready
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    console.log('✅ Main page loaded successfully');

    // Test programmatic routes
    const testRoutes = [
      '/forex/us',
      '/crypto/gb',
      '/stocks/ca',
      '/forex/strategy/scalping',
      '/forex/feature/leverage',
      '/country/trading/us'
    ];

    for (const route of testRoutes) {
      try {
        console.log(`🔄 Testing route: ${route}`);

        await page.goto(`http://localhost:5173${route}`);
        await page.waitForLoadState('networkidle');

        // Wait a bit for any dynamic content to load
        await page.waitForTimeout(2000);

        // Check if the page loaded without errors
        const title = await page.title();
        const hasContent = await page.locator('body').textContent();

        if (hasContent && hasContent.length > 100) {
          console.log(`✅ Route ${route} loaded successfully`);
          console.log(`   Title: ${title}`);
          console.log(`   Content length: ${hasContent.length} chars`);
        } else {
          console.log(`⚠️  Route ${route} loaded but content seems minimal`);
        }

        // Check for any error elements
        const errorElements = await page.locator('[data-testid="error"], .error, .error-message').count();
        if (errorElements > 0) {
          console.log(`❌ Route ${route} has error elements`);
        }

      } catch (error) {
        console.log(`❌ Route ${route} failed:`, error.message);
      }
    }

    console.log('🎉 Route testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Only run if development server is available
testProgrammaticRoutes().catch(console.error);