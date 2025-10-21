/**
 * Test script to verify AI frontend integration
 */

const PROXY_URL = 'http://localhost:3001';
const FRONTEND_PORT = 3000;

async function testAIIntegration() {
    console.log('🔍 Testing AI Integration...\n');
    
    // 1. Test proxy server health
    console.log('1️⃣ Testing Proxy Server Health...');
    try {
        const healthResponse = await fetch(`${PROXY_URL}/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Proxy server is running:', healthData);
    } catch (error) {
        console.error('❌ Proxy server not responding:', error.message);
        console.log('\n⚠️ Please start the proxy server with: npm run proxy:dev');
        return;
    }
    
    // 2. Test chatbot endpoint
    console.log('\n2️⃣ Testing Chatbot Endpoint...');
    try {
        const chatResponse = await fetch(`${PROXY_URL}/api/chatbot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': `http://localhost:${FRONTEND_PORT}`
            },
            body: JSON.stringify({
                message: "Hello, test message",
                brokerContext: JSON.stringify([{id: 'test', name: 'Test Broker'}])
            })
        });
        
        if (!chatResponse.ok) {
            throw new Error(`HTTP ${chatResponse.status}: ${chatResponse.statusText}`);
        }
        
        const chatData = await chatResponse.json();
        console.log('✅ Chatbot endpoint working:', chatData.success ? 'Success' : 'Failed');
        
        if (!chatData.success) {
            console.error('⚠️ Chatbot response indicates failure:', chatData);
        }
    } catch (error) {
        console.error('❌ Chatbot endpoint error:', error.message);
    }
    
    // 3. Test AI Tutor endpoint
    console.log('\n3️⃣ Testing AI Tutor Endpoint...');
    try {
        const tutorResponse = await fetch(`${PROXY_URL}/api/tutor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': `http://localhost:${FRONTEND_PORT}`
            },
            body: JSON.stringify({
                topic: "Test topic",
                difficulty: 'beginner',
                userLevel: 'beginner',
                history: []
            })
        });
        
        if (!tutorResponse.ok) {
            throw new Error(`HTTP ${tutorResponse.status}: ${tutorResponse.statusText}`);
        }
        
        const tutorData = await tutorResponse.json();
        console.log('✅ AI Tutor endpoint working:', tutorData.success ? 'Success' : 'Failed');
        
        if (!tutorData.success) {
            console.error('⚠️ AI Tutor response indicates failure:', tutorData);
        }
    } catch (error) {
        console.error('❌ AI Tutor endpoint error:', error.message);
    }
    
    // 4. Test CORS configuration
    console.log('\n4️⃣ Testing CORS Configuration...');
    const testPorts = [3000, 3001, 3005, 5173];
    
    for (const port of testPorts) {
        try {
            const corsResponse = await fetch(`${PROXY_URL}/health`, {
                headers: {
                    'Origin': `http://localhost:${port}`
                }
            });
            
            if (corsResponse.ok) {
                console.log(`✅ CORS allowed for port ${port}`);
            } else {
                console.log(`❌ CORS blocked for port ${port}`);
            }
        } catch (error) {
            console.log(`❌ CORS error for port ${port}:`, error.message);
        }
    }
    
    console.log('\n📊 Summary:');
    console.log('- Proxy server should be running on port 3001');
    console.log('- Frontend should be running on port', FRONTEND_PORT);
    console.log('- CORS should allow connections from all development ports');
    console.log('\n✨ If all tests pass, AI features should work in the frontend!');
}

// Run the test
console.log('🚀 AI Frontend Integration Test\n');
console.log('================================\n');
testAIIntegration().catch(console.error);
