/**
 * Database Test Component
 * Tests the database integration and broker hooks functionality
 */

import React, { useEffect, useState } from 'react';
import { useBrokers, useFeaturedBrokers, useBrokerStats } from '../../hooks/useBrokers';
import { brokerDatabaseService } from '../../services/brokerDatabaseService';

const DatabaseTestComponent: React.FC = () => {
  const { brokers, loading, error, refetch } = useBrokers();
  const { brokers: featuredBrokers, loading: featuredLoading } = useFeaturedBrokers();
  const { stats, loading: statsLoading } = useBrokerStats();
  const [connectionTest, setConnectionTest] = useState<string>('Testing...');

  useEffect(() => {
    // Test database connection
    const testConnection = async () => {
      try {
        const isConnected = await brokerDatabaseService.testConnection();
        setConnectionTest(isConnected ? '✅ Connected' : '❌ Not Connected');
      } catch (error) {
        setConnectionTest(`❌ Error: ${error}`);
      }
    };

    testConnection();
  }, []);

  const handleTestDatabaseQuery = async () => {
    try {
      console.log('🔍 Testing direct database query...');
      const directBrokers = await brokerDatabaseService.getAllBrokers();
      console.log(`Direct query result: ${directBrokers.length} brokers found`);
      alert(`Direct database query successful! Found ${directBrokers.length} brokers.`);
    } catch (error) {
      console.error('Direct query failed:', error);
      alert(`Direct query failed: ${error}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Database Integration Test</h1>
      
      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Database Connection</h2>
        <p className="text-lg">{connectionTest}</p>
        <button 
          onClick={handleTestDatabaseQuery}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Direct Query
        </button>
      </div>

      {/* Broker Stats */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Broker Statistics</h2>
        {statsLoading ? (
          <p>Loading stats...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalBrokers}</div>
              <div className="text-sm text-gray-600">Total Brokers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.featuredBrokers}</div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.averageRating}</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{stats.topRatedBroker}</div>
              <div className="text-sm text-gray-600">Top Rated</div>
            </div>
          </div>
        )}
      </div>

      {/* Featured Brokers */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Featured Brokers</h2>
        {featuredLoading ? (
          <p>Loading featured brokers...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredBrokers.slice(0, 6).map((broker) => (
              <div key={broker.id} className="p-3 bg-white rounded border border-gray-200">
                <h3 className="font-semibold text-lg">{broker.name}</h3>
                <p className="text-sm text-gray-600">{broker.headquarters}</p>
                <p className="text-lg font-bold text-blue-600">Score: {broker.score}</p>
                <p className="text-sm text-gray-500">{broker.description?.slice(0, 100)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Brokers */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Brokers ({brokers.length})</h2>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Loading brokers from database...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-semibold">Error Loading Brokers</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={refetch}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Headquarters</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Founded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {brokers.slice(0, 10).map((broker) => (
                  <tr key={broker.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {broker.logoUrl ? (
                            <img className="h-10 w-10 rounded-full" src={broker.logoUrl} alt={broker.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-600 font-semibold">{broker.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{broker.name}</div>
                          <div className="text-sm text-gray-500">{broker.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-blue-600">{broker.score}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {broker.headquarters}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {broker.foundingYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {broker.coreInfo?.brokerType || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {brokers.length > 10 && (
              <div className="mt-4 text-center text-gray-500">
                Showing first 10 of {brokers.length} brokers
              </div>
            )}
          </div>
        )}
      </div>

      {/* Debug Information */}
      <details className="mt-6">
        <summary className="cursor-pointer text-lg font-semibold text-gray-700">Debug Information</summary>
        <div className="mt-2 p-4 bg-gray-100 rounded text-sm">
          <pre>{JSON.stringify({ 
            brokersCount: brokers.length,
            loading,
            error,
            stats,
            sampleBroker: brokers[0]
          }, null, 2)}</pre>
        </div>
      </details>
    </div>
  );
};

export default DatabaseTestComponent;