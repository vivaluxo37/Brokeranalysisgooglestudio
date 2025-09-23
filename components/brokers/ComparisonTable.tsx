import React from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { Broker } from '../../types';
import Button from '../ui/Button';
import { useComparison } from '../../hooks/useComparison';
import Tag from '../ui/Tag';
import Tooltip from '../ui/Tooltip';
import { useTranslation } from '../../hooks/useTranslation';

interface ComparisonTableProps {
  brokers: Broker[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ brokers }) => {
  const { removeBrokerFromComparison } = useComparison();
  const { t } = useTranslation();

  const features = [
    { type: 'header', title: t('compareTable.features.overallScore') },
    { title: t('compareTable.features.score'), key: 'score' },
    { type: 'header', title: t('compareTable.features.tradingCosts') },
    { title: t('compareTable.features.eurusd'), key: 'tradingConditions.spreads.eurusd' },
    { title: t('compareTable.features.gbpusd'), key: 'tradingConditions.spreads.gbpusd' },
    { title: t('compareTable.features.usdjpy'), key: 'tradingConditions.spreads.usdjpy' },
    { title: t('compareTable.features.commission'), key: 'tradingConditions.commission' },
    { title: t('compareTable.features.swap'), key: 'tradingConditions.swapFeeCategory' },
    { type: 'header', title: t('compareTable.features.tradingConditions') },
    { title: t('compareTable.features.maxLeverage'), key: 'tradingConditions.maxLeverage' },
    { title: t('compareTable.features.executionType'), key: 'technology.executionType' },
    { type: 'header', title: t('compareTable.features.accessibility') },
    { title: t('compareTable.features.minDeposit'), key: 'accessibility.minDeposit' },
    { title: t('compareTable.features.depositMethods'), key: 'accessibility.depositMethods' },
    { title: t('compareTable.features.withdrawalMethods'), key: 'accessibility.withdrawalMethods' },
    { title: t('compareTable.features.support'), key: 'accessibility.customerSupport' },
    { type: 'header', title: t('compareTable.features.technology') },
    { title: t('compareTable.features.platforms'), key: 'technology.platforms' },
    { type: 'header', title: t('compareTable.features.tradableInstruments') },
    { title: t('compareTable.features.forexPairs'), key: 'tradableInstruments.forexPairs' },
    { title: t('compareTable.features.stocks'), key: 'tradableInstruments.stocks' },
    { title: t('compareTable.features.cryptocurrencies'), key: 'tradableInstruments.cryptocurrencies' },
    { type: 'header', title: t('compareTable.features.trust') },
    { title: t('compareTable.features.regulators'), key: 'regulation.regulators' },
    { title: t('compareTable.features.founded'), key: 'foundingYear' },
    { title: t('compareTable.features.headquarters'), key: 'headquarters' },
  ];

  const renderValue = (broker: Broker, key: string) => {
    // Helper to render array values as tags, showing up to 3
    const renderArrayWithTags = (arr: string[]) => (
      <div className="flex flex-wrap justify-center gap-1">
          {arr.slice(0, 3).map(item => <Tag key={item}>{item}</Tag>)}
          {arr.length > 3 && <Tag>+{arr.length - 3} more</Tag>}
      </div>
    );
    
    switch (key) {
      case 'score': return <span className="text-2xl font-bold text-primary-400">{broker.score.toFixed(1)}</span>;
      case 'regulation.regulators': return renderArrayWithTags(broker.regulation.regulators);
      case 'accessibility.depositMethods': return renderArrayWithTags(broker.accessibility.depositMethods);
      case 'accessibility.withdrawalMethods': return renderArrayWithTags(broker.accessibility.withdrawalMethods);
      case 'accessibility.minDeposit': return `$${broker.accessibility.minDeposit}`;
      case 'accessibility.customerSupport': return broker.accessibility.customerSupport.join(', ');
      case 'tradingConditions.spreads.eurusd': return `${broker.tradingConditions.spreads.eurusd} pips`;
      case 'tradingConditions.spreads.gbpusd': return `${broker.tradingConditions.spreads.gbpusd} pips`;
      case 'tradingConditions.spreads.usdjpy': return `${broker.tradingConditions.spreads.usdjpy} pips`;
      case 'technology.platforms': return broker.technology.platforms.join(', ');
      case 'tradingConditions.swapFeeCategory':
        const category = broker.tradingConditions.swapFeeCategory;
        const color = {
            'Low': 'text-green-400',
            'Standard': 'text-yellow-400',
            'High': 'text-red-400'
        }[category];
        return <span className={`font-semibold ${color}`}>{category}</span>;
      case 'tradableInstruments.forexPairs': return broker.tradableInstruments.forexPairs.total > 0 ? broker.tradableInstruments.forexPairs.total : '-';
      case 'tradableInstruments.stocks': return broker.tradableInstruments.stocks.total > 0 ? broker.tradableInstruments.stocks.total : '-';
      case 'tradableInstruments.cryptocurrencies': return broker.tradableInstruments.cryptocurrencies.total > 0 ? broker.tradableInstruments.cryptocurrencies.total : '-';
      default:
        // Generic getter for simple values like 'foundingYear', 'headquarters', etc.
        const keys = key.split('.');
        let value: any = broker;
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return '-';
            }
        }
        return typeof value === 'number' ? value.toLocaleString() : value;
    }
  };

  return (
    <div className="overflow-x-auto bg-card rounded-lg border border-input">
      <table className="w-full min-w-max text-left">
        <thead>
          <tr className="border-b border-input">
            <th className="p-4 sticky left-0 bg-card z-10 border-r border-input">{t('compareTable.feature')}</th>
            {brokers.map(broker => (
              <th key={broker.id} className="p-4 text-center min-w-[200px]">
                <ReactRouterDOM.Link to={`/broker/${broker.id}`}>
                  <img src={broker.logoUrl} alt={broker.name} className="h-10 mx-auto bg-white p-1 rounded-md mb-2"/>
                  <span className="font-semibold text-primary-400 hover:underline">{broker.name}</span>
                </ReactRouterDOM.Link>
                <div className="flex justify-center items-center gap-2 mt-2">
                    <a href={broker.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" size="sm" className="text-xs px-3 py-1">{t('compareTable.visit')}</Button>
                    </a>
                    <Tooltip content={`Remove ${broker.name} from comparison`}>
                      <Button onClick={() => removeBrokerFromComparison(broker.id)} variant="danger" size="sm" className="text-xs px-2 py-1">{t('compareTable.remove')}</Button>
                    </Tooltip>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature: any) => { // Using 'any' to easily check for 'type'
            if (feature.type === 'header') {
              return (
                <tr key={feature.title} className="bg-input/30">
                  <th colSpan={brokers.length + 1} className="p-2 pl-4 text-left text-sm font-bold text-primary-400 tracking-wider sticky left-0 bg-input/30 z-10">
                    {feature.title}
                  </th>
                </tr>
              );
            }
            return (
              <tr key={feature.key} className="border-b border-input last:border-b-0">
                <td className="p-4 font-semibold text-foreground/80 whitespace-nowrap sticky left-0 bg-card z-10 border-r border-input">{feature.title}</td>
                {brokers.map(broker => (
                  <td key={broker.id} className="p-4 text-center align-top">
                    {renderValue(broker, feature.key)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;