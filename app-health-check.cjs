const puppeteer = require('puppeteer');

async function checkAppHealth() {
    console.log('🔍 Checking application health...\n');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        await page.setDefaultTimeout(30000); // Longer timeout
        
        console.log('Testing main page: http://localhost:3000');
        const response = await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 30000 });
        
        if (response) {
            console.log(`✅ Main page loaded with status: ${response.status()}`);
            
            const title = await page.title();
            console.log(`Page title: ${title}`);
            
            // Check for any console errors
            const logs = [];
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    logs.push(msg.text());
                }
            });
            
            // Try a simple blog link
            console.log('\\nTesting simple blog link...');
            const blogResponse = await page.goto('http://localhost:3000/blog/how-to-choose-a-forex-broker-2025', { waitUntil: 'domcontentloaded' });
            
            if (blogResponse) {
                console.log(`✅ Blog page responded with status: ${blogResponse.status()}`);
            }
            
            if (logs.length > 0) {
                console.log('\\n⚠️ Console errors found:');
                logs.forEach(log => console.log(`- ${log}`));
            }
            
        } else {
            console.log('❌ No response from main page');
        }
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    } finally {
        await browser.close();
    }
}

checkAppHealth();