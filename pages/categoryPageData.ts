import { Broker } from '../types';

// Helper to parse leverage string like "1:500" into a number 500
const parseLeverage = (leverageStr: string): number => {
  if (!leverageStr || typeof leverageStr !== 'string') return 0;
  if (leverageStr.toLowerCase().includes('unlimited')) return Infinity;
  const num = parseInt(leverageStr.split(':')[1], 10);
  return isNaN(num) ? 0 : num;
};

interface CategoryPageInfo {
  name: string;
  path: string;
  title: string;
  description: string;
  filterFn: (broker: Broker) => boolean;
}

const countryFilters: CategoryPageInfo[] = [
  {
    name: 'Australia',
    path: '/brokers/country/australia',
    title: 'Australian Forex Brokers',
    description: 'Find the best ASIC-regulated forex brokers for Australian traders, offering competitive spreads and excellent trading platforms.',
    filterFn: (b) => b.regulation.regulators.includes('ASIC') || b.headquarters.includes('Australia'),
  },
  {
    name: 'Canada',
    path: '/brokers/country/canada',
    title: 'Canadian Forex Brokers',
    description: 'Explore our list of CIRO (formerly IIROC)-regulated forex brokers available to Canadian traders, prioritizing safety and compliance.',
    filterFn: (b) => b.regulation.regulators.includes('IIROC (Canada)') || b.regulation.regulators.includes('CIRO') || b.headquarters.includes('Canada'),
  },
  {
    name: 'UK',
    path: '/brokers/country/uk',
    title: 'UK Forex Brokers',
    description: 'Discover top-tier, FCA-regulated forex brokers in the United Kingdom, known for their robust client protection and advanced trading tools.',
    filterFn: (b) => b.regulation.regulators.includes('FCA') || b.headquarters.includes('UK'),
  },
  {
    name: 'South Africa',
    path: '/brokers/country/south-africa',
    title: 'South Africa Forex Brokers',
    description: 'Browse the best FSCA-regulated forex brokers for South African traders, with ZAR accounts and local support.',
    filterFn: (b) => b.regulation.regulators.includes('FSCA') || b.headquarters.includes('South Africa'),
  },
  {
    name: 'USA',
    path: '/brokers/country/usa',
    title: 'US Forex Brokers',
    description: 'Find the best NFA and CFTC-regulated forex brokers for traders in the United States, offering high levels of security and compliance.',
    filterFn: (b) => b.regulation.regulators.includes('NFA') || b.regulation.regulators.includes('CFTC') || b.headquarters.includes('USA'),
  },
  {
    name: 'Dubai (UAE)',
    path: '/brokers/country/dubai',
    title: 'Forex Brokers in Dubai',
    description: 'A curated list of DFSA and SCA-regulated forex brokers operating in Dubai and the UAE, offering premium services for traders in the region.',
    filterFn: (b) => b.regulation.regulators.includes('DFSA') || b.regulation.regulators.includes('SCA (UAE)') || b.headquarters.includes('UAE'),
  },
  {
    name: 'Singapore',
    path: '/brokers/country/singapore',
    title: 'Singapore Forex Brokers',
    description: 'Discover the top MAS-regulated forex brokers for traders in Singapore, known for their strong regulatory environment and technological innovation.',
    filterFn: (b) => b.regulation.regulators.includes('MAS (Singapore)') || b.headquarters.includes('Singapore'),
  },
];

const platformAndTypeFilters: CategoryPageInfo[] = [
  {
    name: 'Best for Beginners',
    path: '/brokers/type/beginners',
    title: 'Best Forex Brokers for Beginners',
    description: 'Start your trading journey with brokers offering user-friendly platforms, low minimum deposits, and comprehensive educational resources.',
    // Fix: Removed check for non-existent `education` property.
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
    filterFn: (b) => b.technology.executionType.includes('ECN') && (b.tradingConditions.spreads.eurusd + (parseLeverage(b.tradingConditions.commission) / 10)) < 0.8,
  },
  {
    name: 'Copy Trading',
    path: '/brokers/type/copy-trading',
    title: 'Best Copy Trading Brokers',
    description: 'Leverage the expertise of seasoned traders. Explore the best platforms for social and copy trading to automate your strategy.',
    filterFn: (b) => b.copyTrading === true,
  },
  {
    name: 'Islamic Brokers',
    path: '/brokers/type/islamic',
    title: 'Best Islamic (Swap-Free) Forex Brokers',
    description: 'Find Sharia-compliant forex brokers that offer swap-free accounts, ensuring your trading aligns with Islamic finance principles.',
    filterFn: (b) => b.isIslamic === true,
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
    // Fix: Correctly access the `total` property on the `stocks` object.
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
    // Fix: Correctly access the `total` property on the `commodities` object.
    filterFn: (b) => (b.tradableInstruments?.commodities?.total ?? 0) > 0,
  },
];

export const categoryPages: CategoryPageInfo[] = [...countryFilters, ...platformAndTypeFilters];

export const categoryPageGroups = {
    country: countryFilters.map(({ name, path }) => ({ name, path })),
    platform: platformAndTypeFilters.map(({ name, path }) => ({ name, path })),
};