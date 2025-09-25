import { Broker } from '../types';

// Helper to parse leverage string like "1:500" into a number 500
const parseLeverage = (leverageStr: string): number => {
  if (!leverageStr || typeof leverageStr !== 'string') return 0;
  if (leverageStr.toLowerCase().includes('unlimited')) return Infinity;
  const num = parseInt(leverageStr.split(':')[1], 10);
  return isNaN(num) ? 0 : num;
};

// Helper to parse commission string like "$3.50 per lot" into a round-trip number
const parseCommission = (commissionStr: string): number => {
  if (!commissionStr || typeof commissionStr !== 'string') return 0;
  if (commissionStr.toLowerCase().includes('zero')) return 0;
  const match = commissionStr.match(/(\d+\.?\d*)/);
  if (match) {
    // Assume the value is per side and double it for round-trip
    return parseFloat(match[1]) * 2;
  }
  return 0;
};


interface CategoryPageInfo {
  name: string;
  path: string;
  title: string;
  description: string;
  filterFn: (broker: Broker) => boolean;
}

const regionFilters: CategoryPageInfo[] = [
  {
    name: 'Europe (FCA, CySEC)',
    path: '/brokers/region/europe',
    title: 'Best Forex Brokers in Europe',
    description: 'Find top brokers regulated by FCA, CySEC, BaFin, and FINMA, offering robust protection for European traders.',
    filterFn: (b) => b.regulation.regulators.some(r => ['FCA', 'CySEC', 'BaFin', 'FINMA', 'KNF', 'FSA (Denmark)', 'Central Bank of Ireland', 'CSSF'].includes(r)),
  },
  {
    name: 'North America (NFA, CIRO)',
    path: '/brokers/region/north-america',
    title: 'Best Forex Brokers in North America',
    description: 'Explore brokers regulated by the NFA (USA) and CIRO (Canada), offering the highest levels of security for North American clients.',
    filterFn: (b) => b.regulation.regulators.some(r => ['NFA', 'CFTC', 'CIRO'].includes(r)),
  },
  {
    name: 'Asia-Pacific (ASIC, MAS)',
    path: '/brokers/region/asia-pacific',
    title: 'Best Forex Brokers in Asia-Pacific',
    description: 'Discover leading brokers regulated by ASIC (Australia), MAS (Singapore), and FSA (Japan) for traders in the APAC region.',
    filterFn: (b) => b.regulation.regulators.some(r => ['ASIC', 'MAS (Singapore)', 'FSA (Japan)'].includes(r)),
  },
  {
    name: 'Middle East (DFSA)',
    path: '/brokers/region/middle-east',
    title: 'Best Forex Brokers in the Middle East',
    description: 'Find trusted brokers regulated by the DFSA (Dubai) and other regional authorities, catering to traders in the MENA region.',
    filterFn: (b) => b.regulation.regulators.includes('DFSA'),
  },
  {
    name: 'Africa (FSCA)',
    path: '/brokers/region/africa',
    title: 'Best Forex Brokers for Africa',
    description: 'Compare top brokers regulated by the FSCA (South Africa) and other reputable bodies, offering services across the African continent.',
    filterFn: (b) => b.regulation.regulators.includes('FSCA'),
  },
  {
    name: 'International (High Leverage)',
    path: '/brokers/region/international',
    title: 'International & Offshore Forex Brokers',
    description: 'Explore international brokers offering services globally, often with higher leverage options. Ensure you understand the risks associated with offshore regulation.',
    filterFn: (b) => b.regulation.regulators.some(r => ['IFSC', 'FSC Belize', 'SCB', 'FSA'].includes(r)) && !b.regulation.regulators.some(r => ['FCA', 'ASIC', 'NFA'].includes(r)),
  }
];

