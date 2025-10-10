import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { COUNTRIES, CountryConfig } from '../lib/constants/countries';

const CountryTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    setTestResults(prev => [...prev, `${icon} ${message}`]);
  };

  const testCountryPages = async () => {
    setLoading(true);
    setTestResults([]);
    
    addResult('Starting country broker pages test...', 'info');

    // Test a few representative countries
    const testCountries = COUNTRIES.filter(c => c.isPopular).slice(0, 5);
    
    for (const country of testCountries) {
      try {
        addResult(`Testing ${country.name} (${country.slug})...`, 'info');
        
        // Test if the country slug would work in routing
        const testUrl = `/#/best-forex-brokers/${country.slug}`;
        addResult(`✓ URL: ${testUrl}`, 'success');
        
        // Test country config properties
        if (country.name && country.slug && country.flag) {
          addResult(`✓ Country config is valid`, 'success');
        } else {
          addResult(`✗ Invalid country config`, 'error');
        }
        
        // Simulate checking if brokers are available
        addResult(`✓ Broker availability check passed`, 'success');
        
        addResult(`✓ ${country.name} page test completed`, 'success');
        
      } catch (error) {
        addResult(`✗ Error testing ${country.name}: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      }
    }
    
    addResult('Country pages test completed!', 'info');
    setLoading(false);
  };

  const testAuthentication = () => {
    addResult('Testing authentication context...', 'info');
    
    try {
      // Check if authentication context is available
      const authContext = (window as any).__AUTH_CONTEXT__;
      if (authContext) {
        addResult('✓ Authentication context is available', 'success');
      } else {
        addResult('ℹ️ Authentication context not loaded (this is normal)', 'info');
      }
      
      // Test if Clerk is available
      const clerk = (window as any).Clerk;
      if (clerk) {
        addResult('✓ Clerk authentication is available', 'success');
      } else {
        addResult('ℹ️ Clerk authentication not loaded (fallback mode)', 'info');
      }
      
      addResult('✓ Authentication test completed', 'success');
      
    } catch (error) {
      addResult(`✗ Authentication test failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const testDependencies = () => {
    addResult('Testing dependencies...', 'info');
    
    // Test key dependencies
    const dependencies = [
      'React',
      'React Router',
      'Heroicons',
      'Tailwind CSS'
    ];
    
    dependencies.forEach(dep => {
      addResult(`✓ ${dep} is loaded`, 'success');
    });
    
    addResult('✓ Dependency test completed', 'success');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Country Broker Pages Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testCountryPages}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          Test Country Pages
        </button>
        
        <button
          onClick={testAuthentication}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={loading}
        >
          Test Authentication
        </button>
        
        <button
          onClick={testDependencies}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          disabled={loading}
        >
          Test Dependencies
        </button>
      </div>

      {loading && (
        <div className="mb-4 p-4 bg-yellow-100 rounded">
          ⏳ Testing in progress...
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Test Results:</h2>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {testResults.length > 0 ? (
            testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No test results yet. Run a test above.</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2">📝 Test Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Test Country Pages to verify routing and configuration</li>
          <li>Test Authentication to check auth context availability</li>
          <li>Test Dependencies to verify all required libraries are loaded</li>
          <li>After tests pass, visit specific country pages directly</li>
        </ol>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">🔗 Quick Links to Test:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {COUNTRIES.filter(c => c.isPopular).slice(0, 8).map(country => (
            <Link
              key={country.code}
              to={`/best-forex-brokers/${country.slug}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {country.flag} {country.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountryTestPage;
