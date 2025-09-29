import React from 'react';
import { useBrokers } from '../hooks/useBrokers';

const DebugBrokersPage: React.FC = () => {
  const { brokers, loading, error } = useBrokers();

  console.log('🔍 Debug - brokers:', brokers);
  console.log('🔍 Debug - loading:', loading);
  console.log('🔍 Debug - error:', error);

  if (loading) {
    return <div className="p-8">Loading brokers...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Brokers Page</h1>
      <p className="mb-4">Total brokers: {brokers.length}</p>
      
      {brokers.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Sample Broker Data:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(brokers[0], null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">All Brokers:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brokers.map(broker => (
            <div key={broker.id} className="border p-4 rounded">
              <h3 className="font-semibold">{broker.name}</h3>
              <p>ID: {broker.id}</p>
              <p>Score: {broker.score}</p>
              <p>Min Deposit: ${broker.accessibility.minDeposit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebugBrokersPage;