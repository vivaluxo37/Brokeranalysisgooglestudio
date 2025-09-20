
import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { Broker } from '../types';
import { brokers as allBrokers } from '../data/brokers';
import BrokerCard from '../components/brokers/BrokerCard';
import Card, { CardContent } from '../components/ui/Card';

const BrokerMatcherPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    regulators: '',
    platforms: '',
    minDeposit: '100',
    priority: 'low spreads',
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ recommendations: Broker[], reasoning: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    // Mocking the API call as requested
    setTimeout(() => {
      try {
        // This is our mocked response from the geminiService
        const mockResponse = {
          reasoning: "Based on your preference for low spreads and top-tier regulators, Pepperstone and IC Markets are excellent choices. XTB is also a strong contender with its user-friendly platform and no minimum deposit.",
          recommendedBrokerIds: ['pepperstone', 'ic-markets', 'xtb'],
        };

        const recommendedBrokers = allBrokers.filter(b => mockResponse.recommendedBrokerIds.includes(b.id));
        
        if (recommendedBrokers.length === 0) {
            throw new Error("Could not find matching brokers from the mock response.");
        }

        setResults({ recommendations: recommendedBrokers, reasoning: mockResponse.reasoning });
      } catch (err) {
        setError('Failed to get mock recommendations. Please check the implementation.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 1500); // Simulate a 1.5-second network delay
  };

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">AI Broker Matcher</h1>
        <p className="text-lg text-gray-400 mt-2">Tell us your needs, and our AI will find the perfect broker for you.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="regulators" className="block text-sm font-medium text-gray-300">Preferred Regulators (e.g., FCA, ASIC)</label>
              <input type="text" name="regulators" id="regulators" value={preferences.regulators} onChange={handleInputChange} className="mt-1 block w-full bg-input border-input rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2" />
            </div>
            <div>
              <label htmlFor="platforms" className="block text-sm font-medium text-gray-300">Preferred Platforms (e.g., MT4, MT5, cTrader)</label>
              <input type="text" name="platforms" id="platforms" value={preferences.platforms} onChange={handleInputChange} className="mt-1 block w-full bg-input border-input rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2" />
            </div>
            <div>
              <label htmlFor="minDeposit" className="block text-sm font-medium text-gray-300">Maximum Initial Deposit</label>
              <select name="minDeposit" id="minDeposit" value={preferences.minDeposit} onChange={handleInputChange} className="mt-1 block w-full bg-input border-input rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2">
                <option value="100">$100</option>
                <option value="500">$500</option>
                <option value="1000">$1000</option>
                <option value="5000">$5000+</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-300">What's most important to you?</label>
              <input type="text" name="priority" id="priority" value={preferences.priority} onChange={handleInputChange} className="mt-1 block w-full bg-input border-input rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2" />
            </div>
            <div className="text-center">
              <Button type="submit" disabled={loading} size="lg">
                {loading ? <Spinner size="sm" /> : 'Find My Broker'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {error && <p className="text-center mt-6 text-red-500">{error}</p>}
      
      {results && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-4">Your Top Matches</h2>
          <Card className="max-w-3xl mx-auto mb-8">
            <CardContent>
              <h3 className="font-semibold text-primary-400 mb-2">AI Analysis</h3>
              <p className="text-gray-300 italic">{results.reasoning}</p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.recommendations.map(broker => (
              <BrokerCard key={broker.id} broker={broker} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrokerMatcherPage;
