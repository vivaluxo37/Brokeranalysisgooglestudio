/**
 * Test script for the proxy server AI endpoints
 */

async function testProxyEndpoint() {
  console.log('🔌 Testing proxy AI endpoint...');
  
  try {
    const response = await fetch('http://localhost:3001/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, please respond with "Proxy is working" if you can read this.',
        brokerContext: '[]'
      })
    });
    
    console.log(`📡 Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Proxy AI endpoint working!`);
      console.log(`📝 Response: ${data.response?.substring(0, 200)}...`);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`❌ Proxy AI endpoint error: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Proxy AI endpoint error: ${error.message}`);
    return false;
  }
}

async function testProxyHealth() {
  console.log('\n🏥 Testing proxy health endpoint...');
  
  try {
    const response = await fetch('http://localhost:3001/health');
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Proxy server is healthy: ${JSON.stringify(data)}`);
      return true;
    } else {
      console.log(`❌ Proxy health check failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Proxy health check error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Proxy Server Endpoints...');
  console.log('=====================================');
  
  const healthOk = await testProxyHealth();
  const endpointOk = await testProxyEndpoint();
  
  console.log('\n📊 SUMMARY');
  console.log('=====================================');
  console.log(`Proxy Health: ${healthOk ? '✅ OK' : '❌ Failed'}`);
  console.log(`AI Endpoint: ${endpointOk ? '✅ Working' : '❌ Not working'}`);
  
  if (healthOk && endpointOk) {
    console.log('\n🎉 Proxy server is fully functional!');
  } else {
    console.log('\n⚠️  Proxy server needs attention');
  }
}

// Run the tests
main().catch(console.error);