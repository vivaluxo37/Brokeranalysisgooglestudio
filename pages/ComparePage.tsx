
import React from 'react';
import { Link } from 'react-router-dom';
import { useComparison } from '../hooks/useComparison';
import { brokers as allBrokers } from '../data/brokers';
import ComparisonTable from '../components/brokers/ComparisonTable';
import Button from '../components/ui/Button';

const ComparePage: React.FC = () => {
  const { comparisonList, clearComparison } = useComparison();
  const brokersToCompare = allBrokers.filter(broker => comparisonList.includes(broker.id));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-4xl font-bold">Compare Brokers</h1>
            <p className="text-lg text-gray-400 mt-2">Side-by-side analysis of your selected brokers.</p>
        </div>
        {brokersToCompare.length > 0 && (
            <Button onClick={clearComparison} variant="danger">
                Clear All
            </Button>
        )}
      </div>

      {brokersToCompare.length > 0 ? (
        <ComparisonTable brokers={brokersToCompare} />
      ) : (
        <div className="text-center py-20 bg-card rounded-lg border border-input">
          <h2 className="text-2xl font-semibold text-gray-300">Your comparison list is empty.</h2>
          <p className="mt-2 text-gray-400">Add brokers to compare their features side-by-side.</p>
          <Link to="/brokers" className="mt-6 inline-block">
            <Button>Browse Brokers</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
