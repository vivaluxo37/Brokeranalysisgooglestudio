/**
 * Updated test script with correct Gemini model names
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// The two API keys from different sources
const FRONTEND_API_KEY = 'AIzaSyDn1S3-xArauXyrRKQZD691TJrFQS7xTdw';
const BACKEND_API_KEY = 'AIzaSyAjxTe_IQ11ABiHR_Es4jg_odd9CmwaEuQ';

async function testApiKey(apiKey, source) {
  console.log(`\n🔍 Testing API key from ${source}...`);
  console.log(`🔑 Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}`);
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different model names that should work
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro-latest'];
    
    for (const modelName of models) {
      try {
        console.log(`📡 Trying model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, please respond with 'API key is working' if you can read this.");
        const response = result.response;
        const text = response.text();
        
        console.log(`✅ Success with ${modelName}! Response: ${text}`);
        return { success: true, key: apiKey, source, response: text, model: modelName };
        
      } catch (modelError) {
        console.log(`❌ Model ${modelName} failed: ${modelError.message}`);
        continue;
      }
    }
    
    throw new Error('All models failed');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    
    // Categorize the error
    let errorType = 'Unknown';
    if (error.message.includes('API key')) {
      errorType = 'Invalid API Key';
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      errorType = 'Quota Exceeded';
    } else if (error.message.includes('permission')) {
      errorType = 'Permission Denied';
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      errorType = 'Network Error';
    }
    
    console.log(`📊 Error Type: ${errorType}`);
    return { success: false, key: apiKey, source, error: error.message, errorType };
  }
}

async function main() {
  console.log('🚀 Starting AI API Key Testing (Fixed)...');
  console.log('==========================================');
  
  // Test both API keys
  const frontendResult = await testApiKey(FRONTEND_API_KEY, 'Frontend (.env.local)');
  const backendResult = await testApiKey(BACKEND_API_KEY, 'Backend (api/.env)');
  
  // Summary
  console.log('\n📊 SUMMARY');
  console.log('==========================================');
  console.log(`Frontend API Key: ${frontendResult.success ? '✅ Working' : '❌ Failed'} (${frontendResult.errorType || 'OK'}) ${frontendResult.model ? `(${frontendResult.model})` : ''}`);
  console.log(`Backend API Key: ${backendResult.success ? '✅ Working' : '❌ Failed'} (${backendResult.errorType || 'OK'}) ${backendResult.model ? `(${backendResult.model})` : ''}`);
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS');
  console.log('==========================================');
  
  if (frontendResult.success && !backendResult.success) {
    console.log('🎯 Use Frontend API key for both frontend and backend');
    console.log('📝 Update api/.env to use: GEMINI_API_KEY=' + frontendResult.key);
    console.log('🤖 Update model to: ' + frontendResult.model);
  } else if (backendResult.success && !frontendResult.success) {
    console.log('🎯 Use Backend API key for both frontend and backend');
    console.log('📝 Update .env.local to use: VITE_API_KEY=' + backendResult.key);
    console.log('🤖 Update model to: ' + backendResult.model);
  } else if (frontendResult.success && backendResult.success) {
    console.log('🎯 Both keys work! Using backend key for better security');
    console.log('🤖 Recommended model: ' + (frontendResult.model || backendResult.model));
  } else {
    console.log('⚠️  Neither API key is working - check Gemini API configuration');
  }
  
  console.log('\n🏁 Testing complete!');
}

// Run the tests
main().catch(console.error);