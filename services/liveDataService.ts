import { useState, useEffect, useRef } from 'react';
import { brokers as allBrokers } from '../data/brokers';
import { Broker } from '../types';

export type Instrument = 'EUR/USD' | 'GBP/USD' | 'USD/JPY' | 'XAU/USD' | 'BTC/USD';

export interface LiveCostData {
  brokerId: string;
  spread: number; // in pips
  commission: number; // per standard lot, round turn
}

// Base values to simulate fluctuations from
const baseSpreads: Record<Instrument, Record<string, number>> = {
  'EUR/USD': {
    pepperstone: 0.1,
    'ic-markets': 0.0,
    xtb: 0.5,
    'forex-com': 1.0,
  },
  'GBP/USD': {
    pepperstone: 0.4,
    'ic-markets': 0.2,
    xtb: 0.8,
    'forex-com': 1.5,
  },
  'USD/JPY': {
    pepperstone: 0.2,
    'ic-markets': 0.1,
    xtb: 0.6,
    'forex-com': 1.2,
  },
  'XAU/USD': { // Gold
    pepperstone: 1.5, // Cents as pips
    'ic-markets': 1.2,
    xtb: 2.5,
    'forex-com': 4.5,
  },
  'BTC/USD': { // Bitcoin
    pepperstone: 12.0, // Dollars as pips
    'ic-markets': 10.0,
    xtb: 25.0,
    'forex-com': 30.0,
  },
};

const getCommission = (broker: Broker): number => {
  const commissionStr = (broker.tradingConditions?.commission || '').toLowerCase();
  if (commissionStr.includes('zero') || commissionStr.includes('included')) {
    return 0;
  }
  // Extract number from strings like "$3.50 per lot"
  const match = commissionStr.match(/(\d+\.?\d*)/);
  if (match) {
    // This is per side, typically. So multiply by 2 for round turn.
    return parseFloat(match[1]) * 2;
  }
  return 7.0; // Default fallback
};


export const useLiveData = (brokerIds: string[], instrument: Instrument) => {
  const [liveData, setLiveData] = useState<LiveCostData[]>([]);
  const brokers = useRef(allBrokers.filter(b => brokerIds.includes(b.id)));
  
  useEffect(() => {
    // Update brokers ref if brokerIds change
    brokers.current = allBrokers.filter(b => brokerIds.includes(b.id));
  }, [brokerIds])

  useEffect(() => {
    const generateData = () => {
      const newData = brokers.current.map(broker => {
        const baseSpread = baseSpreads[instrument][broker.id] ?? 1.0;
        // Fluctuation: +/- 20% of the base spread
        const fluctuation = baseSpread * 0.2 * (Math.random() - 0.5) * 2;
        const currentSpread = parseFloat((baseSpread + fluctuation).toFixed(2));
        
        return {
          brokerId: broker.id,
          spread: Math.max(0, currentSpread),
          commission: getCommission(broker),
        };
      });
      setLiveData(newData);
    };

    generateData(); // Initial data load
    const interval = setInterval(generateData, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [instrument, brokerIds]);

  return liveData;
};
