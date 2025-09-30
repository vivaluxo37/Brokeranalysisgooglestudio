/**
 * Blog Image Optimization Script
 * 
 * Updates all blog post images to HD optimized versions with:
 * - Higher quality (90% vs 80%)
 * - Better dimensions (1200x630 for hero images)
 * - Proper aspect ratios for social sharing
 */

const fs = require('fs');
const path = require('path');

// Image optimization mapping
const imageOptimizations = {
    'bp4': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=90&w=1200&h=630&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'bp5': 'https://images.unsplash.com/photo-1640232239632-109559388349?q=90&w=1200&h=630&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'bp6': 'https://images.unsplash.com/photo-1559589689-57c6634355b9?q=90&w=1200&h=630&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'bp7': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=90&w=1200&h=630&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'bp8': 'https://images.unsplash.com/photo-1554224155-6122b3e26292?q=90&w=1200&h=630&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'bp9': 'https://images.unsplash.com/photo-1612287230202-95a041628d2a?q=90&w=1200&h=630&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'bp10': 'https://images.unsplash.com/photo-1624953901969-22a3f726916a?q=90&w=1200&h=630&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'bp11': 'https://images.unsplash.com/photo-1639755242257-9d332c883149?q=90&w=1200&h=630&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'bp12': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=90&w=1200&h=630&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'bp13': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=90&w=1200&h=630&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'bp14': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=90&w=1200&h=630&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

// SEO-friendly alt text for each post
const altTexts = {
    'bp1': 'Professional forex broker comparison chart showing regulatory licenses and trading platforms for 2025',
    'bp2': 'ECN vs Market Maker broker comparison showing direct market access and trading execution models',
    'bp3': 'Multiple forex trading strategy charts showing scalping, day trading, and swing trading timeframes',
    'bp4': 'Risk management dashboard showing stop-loss orders and position sizing calculators for forex trading',
    'bp5': 'Forex market analysis charts showing technical indicators and fundamental analysis tools',
    'bp6': 'Trading psychology mindset visualization showing emotional control and disciplined trading approach',
    'bp7': 'Forex trading beginner setup showing trading platform, currency pairs, and educational resources',
    'bp8': 'Forex trading cost breakdown showing spreads, commissions, and swap fees comparison chart',
    'bp9': 'Automated forex trading setup with Expert Advisors, trading bots, and algorithmic trading systems',
    'bp10': 'Forex leverage explanation diagram showing margin requirements and position sizing examples',
    'bp11': 'Forex trading platform comparison showing MT4, MT5, cTrader interfaces and features',
    'bp12': 'Copy trading platform interface showing social trading features and trader performance statistics',
    'bp13': 'Demo vs live trading account comparison showing practice environment and real market conditions',
    'bp14': 'Forex regulation compliance diagram showing regulatory bodies and trader protection measures'
};

class ImageOptimizer {
    constructor() {
        this.blogFilePath = path.join(process.cwd(), 'data', 'blog.ts');
        this.optimizationLog = [];
    }

    async optimizeAllImages() {
        console.log('🖼️ Starting blog image optimization...\n');
        
        try {
            let content = fs.readFileSync(this.blogFilePath, 'utf8');
            let totalOptimizations = 0;

            for (const [postId, optimizedUrl] of Object.entries(imageOptimizations)) {
                const updated = this.updateImageForPost(content, postId, optimizedUrl);
                if (updated.changed) {
                    content = updated.content;
                    totalOptimizations++;
                    this.optimizationLog.push({
                        postId,
                        optimizedUrl,
                        altText: altTexts[postId] || 'Forex trading related image'
                    });
                    console.log(`✅ Updated image for ${postId}`);
                } else {
                    console.log(`⏭️  Skipped ${postId} (already optimized or not found)`);
                }
            }

            if (totalOptimizations > 0) {
                // Write the updated content back to file
                fs.writeFileSync(this.blogFilePath, content);
                console.log(`\n🎉 Successfully optimized ${totalOptimizations} blog post images!`);
                
                // Generate optimization report
                this.generateOptimizationReport();
            } else {
                console.log('\n✨ All images are already optimized!');
            }

        } catch (error) {
            console.error('❌ Error during image optimization:', error.message);
        }
    }

    updateImageForPost(content, postId, optimizedUrl) {
        // Find the blog post section by ID
        const postRegex = new RegExp(`{\\s*id:\\s*['"]${postId}['"][\\s\\S]*?imageUrl:\\s*['"]([^'"]+)['"][\\s\\S]*?}`, 'g');
        const match = postRegex.exec(content);
        
        if (!match) {
            return { changed: false, content };
        }

        const currentUrl = match[1];
        
        // Check if already optimized (contains q=90 and w=1200)
        if (currentUrl.includes('q=90') && currentUrl.includes('w=1200')) {
            return { changed: false, content };
        }

        // Replace the image URL
        const updatedContent = content.replace(
            new RegExp(`(id:\\s*['"]${postId}['"][\\s\\S]*?imageUrl:\\s*)['"][^'"]+['"]`),
            `$1'${optimizedUrl}'`
        );

        return { changed: true, content: updatedContent };
    }

    generateOptimizationReport() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = `image-optimization-report-${timestamp}.json`;
        
        const report = {
            timestamp: new Date().toISOString(),
            totalOptimized: this.optimizationLog.length,
            optimizations: this.optimizationLog.map(opt => ({
                postId: opt.postId,
                optimizedUrl: opt.optimizedUrl,
                altText: opt.altText,
                improvements: [
                    'Quality increased from 80% to 90%',
                    'Width optimized to 1200px for better social sharing',
                    'Height set to 630px for optimal aspect ratio',
                    'Added crop parameter for consistent framing'
                ]
            }))
        };

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📊 Optimization report saved to: ${reportPath}`);
    }
}

// Execute if run directly
if (require.main === module) {
    const optimizer = new ImageOptimizer();
    optimizer.optimizeAllImages();
}

module.exports = ImageOptimizer;