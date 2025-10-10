/**
 * Test script to verify AI provider integration and fallback mechanism
 * Run this in the browser console or as part of your testing suite
 */

import { aiProviderManager } from '../services/aiProviders';

export const testAIProviders = async () => {
  console.log('🧪 Testing AI Providers Integration...');
  
  // Test 1: Get provider status
  console.log('\n📊 Provider Status:');
  const status = aiProviderManager.getProviderStatus();
  status.forEach(provider => {
    console.log(`${provider.name}: Available=${provider.isAvailable}, Success=${provider.successCount}, Failures=${provider.failureCount}`);
    if (provider.lastError) {
      console.log(`  Last Error: ${provider.lastError}`);
    }
  });
  
  // Test 2: Simple chatbot test
  console.log('\n💬 Testing Chatbot Response...');
  try {
    const { handleChatbotStream } = await import('../services/backendService');
    const stream = await handleChatbotStream("What is forex trading?");
    console.log('✅ Chatbot stream started successfully');
    
    // Read a few chunks to verify it's working
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let chunks = 0;
    
    while (chunks < 3) {
      const { done, value } = await reader.read();
      if (done) break;
      console.log(`Chunk ${chunks + 1}:`, decoder.decode(value));
      chunks++;
    }
    reader.releaseLock();
    
  } catch (error) {
    console.error('❌ Chatbot test failed:', error);
  }
  
  // Test 3: AI Tutor test
  console.log('\n🎓 Testing AI Tutor Response...');
  try {
    const { handleAiTutorStream } = await import('../services/backendService');
    const stream = await handleAiTutorStream("Explain what leverage is in forex trading", []);
    console.log('✅ AI Tutor stream started successfully');
    
    // Read a few chunks
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let chunks = 0;
    
    while (chunks < 3) {
      const { done, value } = await reader.read();
      if (done) break;
      console.log(`Chunk ${chunks + 1}:`, decoder.decode(value));
      chunks++;
    }
    reader.releaseLock();
    
  } catch (error) {
    console.error('❌ AI Tutor test failed:', error);
  }
  
  // Test 4: Strategy Recommendations test
  console.log('\n🎯 Testing Strategy Recommendations...');
  try {
    const { handleStrategyBrokerRecommendations } = await import('../services/backendService');
    const result = await handleStrategyBrokerRecommendations("I'm a scalper looking for tight spreads and fast execution", [
      {
        id: "test-broker-1",
        name: "Test Broker 1",
        score: 85,
        executionType: "ECN",
        commissionStructure: "Per Lot",
        eurusdSpread: 0.1,
        swapFeeCategory: "Low",
        platforms: ["MT4", "MT5"],
        hasCopyTrading: true,
        hasApiAccess: true,
        scalpingAllowed: true,
        fees: { trading: { commissionStructure: "Per Lot" } },
        tradingConditions: { spreads: { eurusd: 0.1 } },
        technology: { executionType: "ECN" },
        copyTrading: {},
        technology: { apiAccess: true },
        tradingConditionsExtended: { scalpingAllowed: true }
      }
    ]);
    console.log('✅ Strategy recommendations:', result);
  } catch (error) {
    console.error('❌ Strategy recommendations test failed:', error);
  }
  
  // Test 5: Cost Analysis test
  console.log('\n💰 Testing Cost Analysis...');
  try {
    const { handleCostAnalysis } = await import('../services/backendService');
    const result = await handleCostAnalysis("EUR/USD", [
      {
        name: "Test Broker 1",
        websiteUrl: "https://testbroker1.com",
        spread: 0.5,
        commission: 7.0,
        totalCost: 8.0
      }
    ]);
    console.log('✅ Cost analysis:', result);
  } catch (error) {
    console.error('❌ Cost analysis test failed:', error);
  }
  
  console.log('\n🏁 Testing completed!');
};

// Export for easy access in console
declare global {
  interface Window {
    testAIProviders: () => Promise<void>;
  }
}

// Make available in browser console for debugging
if (typeof window !== 'undefined') {
  window.testAIProviders = testAIProviders;
  console.log('🔧 AI Providers test function available. Run testAIProviders() in console to test.');
}
