/**
 * Comprehensive AI integration test
 * Tests both proxy server and direct frontend API calls
 */

async function testProxyChatbot() {
  console.log('🤖 Testing proxy chatbot...');
  
  try {
    const response = await fetch('http://localhost:3001/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'What is forex trading and which brokers are good for beginners?',
        brokerContext: JSON.stringify([
          {
            id: 'pepperstone',
            name: 'Pepperstone',
            websiteUrl: 'https://pepperstone.com',
            internalPath: '/#/broker/pepperstone',
            score: 9.2,
            minDeposit: 200,
            maxLeverage: '1:500',
            regulators: ['FCA', 'ASIC'],
            eurusdSpread: 0.0,
            commission: 0.0
          },
          {
            id: 'ic-markets',
            name: 'IC Markets',
            websiteUrl: 'https://icmarkets.com',
            internalPath: '/#/broker/ic-markets',
            score: 8.8,
            minDeposit: 200,
            maxLeverage: '1:500',
            regulators: ['ASIC', 'CySEC'],
            eurusdSpread: 0.1,
            commission: 3.5
          }
        ])
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Proxy chatbot working!`);
      console.log(`📝 Response preview: ${data.response?.substring(0, 200)}...`);
      return true;
    } else {
      const errorData = await response.json();
      console.log(`❌ Proxy chatbot error: ${errorData.error}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Proxy chatbot error: ${error.message}`);
    return false;
  }
}

async function testProxyTutor() {
  console.log('\n🎓 Testing proxy tutor...');
  
  try {
    const response = await fetch('http://localhost:3001/api/tutor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'What is leverage in forex trading?',
        difficulty: 'beginner',
        userLevel: 'beginner'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Proxy tutor working!`);
      console.log(`📝 Response preview: ${data.content?.substring(0, 200)}...`);
      return true;
    } else {
      const errorData = await response.json();
      console.log(`❌ Proxy tutor error: ${errorData.error}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Proxy tutor error: ${error.message}`);
    return false;
  }
}

async function testProxyMatcher() {
  console.log('\n🎯 Testing proxy broker matcher...');
  
  try {
    const response = await fetch('http://localhost:3001/api/broker-matcher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        preferences: {
          lowSpreads: true,
          regulated: true,
          mt4: true
        },
        tradingStyle: 'day trading',
        experience: 'intermediate',
        budget: '$1000-5000',
        region: 'Europe'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Proxy broker matcher working!`);
      console.log(`📝 Response preview: ${data.recommendations?.substring(0, 200)}...`);
      return true;
    } else {
      const errorData = await response.json();
      console.log(`❌ Proxy broker matcher error: ${errorData.error}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Proxy broker matcher error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Comprehensive AI Integration Test');
  console.log('=====================================');
  
  const chatbotOk = await testProxyChatbot();
  const tutorOk = await testProxyTutor();
  const matcherOk = await testProxyMatcher();
  
  console.log('\n📊 SUMMARY');
  console.log('=====================================');
  console.log(`Proxy Chatbot: ${chatbotOk ? '✅ Working' : '❌ Failed'}`);
  console.log(`Proxy Tutor: ${tutorOk ? '✅ Working' : '❌ Failed'}`);
  console.log(`Proxy Broker Matcher: ${matcherOk ? '✅ Working' : '❌ Failed'}`);
  
  const allWorking = chatbotOk && tutorOk && matcherOk;
  
  if (allWorking) {
    console.log('\n🎉 All AI features are working correctly!');
    console.log('✅ Proxy server approach is fully functional');
  } else {
    console.log('\n⚠️  Some AI features need attention');
    console.log('🔧 Check the logs above for specific error details');
  }
  
  console.log('\n💡 Next Steps:');
  console.log('1. Test the AI features in the browser');
  console.log('2. Check browser console for any frontend errors');
  console.log('3. Verify the chatbot, tutor, and broker matcher work in the UI');
}

// Run the tests
main().catch(console.error);