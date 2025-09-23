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
    { title: 'Avg. EUR/USD Spread', key: 'fees.trading.averageSpreads.eurusd' },
    { title: 'Commission', key: 'fees.trading.commissionStructure' },
    { title: 'Swap Fee Category', key: 'tradingConditions.swapFeeCategory' },
    { type: 'header', title: t('compareTable.features.tradingConditions') },
    { title: 'Max Leverage', key: 'tradingConditions.maxLeverage' },
    { title: 'Execution Model', key: 'coreInfo.brokerType' },
    { type: 'header', title: t('compareTable.features.accessibility') },
    { title: 'Min. Deposit', key: 'accessibility.minDeposit' },
    { title: 'Deposit Methods', key: 'depositWithdrawal.depositMethods' },
    { title: 'Withdrawal Methods', key: 'depositWithdrawal.withdrawalMethods' },
    { title: 'Support Channels', key: 'customerSupport.channels' },
    { type: 'header', title: t('compareTable.features.technology') },
    { title: 'Platforms', key: 'technology.platforms' },
    { title: 'Copy Trading', key: 'platformFeatures.copyTrading.available' },
    { type: 'header', title: t('compareTable.features.tradableInstruments') },
    { title: 'Forex Pairs', key: 'tradableInstruments.forexPairs.total' },
    { title: 'Stock CFDs', key: 'tradableInstruments.stocks.total' },
    { title: 'Cryptocurrencies', key: 'tradableInstruments.cryptocurrencies.total' },
    { type: 'header', title: t('compareTable.features.trust') },
    { title: 'Regulators', key: 'security.regulatedBy' },
    { title: 'Founded', key: 'foundingYear' },
    { title: 'Headquarters', key: 'headquarters' },
  ];

  const renderValue = (broker: Broker, key: string) => {
    const renderArrayWithTags = (arr: any[]) => (
      <div className="flex flex-wrap justify-center gap-1">
          {arr.slice(0, 3).map(item => <Tag key={typeof item === 'string' ? item : JSON.stringify(item)}>{typeof item === 'object' ? item.regulator : item}</Tag>)}
          {arr.length > 3 && <Tag>+{arr.length - 3} more</Tag>}
      </div>
    );
    
    switch (key) {
      case 'score': return <span className="text-2xl font-bold text-primary-400">{broker.score.toFixed(1)}</span>;
      case 'security.regulatedBy': return renderArrayWithTags(broker.security.regulatedBy);
      case 'depositWithdrawal.depositMethods': return renderArrayWithTags(broker.depositWithdrawal.depositMethods);
      case 'depositWithdrawal.withdrawalMethods': return renderArrayWithTags(broker.depositWithdrawal.withdrawalMethods);
      case 'accessibility.minDeposit': return broker.accountTypes && broker.accountTypes.length > 0 ? `$${broker.accountTypes[0].minDeposit}` : `$${broker.accessibility.minDeposit}`;
      case 'customerSupport.channels': return broker.customerSupport.channels.join(', ');
      case 'fees.trading.averageSpreads.eurusd': 
        const eurusdSpread = broker.fees.trading.averageSpreads.find(s => s.pair === 'EUR/USD');
        return eurusdSpread ? eurusdSpread.spread : '-';
      case 'technology.platforms': return broker.technology.platforms.join(', ');
      case 'tradingConditions.swapFeeCategory':
        const category = broker.tradingConditions.swapFeeCategory;
        const color = {
            'Low': 'text-green-400',
            'Standard': 'text-yellow-400',
            'High': 'text-red-400'
        }[category];
        return <span className={`font-semibold ${color}`}>{category}</span>;
      case 'platformFeatures.copyTrading.available':
        return broker.platformFeatures.copyTrading.available ? <span className="text-green-400 font-semibold">Yes</span> : <span>No</span>;
      case 'tradableInstruments.forexPairs.total': return broker.tradableInstruments.forexPairs.total > 0 ? broker.tradableInstruments.forexPairs.total : '-';
      case 'tradableInstruments.stocks.total': return broker.tradableInstruments.stocks.total > 0 ? broker.tradableInstruments.stocks.total : '-';
      case 'tradableInstruments.cryptocurrencies.total': return broker.tradableInstruments.cryptocurrencies.total > 0 ? broker.tradableInstruments.cryptocurrencies.total : '-';
      default:
        // Generic getter for simple values
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