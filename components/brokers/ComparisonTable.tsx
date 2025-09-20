

import React from 'react';
import { Link } from 'react-router-dom';
import { Broker } from '../../types';
import Button from '../ui/Button';
import { useComparison } from '../../hooks/useComparison';
import Tag from '../ui/Tag';

interface ComparisonTableProps {
  brokers: Broker[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ brokers }) => {
  const { removeBrokerFromComparison } = useComparison();

  const features = [
    { title: 'Score', key: 'score' },
    { title: 'Founded', key: 'foundingYear' },
    { title: 'Headquarters', key: 'headquarters' },
    { title: 'Regulators', key: 'regulation.regulators' },
    { title: 'Min. Deposit', key: 'accessibility.minDeposit' },
    { title: 'Customer Support', key: 'accessibility.customerSupport' },
    { title: 'Max Leverage', key: 'tradingConditions.maxLeverage' },
    { title: 'EUR/USD Spread', key: 'tradingConditions.spreads.eurusd' },
    { title: 'Platforms', key: 'technology.platforms' },
    { title: 'Execution Type', key: 'technology.executionType' },
  ];

  const renderValue = (broker: Broker, key: string) => {
    switch (key) {
      case 'score': return <span className="text-2xl font-bold text-primary-400">{broker.score.toFixed(1)}</span>;
      case 'regulation.regulators': return broker.regulation.regulators.map(r => <Tag key={r}>{r}</Tag>);
      case 'accessibility.minDeposit': return `$${broker.accessibility.minDeposit}`;
      case 'accessibility.customerSupport': return broker.accessibility.customerSupport.join(', ');
      case 'tradingConditions.spreads.eurusd': return `${broker.tradingConditions.spreads.eurusd} pips`;
      case 'technology.platforms': return broker.technology.platforms.join(', ');
      default:
        const keys = key.split('.');
        let value: any = broker;
        for (const k of keys) {
            value = value[k];
        }
        return value;
    }
  };

  return (
    <div className="overflow-x-auto bg-card rounded-lg border border-input">
      <table className="w-full min-w-max text-left">
        <thead>
          <tr className="border-b border-input">
            <th className="p-4 w-1/4">Feature</th>
            {brokers.map(broker => (
              <th key={broker.id} className="p-4 text-center">
                <Link to={`/broker/${broker.id}`}>
                  <img src={broker.logoUrl} alt={broker.name} className="h-10 mx-auto bg-white p-1 rounded-md mb-2"/>
                  <span className="font-semibold text-primary-400 hover:underline">{broker.name}</span>
                </Link>
                <Button onClick={() => removeBrokerFromComparison(broker.id)} variant="danger" size="sm" className="mt-2 text-xs px-2 py-1">Remove</Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map(feature => (
            <tr key={feature.key} className="border-b border-input last:border-b-0">
              <td className="p-4 font-semibold text-gray-300">{feature.title}</td>
              {brokers.map(broker => (
                <td key={broker.id} className="p-4 text-center align-top">
                  {renderValue(broker, feature.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;