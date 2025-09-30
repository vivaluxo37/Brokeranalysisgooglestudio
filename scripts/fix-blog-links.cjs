/**
 * Fix Blog Links Script
 * 
 * This script fixes all internal hash-based links (#/) in blog posts
 * to use proper React Router paths (/)
 */

const fs = require('fs');
const path = require('path');

const blogFilePath = path.join(process.cwd(), 'data', 'blog.ts');

function fixBlogLinks() {
    console.log('🔧 Starting blog links fix...');
    
    try {
        let content = fs.readFileSync(blogFilePath, 'utf8');
        let fixCount = 0;
        
        // List of all internal hash links that need to be fixed
        const linkMappings = [
            // Broker links
            { from: '/#/broker/', to: '/broker/' },
            { from: '/#/brokers/platform/', to: '/brokers/platform/' },
            { from: '/#/brokers/type/', to: '/brokers/type/' },
            
            // Tool links  
            { from: '/#/cost-analyzer', to: '/cost-analyzer' },
            { from: '/#/broker-matcher', to: '/broker-matcher' },
            { from: '/#/tools/calculators', to: '/tools/calculators' },
            { from: '/#/tools/economic-calendar', to: '/tools/economic-calendar' },
            { from: '/#/market-news', to: '/market-news' },
            
            // Education links
            { from: '/#/education', to: '/education' },
            { from: '/#/education/quizzes/', to: '/education/quizzes/' },
            
            // Blog links
            { from: '/#/blog/', to: '/blog/' },
            { from: '/#/author/', to: '/author/' },
            
            // Other internal links
            { from: '/#/methodology', to: '/methodology' },
            { from: '/#/compare', to: '/compare' },
            { from: '/#/dashboard', to: '/dashboard' }
        ];
        
        // Apply each mapping
        linkMappings.forEach(mapping => {
            const regex = new RegExp(escapeRegExp(mapping.from), 'g');
            const matches = content.match(regex);
            if (matches) {
                content = content.replace(regex, mapping.to);
                fixCount += matches.length;
                console.log(`✅ Fixed ${matches.length} instances of "${mapping.from}" → "${mapping.to}"`);
            }
        });
        
        // Write the updated content back to file
        if (fixCount > 0) {
            fs.writeFileSync(blogFilePath, content);
            console.log(`\n🎉 Successfully fixed ${fixCount} internal links in blog posts!`);
        } else {
            console.log('\n✨ All internal links are already correct!');
        }
        
    } catch (error) {
        console.error('❌ Error fixing blog links:', error.message);
    }
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Execute if run directly
if (require.main === module) {
    fixBlogLinks();
}

module.exports = { fixBlogLinks };