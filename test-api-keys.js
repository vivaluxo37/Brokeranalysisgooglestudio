/**
 * Test script to validate both Gemini API keys
 * This will help us determine which key is working and has available quota
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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    console.log(`📡 Sending test request...`);
    const result = await model.generateContent("Hello, please respond with 'API key is working' if you can read this.");
    const response = result.response;
    const text = response.text();
    
    console.log(`✅ Success! Response: ${text}`);
    return { success: true, key: apiKey, source, response: text };
    
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

async function testProxyServer() {
  console.log(`\n🌐 Testing proxy server...`);
  
  try {
    const response = await fetch('http://localhost:3001/health');
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Proxy server is running: ${JSON.stringify(data)}`);
      return true;
    } else {
      console.log(`❌ Proxy server returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Proxy server error: ${error.message}`);
    return false;
  }
}

async function testProxyEndpoint() {
  console.log(`\n🔌 Testing proxy AI endpoint...`);
  
  try {
    const response = await fetch('http://localhost:3001/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Test message - please respond with "Proxy is working"',
        brokerContext: '[]'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Proxy AI endpoint working: ${data.response?.substring(0, 100)}...`);
      return true;
    } else {
      const errorData = await response.json();
      console.log(`❌ Proxy AI endpoint error: ${errorData.error || response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Proxy AI endpoint error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting AI API Key Testing...');
  console.log('=====================================');
  
  // Test both API keys
  const frontendResult = await testApiKey(FRONTEND_API_KEY, 'Frontend (.env.local)');
  const backendResult = await testApiKey(BACKEND_API_KEY, 'Backend (api/.env)');
  
  // Test proxy server
  const proxyRunning = await testProxyServer();
  const proxyWorking = proxyRunning ? await testProxyEndpoint() : false;
  
  // Summary
  console.log('\n📊 SUMMARY');
  console.log('=====================================');
  console.log(`Frontend API Key: ${frontendResult.success ? '✅ Working' : '❌ Failed'} (${frontendResult.errorType || 'OK'})`);
  console.log(`Backend API Key: ${backendResult.success ? '✅ Working' : '❌ Failed'} (${backendResult.errorType || 'OK'})`);
  console.log(`Proxy Server: ${proxyRunning ? '✅ Running' : '❌ Not running'}`);
  console.log(`Proxy AI Endpoint: ${proxyWorking ? '✅ Working' : '❌ Not working'}`);
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS');
  console.log('=====================================');
  
  if (frontendResult.success && !backendResult.success) {
    console.log('🎯 Use Frontend API key for both frontend and backend');
    console.log('📝 Update api/.env to use the working frontend key');
  } else if (backendResult.success && !frontendResult.success) {
    console.log('🎯 Use Backend API key for both frontend and backend');
    console.log('📝 Update .env.local to use the working backend key');
  } else if (frontendResult.success && backendResult.success) {
    console.log('🎯 Both keys work! Consider using the backend key for better security');
  } else {
    console.log('⚠️  Neither API key is working - check Gemini API configuration');
  }
  
  if (!proxyRunning) {
    console.log('🔧 Start the proxy server: cd api && npm run dev');
  } else if (!proxyWorking) {
    console.log('🔧 Fix proxy server configuration');
  }
  
  console.log('\n🏁 Testing complete!');
}

// Run the tests
main().catch(console.error);