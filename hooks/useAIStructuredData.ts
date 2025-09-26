import { useMemo } from 'react';
import { brokers } from '../data/brokers';

interface AIStructuredDataContent {
  title: string;
  description: string;
  category: string;
  targetAudience: string[];
  keyTopics: string[];
  entities: Array<{
    name: string;
    type: string;
    description?: string;
    attributes?: Record<string, any>;
  }>;
  relationships: Array<{
    from: string;
    to: string;
    type: string;
    description: string;
  }>;
  actionItems: Array<{
    action: string;
    requirement: string;
    outcome: string;
  }>;
}

export const useAIStructuredData = (filteredBrokers: typeof brokers, config?: any): AIStructuredDataContent => {
  return useMemo(() => {
    const topBrokers = filteredBrokers.slice(0, 10);
    const allRegulators = [...new Set(filteredBrokers.flatMap(b => b.regulation.regulators))];
    const allPlatforms = [...new Set(filteredBrokers.flatMap(b => b.technology.platforms))];

    return {
      title: config?.title || 'Forex Broker Comparison',
      description: config?.description || 'Comprehensive analysis and comparison of forex brokers with detailed insights on regulations, trading conditions, and features.',
      category: 'FinancialServicesComparison',
      targetAudience: [
        'Retail Forex Traders',
        'Beginner Traders',
        'Experienced Traders',
        'Day Traders',
        'Swing Traders',
        'Algorithmic Traders',
        'Investment Advisors'
      ],
      keyTopics: [
        'Forex Broker Regulation',
        'Trading Platform Comparison',
        'Spread and Commission Analysis',
        'Leverage and Margin Requirements',
        'Account Types and Features',
        'Risk Management Tools',
        'Customer Support Quality',
        'Educational Resources',
        'Mobile Trading Capabilities',
        'Copy Trading Features'
      ],
      entities: [
        ...topBrokers.map(broker => ({
          name: broker.name,
          type: 'FinancialService',
          description: `${broker.regulation.regulators.join(', ')} regulated forex broker founded in ${broker.foundingYear}`,
          attributes: {
            foundingYear: broker.foundingYear,
            minimumDeposit: broker.accessibility.minDeposit,
            maximumLeverage: broker.tradingConditions.maxLeverage,
            averageSpread: broker.tradingConditions.spreads.eurusd,
            regulatoryStatus: broker.regulation.regulators,
            tradingPlatforms: broker.technology.platforms,
            headquarterLocation: broker.headquarters,
            customerSupport: broker.customerSupport
          }
        })),
        ...allRegulators.map(regulator => ({
          name: regulator,
          type: 'RegulatoryOrganization',
          description: `Financial regulatory authority overseeing forex brokers`,
          attributes: {
            jurisdiction: regulator === 'FCA' ? 'United Kingdom' :
                         regulator === 'CySEC' ? 'Cyprus' :
                         regulator === 'ASIC' ? 'Australia' :
                         regulator === 'NFA' ? 'United States' : 'International'
          }
        })),
        ...allPlatforms.map(platform => ({
          name: platform,
          type: 'TradingPlatform',
          description: `Electronic trading platform for forex and CFD trading`,
          attributes: {
            platformType: platform.includes('MetaTrader') ? 'Third-Party' : 'Proprietary',
            features: ['Charting', 'Automated Trading', 'Mobile Access']
          }
        }))
      ],
      relationships: [
        ...topBrokers.flatMap(broker =>
          broker.regulation.regulators.map(regulator => ({
            from: broker.name,
            to: regulator,
            type: 'regulatedBy',
            description: `${broker.name} is regulated by ${regulator}`
          }))
        ),
        ...topBrokers.flatMap(broker =>
          broker.technology.platforms.map(platform => ({
            from: broker.name,
            to: platform,
            type: 'offersPlatform',
            description: `${broker.name} offers trading on ${platform}`
          }))
        )
      ],
      actionItems: [
        {
          action: 'Verify Regulatory Status',
          requirement: 'Check broker\'s regulatory licenses with FCA, CySEC, ASIC, or NFA',
          outcome: 'Ensure fund safety and regulatory protection'
        },
        {
          action: 'Compare Trading Costs',
          requirement: 'Analyze spreads, commissions, and swap rates across brokers',
          outcome: 'Minimize trading costs and maximize profitability'
        },
        {
          action: 'Test Trading Platforms',
          requirement: 'Demo trade on available platforms to evaluate usability',
          outcome: 'Choose platform that matches trading style and technical needs'
        },
        {
          action: 'Evaluate Account Types',
          requirement: 'Review minimum deposits, leverage options, and account features',
          outcome: 'Select account type that fits capital and trading strategy'
        },
        {
          action: 'Assess Customer Support',
          requirement: 'Test response times and support quality through multiple channels',
          outcome: 'Ensure reliable support when trading issues arise'
        }
      ]
    };
  }, [filteredBrokers, config]);
};