const platformAndTypeFilters: CategoryPageInfo[] = [
  {
    name: 'Best for Beginners',
    path: '/brokers/type/beginners',
    title: 'Best Forex Brokers for Beginners',
    description: 'Start your trading journey with brokers offering user-friendly platforms, low minimum deposits, and comprehensive educational resources.',
    filterFn: (b) => b.accessibility.minDeposit <= 100 && b.score > 8.0,
  },
  {
    name: 'MT4 Brokers',
    path: '/brokers/platform/mt4',
    title: 'Best MT4 Forex Brokers',
    description: 'Find top-rated forex brokers offering the powerful and popular MetaTrader 4 (MT4) platform, renowned for its charting tools and automated trading capabilities.',
    filterFn: (b) => b.technology.platforms.includes('MT4'),
  },
  {
    name: 'ECN Brokers',
    path: '/brokers/type/ecn',
    title: 'Best ECN Forex Brokers',
    description: 'For serious traders seeking direct market access, tight spreads, and fast execution. Compare the top true ECN brokers.',
    filterFn: (b) => b.technology.executionType.includes('ECN'),
  },
  {
    name: 'Scalping Brokers',
    path: '/brokers/type/scalping',
    title: 'Best Brokers for Scalping',
    description: 'Maximize your high-frequency trading strategy with brokers offering the lowest spreads, fastest execution, and ECN/STP environments.',
    filterFn: (b) => {
      const commissionCost = parseCommission(b.tradingConditions.commission) / 10; // Convert commission from $ to pips
      const totalCost = b.tradingConditions.spreads.eurusd + commissionCost;
      return b.technology.executionType.includes('ECN') && totalCost < 0.8;
    },
  },
  {
    name: 'Copy Trading',
    path: '/brokers/type/copy-trading',
    title: 'Best Copy Trading Brokers',
    description: 'Leverage the expertise of seasoned traders. Explore the best platforms for social and copy trading to automate your strategy.',
    filterFn: (b) => b.copyTrading === true || b.platformFeatures.copyTrading.available,
  },
  {
    name: 'Islamic Brokers',
    path: '/brokers/type/islamic',
    title: 'Best Islamic (Swap-Free) Forex Brokers',
    description: 'Find Sharia-compliant forex brokers that offer swap-free accounts, ensuring your trading aligns with Islamic finance principles.',
    filterFn: (b) => b.isIslamic === true || b.accountManagement.islamicAccount.available,
  },
  {
    name: 'High Leverage',
    path: '/brokers/type/high-leverage',
    title: 'High Leverage Forex Brokers',
    description: 'Explore brokers offering high leverage (1:500 or greater) to maximize your trading potential. Understand the associated risks and benefits.',
    filterFn: (b) => parseLeverage(b.tradingConditions.maxLeverage) >= 500,
  },
  {
    name: 'Stock Trading',
    path: '/brokers/type/stock-trading',
    title: 'Best Brokers for Stock Trading',
    description: 'Diversify your portfolio with brokers that offer a wide range of stock CFDs and other equity instruments from global markets.',
    filterFn: (b) => (b.tradableInstruments?.stocks?.total ?? 0) > 100,
  },
  {
    name: 'Telegram Signals',
    path: '/brokers/type/telegram-signals',
    title: 'Brokers with Telegram Signals',
    description: 'Get real-time trading signals and market analysis directly to your device. Find brokers that offer integrated Telegram signal services.',
    filterFn: (b) => b.providesSignals === true,
  },
   {
    name: 'Gold (XAU/USD)',
    path: '/brokers/type/gold-trading',
    title: 'Best Brokers for Gold (XAU/USD) Trading',
    description: 'Trade one of the world\'s most popular commodities. Find brokers with low spreads and excellent conditions for trading Gold.',
    filterFn: (b) => (b.tradableInstruments?.commodities?.total ?? 0) > 0,
  },
];

export const categoryPages: CategoryPageInfo[] = [...regionFilters, ...platformAndTypeFilters];

export const categoryPageGroups = {
    region: regionFilters.map(({ name, path }) => ({ name, path })),
    platform: platformAndTypeFilters.map(({ name, path }) => ({ name, path })),
};