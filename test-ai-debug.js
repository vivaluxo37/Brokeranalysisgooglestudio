// Simple test to debug AI provider issues
// Run this with: node test-ai-debug.js

console.log('🔍 Testing AI Provider Integration...');

// Test environment variables
console.log('\n📋 Environment Variables:');
console.log('VITE_API_KEY:', process.env.VITE_API_KEY ? 'Set' : 'Not set');
console.log('VITE_HUGGINGFACE_KEY:', process.env.VITE_HUGGINGFACE_KEY ? 'Set' : 'Not set');
console.log('VITE_OPENROUTER_KEY:', process.env.VITE_OPENROUTER_KEY ? 'Set' : 'Not set');

// Test Gemini API directly
async function testGeminiAPI() {
    console.log('\n🧪 Testing Gemini API...');
    try {
        // This would need to be run in a browser environment with Vite
        // or modified for Node.js testing
        console.log('Gemini API test would run in browser environment');
    } catch (error) {
        console.error('Gemini API test failed:', error);
    }
}

testGeminiAPI();

console.log('\n✅ Debug script completed');
