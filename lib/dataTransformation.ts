import { Broker } from './supabase';

// Transform database broker data to match enhanced category filter expectations
export const transformBrokerData = (broker: Broker): any => {
  return {
    ...broker,
    // Map database fields to expected structure
    score: broker.rating || 8.0,
    rating: broker.rating || 8.0,
    coreInfo: {
      brokerType: broker.account_types?.split(',')[0] || 'Standard',
      mobileTrading: broker.platforms?.includes('Mobile') || true,
      demoAccount: true // Assume demo accounts are available
    },
    fees: {
      trading: {
        averageSpreads: broker.spreads_from ? [{
          spread: broker.spreads_from.toString()
        }] : [],
        commissionStructure: broker.commission ? `$${broker.commission}` : 'Zero',
        spreadType: 'Variable' // Default to variable spreads
      }
    },
    tradingConditionsExtended: {
      maxLeverage: broker.max_leverage ? `1:${broker.max_leverage}` : '1:100',
      scalpingAllowed: true,
      hedgingAllowed: true,
      eaAllowed: true,
      instantExecution: true,
      trailingStopAvailable: true,
      minTradeSize: 0.01
    },
    technology: {
      platforms: broker.platforms?.split(',').map(p => p.trim()) || ['Web'],
      apiSupport: broker.platforms?.includes('API') || false
    },
    tradableInstruments: {
      forexPairs: { total: 50 }, // Default assumption
      indices: { total: 20 },
      stocks: { total: 500 },
      cryptocurrencies: { total: 10 }
    },
    security: {
      regulatedBy: broker.regulation ?
        broker.regulation.split(',').map(reg => ({
          regulator: reg.trim()
        })) : []
    },
    accessibility: {
      minDeposit: broker.min_deposit || 100
    },
    accountTypes: broker.account_types ?
      broker.account_types.split(',').map((type, index) => ({
        name: type.trim(),
        minDeposit: broker.min_deposit || 100,
        type: type.trim()
      })) : [{
        name: 'Standard Account',
        minDeposit: broker.min_deposit || 100,
        type: 'Standard'
      }],
    isIslamic: broker.account_types?.toLowerCase().includes('islamic') || false,
    copyTrading: broker.features?.includes('Copy Trading') || false,
    bonuses: broker.has_promotions ? {
      welcomeBonus: 'Available'
    } : null,
    promotions: broker.has_promotions ? [{
      type: 'Welcome Bonus'
    }] : [],
    accountManagement: {
      islamicAccount: {
        available: broker.account_types?.toLowerCase().includes('islamic') || false
      },
      corporateAccount: {
        available: broker.account_types?.toLowerCase().includes('corporate') || false
      }
    },
    platformFeatures: {
      pamm: {
        available: broker.features?.includes('PAMM') || false
      },
      orderTypes: broker.features?.includes('Advanced Orders') ?
        ['Market', 'Limit', 'Stop', 'Trailing Stop'] : ['Market', 'Limit', 'Stop']
    }
  };
};

// Transform an array of brokers
export const transformBrokersData = (brokers: Broker[]): any[] => {
  return brokers.map(transformBrokerData);
};