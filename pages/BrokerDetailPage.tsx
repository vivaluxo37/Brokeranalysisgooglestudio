import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { brokers } from '../data/brokers';
import NotFoundPage from './NotFoundPage';
import Tag from '../components/ui/Tag';
import Button from '../components/ui/Button';
import { useComparison } from '../hooks/useComparison';
import { Icons } from '../constants';
import StarRating from '../components/ui/StarRating';

const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">{children}</dd>
    </div>
);


const BrokerDetailPage: React.FC = () => {
  const { brokerId } = useParams<{ brokerId: string }>();
  const broker = brokers.find(b => b.id === brokerId);
  const { addBrokerToComparison, removeBrokerFromComparison, isBrokerInComparison } = useComparison();

  if (!broker) {
    return <NotFoundPage />;
  }

  const inCompare = isBrokerInComparison(broker.id);
  const handleCompareClick = () => {
      if (inCompare) {
          removeBrokerFromComparison(broker.id);
      } else {
          addBrokerToComparison(broker.id);
      }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-lg shadow-xl overflow-hidden border border-input">
        <div className="p-6 md:flex md:items-center md:justify-between bg-input/30">
            <div className="flex-1 min-w-0">
                <div className="flex items-center">
                    <img className="h-16 w-16 bg-white p-2 rounded-md" src={broker.logoUrl} alt={`${broker.name} logo`} />
                    <div className="ml-4">
                        <h1 className="text-3xl font-bold leading-7 text-white sm:truncate">{broker.name}</h1>
                        <p className="text-gray-400 mt-1">{broker.headquarters} &bull; Est. {broker.foundingYear}</p>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex flex-col items-center md:mt-0 md:ml-4">
                <span className="text-5xl font-bold text-primary-400">{broker.score.toFixed(1)}</span>
                <StarRating score={broker.score} className="mt-1" size="lg" />
            </div>
        </div>

        <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">About {broker.name}</h2>
            <p className="text-gray-300">{broker.description}</p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-primary-400 mb-2">Regulation</h3>
                    <dl>
                        <DetailItem label="Regulators">{broker.regulation.regulators.map(r => <Tag key={r}>{r}</Tag>)}</DetailItem>
                    </dl>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-primary-400 mb-2">Accessibility</h3>
                    <dl>
                        <DetailItem label="Minimum Deposit">${broker.accessibility.minDeposit}</DetailItem>
                        <DetailItem label="Customer Support">{broker.accessibility.customerSupport.join(', ')}</DetailItem>
                    </dl>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-primary-400 mb-2">Trading Conditions</h3>
                    <dl>
                        <DetailItem label="EUR/USD Spread">{broker.tradingConditions.spreads.eurusd} pips</DetailItem>
                        <DetailItem label="Max Leverage">{broker.tradingConditions.maxLeverage}</DetailItem>
                        <DetailItem label="Commission">{broker.tradingConditions.commission}</DetailItem>
                    </dl>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-primary-400 mb-2">Technology</h3>
                    <dl>
                        <DetailItem label="Platforms">{broker.technology.platforms.join(', ')}</DetailItem>
                        <DetailItem label="Execution Type">{broker.technology.executionType}</DetailItem>
                    </dl>
                </div>
            </div>
            <div className="mt-8 flex justify-center gap-4">
                <Button onClick={handleCompareClick} variant={inCompare ? "secondary" : "primary"}>
                    {inCompare ? <Icons.compareRemove className="h-5 w-5 mr-2" /> : <Icons.compare className="h-5 w-5 mr-2" />}
                    {inCompare ? "Remove from Compare" : "Add to Compare"}
                </Button>
                <Link to="/compare">
                    <Button variant="ghost">Go to Comparison</Button>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerDetailPage;