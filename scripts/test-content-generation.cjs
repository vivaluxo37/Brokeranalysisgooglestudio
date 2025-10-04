const { aiContentGenerator } = require('./services/content/AIContentGenerator');

async function testContentGeneration() {
  try {
    console.log('🧪 Testing AI Content Generation...');

    // Test if the generator is ready
    if (!aiContentGenerator.isReady()) {
      console.error('❌ AI Content Generator is not ready');
      return;
    }

    console.log('✅ AI Content Generator is ready');

    // Test connection
    const connectionTest = await aiContentGenerator.testConnection();
    if (!connectionTest) {
      console.error('❌ AI connection test failed');
      return;
    }

    console.log('✅ AI connection test passed');

    // Test content generation for a category-country page
    console.log('🔄 Generating sample content...');

    const sampleRequest = {
      type: 'category_country',
      category: 'forex',
      country: 'US',
      targetAudience: 'intermediate',
      tone: 'professional'
    };

    const options = {
      temperature: 0.7,
      maxTokens: 1000,
      includeStructuredData: true,
      targetAudience: 'intermediate',
      tone: 'professional'
    };

    const result = await aiContentGenerator.generateContent(sampleRequest, options);

    console.log('✅ Content generation successful!');
    console.log('📊 Results:');
    console.log(`  - Title: ${result.title}`);
    console.log(`  - Meta Description: ${result.metaDescription.substring(0, 100)}...`);
    console.log(`  - Keywords: ${result.metaKeywords.slice(0, 5).join(', ')}`);
    console.log(`  - Word Count: ${result.wordCount}`);
    console.log(`  - Reading Time: ${result.readingTime} min`);
    console.log(`  - Quality Score: ${Math.round(result.qualityScore * 100)}%`);
    console.log(`  - Content Length: ${result.content.length} chars`);

    if (result.structuredData) {
      console.log(`  - Structured Data: ${JSON.stringify(result.structuredData).substring(0, 100)}...`);
    }

    // Test a simple category page
    console.log('\n🔄 Testing category page generation...');

    const categoryRequest = {
      type: 'category',
      category: 'crypto',
      targetAudience: 'beginners',
      tone: 'friendly'
    };

    const categoryResult = await aiContentGenerator.generateContent(categoryRequest, options);

    console.log('✅ Category content generation successful!');
    console.log(`  - Title: ${categoryResult.title}`);
    console.log(`  - Word Count: ${categoryResult.wordCount}`);
    console.log(`  - Quality Score: ${Math.round(categoryResult.qualityScore * 100)}%`);

    console.log('\n🎉 All content generation tests passed!');

  } catch (error) {
    console.error('❌ Content generation test failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

// Run the test
testContentGeneration();