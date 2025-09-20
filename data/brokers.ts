
import { Broker } from '../types';

export const brokers: Broker[] = [
  {
    id: 'pepperstone',
    name: 'Pepperstone',
    logoUrl: 'https://picsum.photos/seed/pepperstone/200/200',
    score: 9.2,
    foundingYear: 2010,
    headquarters: 'Melbourne, Australia',
    description: 'Pepperstone is an award-winning online broker known for its fast execution, low spreads, and a wide range of trading platforms. It is regulated by top-tier authorities like ASIC and the FCA.',
    regulation: {
      regulators: ['ASIC', 'FCA', 'CySEC', 'DFSA'],
    },
    tradingConditions: {
      spreads: { eurusd: 0.1, gbpusd: 0.4, usdjpy: 0.2 },
      commission: '$3.50 per lot',
      swapFees: 'Standard',
      maxLeverage: '1:500',
    },
    accessibility: {
      minDeposit: 200,
      depositMethods: ['Credit Card', 'Bank Transfer', 'PayPal', 'Skrill'],
      withdrawalMethods: ['Credit Card', 'Bank Transfer', 'PayPal'],
      customerSupport: ['24/5 Live Chat', 'Phone', 'Email'],
    },
    technology: {
      platforms: ['MT4', 'MT5', 'cTrader', 'TradingView'],
      executionType: 'ECN/STP',
    },
    reviews: [
      { id: 'rev1', brokerId: 'pepperstone', userId: 'user123', userName: 'Alice', rating: 5, comment: 'Excellent spreads and customer service. Highly recommend!', date: '2023-10-26T10:00:00Z' },
      { id: 'rev2', brokerId: 'pepperstone', userId: 'user456', userName: 'Bob', rating: 4, comment: 'Good platform selection, but withdrawal took a bit longer than expected.', date: '2023-10-22T14:30:00Z' },
    ],
  },
  {
    id: 'ic-markets',
    name: 'IC Markets',
    logoUrl: 'https://picsum.photos/seed/icmarkets/200/200',
    score: 9.0,
    foundingYear: 2007,
    headquarters: 'Sydney, Australia',
    description: 'IC Markets is one of the most renowned Forex CFD providers, offering trading solutions for active day traders and scalpers as well as traders that are new to the forex market.',
    regulation: {
      regulators: ['ASIC', 'CySEC', 'FSA'],
    },
    tradingConditions: {
      spreads: { eurusd: 0.0, gbpusd: 0.2, usdjpy: 0.1 },
      commission: '$3.50 per lot',
      swapFees: 'Low',
      maxLeverage: '1:500',
    },
    accessibility: {
      minDeposit: 200,
      depositMethods: ['Credit Card', 'Bank Transfer', 'PayPal', 'Neteller'],
      withdrawalMethods: ['Credit Card', 'Bank Transfer', 'PayPal'],
      customerSupport: ['24/7 Live Chat', 'Phone', 'Email'],
    },
    technology: {
      platforms: ['MT4', 'MT5', 'cTrader'],
      executionType: 'ECN',
    },
    reviews: [
      { id: 'rev3', brokerId: 'ic-markets', userId: 'user789', userName: 'Charlie', rating: 5, comment: 'The raw spreads are unbeatable for scalping. 24/7 support is a huge plus.', date: '2023-09-15T08:00:00Z' },
    ],
  },
  {
    id: 'xtb',
    name: 'XTB',
    logoUrl: 'https://picsum.photos/seed/xtb/200/200',
    score: 8.8,
    foundingYear: 2002,
    headquarters: 'Warsaw, Poland',
    description: 'XTB is a global, publicly-traded CFDs and forex broker with an excellent proprietary trading platform, xStation 5, and great customer service.',
    regulation: {
      regulators: ['FCA', 'KNF', 'CySEC', 'IFSC'],
    },
    tradingConditions: {
      spreads: { eurusd: 0.5, gbpusd: 0.8, usdjpy: 0.6 },
      commission: 'Zero on Standard accounts',
      swapFees: 'Standard',
      maxLeverage: '1:500',
    },
    accessibility: {
      minDeposit: 0,
      depositMethods: ['Bank Transfer', 'Credit Card', 'Skrill'],
      withdrawalMethods: ['Bank Transfer', 'Credit Card'],
      customerSupport: ['24/5 Live Chat', 'Phone', 'Email'],
    },
    technology: {
      platforms: ['xStation 5'],
      executionType: 'Market Maker',
    },
    reviews: [
      { id: 'rev4', brokerId: 'xtb', userId: 'user101', userName: 'David', rating: 4, comment: 'xStation 5 is a fantastic platform. Very intuitive.', date: '2023-11-01T11:20:00Z' },
      { id: 'rev5', brokerId: 'xtb', userId: 'user112', userName: 'Eve', rating: 5, comment: 'No minimum deposit is great for beginners. I started with a small amount and had no issues.', date: '2023-08-05T18:45:00Z' },
    ],
  },
  {
    id: 'forex-com',
    name: 'Forex.com',
    logoUrl: 'https://picsum.photos/seed/forexcom/200/200',
    score: 8.5,
    foundingYear: 2001,
    headquarters: 'New Jersey, USA',
    description: 'Forex.com is a trusted global brand, offering a wide range of markets and a comprehensive trading experience through its advanced platforms.',
    regulation: {
      regulators: ['FCA', 'NFA', 'ASIC', 'CIMA'],
    },
    tradingConditions: {
      spreads: { eurusd: 1.0, gbpusd: 1.5, usdjpy: 1.2 },
      commission: 'Included in spread',
      swapFees: 'High',
      maxLeverage: '1:400',
    },
    accessibility: {
      minDeposit: 100,
      depositMethods: ['Credit Card', 'Debit Card', 'Bank Transfer'],
      withdrawalMethods: ['Credit Card', 'Bank Transfer'],
      customerSupport: ['24/5 Phone', 'Email'],
    },
    technology: {
      platforms: ['MT4', 'MT5', 'Advanced Trading Platform'],
      executionType: 'Market Maker',
    },
    reviews: [],
  },
];