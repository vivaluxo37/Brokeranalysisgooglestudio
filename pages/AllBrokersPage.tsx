
import React, { useState, useMemo } from 'react';
import { brokers } from '../data/brokers';
import BrokerCard from '../components/brokers/BrokerCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

// Utility to parse leverage string like "1:500" into a number 500
const parseLeverage = (leverageStr: string): number => {
  if (!leverageStr || typeof leverageStr !== 'string') return 0;
  if (leverageStr.toLowerCase().includes('unlimited')) return Infinity;
  const num = parseInt(leverageStr.split(':')[1], 10);
  return isNaN(num) ? 0 : num;
};

// Get unique list of regulators for the filter dropdown
const allRegulators = [...new Set(brokers.flatMap(b => b.regulation.regulators))].sort();

const AllBrokersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [depositFilter, setDepositFilter] = useState('any');
  const [leverageFilter, setLeverageFilter] = useState('any');
  const [regulatorFilter, setRegulatorFilter] = useState('any');

  const filteredBrokers = useMemo(() => {
    return brokers.filter(broker => {
      // Search Term Filter
      if (searchTerm && !broker.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Min Deposit Filter
      if (depositFilter !== 'any') {
        const maxDeposit = parseInt(depositFilter, 10);
        if (broker.accessibility.minDeposit > maxDeposit) {
          return false;
        }
      }

      // Max Leverage Filter
      if (leverageFilter !== 'any') {
        const brokerLeverage = parseLeverage(broker.tradingConditions.maxLeverage);
        if (leverageFilter === 'low' && brokerLeverage > 100) return false;
        if (leverageFilter === 'medium' && (brokerLeverage <= 100 || brokerLeverage >= 500)) return false;
        if (leverageFilter === 'high' && brokerLeverage < 500) return false;
      }

      // Regulator Filter
      if (regulatorFilter !== 'any' && !broker.regulation.regulators.includes(regulatorFilter)) {
        return false;
      }

      return true;
    });
  }, [searchTerm, depositFilter, leverageFilter, regulatorFilter]);

  const handleReset = () => {
    setSearchTerm('');
    setDepositFilter('any');
    setLeverageFilter('any');
    setRegulatorFilter('any');
  };
  
  const selectClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-1 text-left";

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">All Forex Brokers</h1>
        <p className="text-lg text-gray-400 mt-2">Browse and filter our comprehensive list of regulated brokers.</p>
      </div>

      <div className="bg-card/50 p-6 rounded-lg border border-input mb-8 space-y-4">
        <Input 
          type="text"
          placeholder="Search by broker name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          
          <div className="w-full">
            <label htmlFor="deposit-filter" className={labelClasses}>Minimum Deposit</label>
            <select id="deposit-filter" value={depositFilter} onChange={(e) => setDepositFilter(e.target.value)} className={selectClasses}>
              <option value="any">Any Amount</option>
              <option value="100">Up to $100</option>
              <option value="250">Up to $250</option>
              <option value="1000">Up to $1000</option>
            </select>
          </div>

          <div className="w-full">
            <label htmlFor="leverage-filter" className={labelClasses}>Maximum Leverage</label>
            <select id="leverage-filter" value={leverageFilter} onChange={(e) => setLeverageFilter(e.target.value)} className={selectClasses}>
              <option value="any">Any Leverage</option>
              <option value="low">Low (≤1:100)</option>
              <option value="medium">Medium (1:101 - 1:499)</option>
              <option value="high">High (≥1:500)</option>
            </select>
          </div>
          
          <div className="w-full">
            <label htmlFor="regulator-filter" className={labelClasses}>Regulator</label>
            <select id="regulator-filter" value={regulatorFilter} onChange={(e) => setRegulatorFilter(e.target.value)} className={selectClasses}>
              <option value="any">Any Regulator</option>
              {allRegulators.map(reg => <option key={reg} value={reg}>{reg}</option>)}
            </select>
          </div>
          
          <Button variant="secondary" onClick={handleReset} className="w-full h-10">
            Reset Filters
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBrokers.map(broker => (
          <BrokerCard key={broker.id} broker={broker} />
        ))}
      </div>
      {filteredBrokers.length === 0 && (
        <div className="text-center py-16 text-gray-400">
            <p>No brokers found matching your search and filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AllBrokersPage;
