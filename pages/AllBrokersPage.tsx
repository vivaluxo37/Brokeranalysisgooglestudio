
import React, { useState } from 'react';
import { brokers } from '../data/brokers';
import BrokerCard from '../components/brokers/BrokerCard';
import Input from '../components/ui/Input';

const AllBrokersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrokers = brokers.filter(broker =>
    broker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">All Forex Brokers</h1>
        <p className="text-lg text-gray-400 mt-2">Browse our comprehensive list of regulated brokers.</p>
      </div>
      <div className="mb-8 max-w-md mx-auto">
        <Input 
          type="text"
          placeholder="Search for a broker..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBrokers.map(broker => (
          <BrokerCard key={broker.id} broker={broker} />
        ))}
      </div>
      {filteredBrokers.length === 0 && (
        <div className="text-center py-16 text-gray-400">
            <p>No brokers found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default AllBrokersPage;
