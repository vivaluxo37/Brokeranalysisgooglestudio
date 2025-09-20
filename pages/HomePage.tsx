
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  return (
    <div className="text-center py-16 md:py-24">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
        Find Your Perfect Forex Broker
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
        Leverage the power of AI to analyze, compare, and choose the best forex broker tailored to your trading style.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link to="/brokers">
          <Button size="lg" variant="primary">
            Explore All Brokers
          </Button>
        </Link>
        <Link to="/broker-matcher">
          <Button size="lg" variant="secondary">
            Use AI Broker Matcher
          </Button>
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="p-6 bg-card rounded-lg border border-input">
          <h3 className="text-xl font-bold text-primary-400">Comprehensive Data</h3>
          <p className="mt-2 text-gray-400">Access detailed information on hundreds of brokers, from regulations to trading conditions.</p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-input">
          <h3 className="text-xl font-bold text-primary-400">AI-Powered Matching</h3>
          <p className="mt-2 text-gray-400">Our intelligent Broker Matcher finds the ideal broker based on your unique preferences.</p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-input">
          <h3 className="text-xl font-bold text-primary-400">Side-by-Side Comparison</h3>
          <p className="mt-2 text-gray-400">Easily compare key features of multiple brokers in a clear, concise table.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
