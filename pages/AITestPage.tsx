import React, { useState } from 'react';
import { aiProviderManager } from '../services/aiProviders';
import { handleChatbotStream } from '../services/backendService';

const AITestPage: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const testDirectProvider = async () => {
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const response = await aiProviderManager.generateResponse(
        "What is forex trading? Answer in one sentence.",
        {
          stream: false,
          systemInstruction: "You are a helpful AI assistant."
        }
      );
      
      console.log('Direct provider response:', response);
      setResult(`Success! Provider: ${response.provider}, Model: ${response.model}`);
      
      if (typeof response.result === 'string') {
        setResult(prev => prev + '\n\nResponse: ' + response.result);
      } else {
        const text = await response.result.text();
        setResult(prev => prev + '\n\nResponse: ' + text);
      }
      
    } catch (err: any) {
      console.error('Direct provider test failed:', err);
      setError(`Direct provider error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testChatbotStream = async () => {
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const stream = await handleChatbotStream("What is forex trading? Answer in one sentence.");
      console.log('Chatbot stream started:', stream);
      
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          fullResponse += chunk;
          setResult(`Streaming: ${fullResponse}`);
        }
      } finally {
        reader.releaseLock();
      }
      
      setResult(`Streaming complete! Full response: ${fullResponse}`);
      
    } catch (err: any) {
      console.error('Chatbot stream test failed:', err);
      setError(`Chatbot stream error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkEnvironment = () => {
    const env = {
      'VITE_API_KEY': import.meta.env.VITE_API_KEY ? `Set (${import.meta.env.VITE_API_KEY.substring(0, 10)}...)` : 'Not set',
      'VITE_HUGGINGFACE_KEY': import.meta.env.VITE_HUGGINGFACE_KEY ? `Set (${import.meta.env.VITE_HUGGINGFACE_KEY.substring(0, 10)}...)` : 'Not set',
      'VITE_OPENROUTER_KEY': import.meta.env.VITE_OPENROUTER_KEY ? `Set (${import.meta.env.VITE_OPENROUTER_KEY.substring(0, 10)}...)` : 'Not set',
    };
    
    setResult('Environment Variables:\n' + JSON.stringify(env, null, 2));
  };

  const checkProviderStatus = () => {
    const status = aiProviderManager.getProviderStatus();
    setResult('Provider Status:\n' + JSON.stringify(status, null, 2));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">AI System Test</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={checkEnvironment}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          Check Environment
        </button>
        
        <button
          onClick={checkProviderStatus}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={loading}
        >
          Provider Status
        </button>
        
        <button
          onClick={testDirectProvider}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          disabled={loading}
        >
          Test Direct Provider
        </button>
        
        <button
          onClick={testChatbotStream}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          disabled={loading}
        >
          Test Chatbot Stream
        </button>
      </div>

      {loading && (
        <div className="mb-4 p-4 bg-yellow-100 rounded">
          ⏳ Loading...
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
          ❌ Error: {error}
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Results:</h2>
        <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded border">
          {result || 'No results yet. Run a test above.'}
        </pre>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">📝 Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>First, check environment variables to ensure API keys are loaded</li>
          <li>Check provider status to see available AI providers</li>
          <li>Test direct provider to test the fallback system</li>
          <li>Test chatbot stream to test the actual chatbot functionality</li>
          <li>Check browser console for detailed logs</li>
        </ol>
      </div>
    </div>
  );
};

export default AITestPage;
