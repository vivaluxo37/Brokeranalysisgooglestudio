import { Broker } from '../types';

const normalizeString = (value?: string | null): string => (value || '').toLowerCase();

// Helper to parse leverage string like "1:500" into a number 500
const parseLeverage = (leverageStr?: string | null): number => {
  if (!leverageStr || typeof leverageStr !== 'string') return 0;
  const lower = leverageStr.toLowerCase();
  if (lower.includes('unlimited')) return Infinity;
  const parts = leverageStr.split(':');
  if (parts.length !== 2) return 0;
  const num = parseInt(parts[1], 10);
  return Number.isFinite(num) ? num : 0;
};

// Helper to parse commission string like "$3.50 per lot" into a round-trip number
const parseCommission = (commissionStr?: string | null): number => {
  if (!commissionStr || typeof commissionStr !== 'string') return 0;
  const lower = commissionStr.toLowerCase();
  if (lower.includes('zero')) return 0;
  const match = commissionStr.match(/(\d+\.?\d*)/);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  return Number.isFinite(value) ? value * 2 : 0;
};

const getRegulators = (broker: Broker): string[] => {
  const regulators = broker?.regulation?.regulators;
  if (Array.isArray(regulators)) {
    return regulators.filter((reg): reg is string => typeof reg === 'string' && reg.trim().length > 0);
  }
  return [];
};

const hasRegulator = (broker: Broker, regulators: string[]): boolean => {
  if (!regulators.length) return false;
  const brokerRegs = getRegulators(broker).map(reg => reg.toUpperCase());
  return regulators.some(reg => brokerRegs.includes(reg.toUpperCase()));
};

const hasAnyExecutionType = (broker: Broker, keywords: string[]): boolean => {
  const execution = normalizeString(broker?.technology?.executionType);
  return keywords.some(keyword => execution.includes(keyword.toLowerCase()));
};

const hasPlatform = (broker: Broker, platforms: string[]): boolean => {
  const platformList = Array.isArray(broker?.technology?.platforms) ? broker.technology.platforms : [];
  const normalizedPlatformList = platformList.map(platform => normalizeString(platform as string));
  return platforms.some(platform => normalizedPlatformList.includes(platform.toLowerCase()));
};

const getSpread = (broker: Broker, pair: string = 'eurusd'): number => {
  const spreads = (broker as any)?.tradingConditions?.spreads as Record<string, number | string | undefined> | undefined;
  const rawSpread = spreads ? spreads[pair] : undefined;
  if (typeof rawSpread === 'number') return rawSpread;
  if (typeof rawSpread === 'string') {
    const match = rawSpread.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }
  return 0;
};

const getMinDeposit = (broker: Broker): number => {
  const min = broker?.accessibility?.minDeposit;
  if (typeof min === 'number') return min;
  if (typeof min === 'string') {
    const match = min.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : Infinity;
  }
  return Infinity;
};

const getTradableInstrumentCount = (broker: Broker, asset: string): number => {
  const section = (broker as any)?.tradableInstruments?.[asset];
  if (!section) return 0;
  if (typeof section === 'number') return section;
  if (typeof (section as any)?.total === 'number') return (section as any).total;
  if (Array.isArray((section as any)?.symbols)) return (section as any).symbols.length;
  return 0;
};

const supportsCopyTrading = (broker: Broker): boolean => {
  if (broker?.copyTrading === true) return true;
  const platformCopy = broker?.platformFeatures?.copyTrading;
  return Boolean(platformCopy && typeof platformCopy === 'object' && (platformCopy as any).available);
};

const hasIslamicAccount = (broker: Broker): boolean => {
  if (broker?.isIslamic) return true;
  const islamic = broker?.accountManagement?.islamicAccount;
  return Boolean(islamic && typeof islamic === 'object' && (islamic as any).available);
};

const parseBooleanFlag = (value: unknown): boolean => value === true;


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
    filterFn: (b) => hasRegulator(b, ['FCA', 'CySEC', 'BaFin', 'FINMA', 'KNF', 'FSA (Denmark)', 'Central Bank of Ireland', 'CSSF']),
  },
  {
    name: 'North America (NFA, CIRO)',
    path: '/brokers/region/north-america',
    title: 'Best Forex Brokers in North America',
    description: 'Explore brokers regulated by the NFA (USA) and CIRO (Canada), offering the highest levels of security for North American clients.',
    filterFn: (b) => hasRegulator(b, ['NFA', 'CFTC', 'CIRO']),
  },
  {
    name: 'Asia-Pacific (ASIC, MAS)',
    path: '/brokers/region/asia-pacific',
    title: 'Best Forex Brokers in Asia-Pacific',
    description: 'Discover leading brokers regulated by ASIC (Australia), MAS (Singapore), and FSA (Japan) for traders in the APAC region.',
    filterFn: (b) => hasRegulator(b, ['ASIC', 'MAS (Singapore)', 'FSA (Japan)']),
  },
  {
    name: 'Middle East (DFSA)',
    path: '/brokers/region/middle-east',
    title: 'Best Forex Brokers in the Middle East',
    description: 'Find trusted brokers regulated by the DFSA (Dubai) and other regional authorities, catering to traders in the MENA region.',
    filterFn: (b) => hasRegulator(b, ['DFSA']),
  },
  {
    name: 'Africa (FSCA)',
    path: '/brokers/region/africa',
    title: 'Best Forex Brokers for Africa',
    description: 'Compare top brokers regulated by the FSCA (South Africa) and other reputable bodies, offering services across the African continent.',
    filterFn: (b) => hasRegulator(b, ['FSCA']),
  },
  {
    name: 'International (High Leverage)',
    path: '/brokers/region/international',
    title: 'International & Offshore Forex Brokers',
    description: 'Explore international brokers offering services globally, often with higher leverage options. Ensure you understand the risks associated with offshore regulation.',
    filterFn: (b) => hasRegulator(b, ['IFSC', 'FSC Belize', 'SCB', 'FSA']) && !hasRegulator(b, ['FCA', 'ASIC', 'NFA']),
  }
];

const platformAndTypeFilters: CategoryPageInfo[] = [
  {
    name: 'Best for Beginners',
    path: '/brokers/type/beginners',
    title: 'Best Forex Brokers for Beginners',
    description: 'Start your trading journey with brokers offering user-friendly platforms, low minimum deposits, and comprehensive educational resources.',
    filterFn: (b) => getMinDeposit(b) <= 100 && (typeof b?.score === 'number' ? b.score : 0) > 8.0,
  },
  {
    name: 'MT4 Brokers',
    path: '/brokers/platform/mt4',
    title: 'Best MT4 Forex Brokers',
    description: 'Find top-rated forex brokers offering the powerful and popular MetaTrader 4 (MT4) platform, renowned for its charting tools and automated trading capabilities.',
    filterFn: (b) => hasPlatform(b, ['mt4', 'meta trader 4', 'metatrader 4']),
  },
  {
    name: 'ECN Brokers',
    path: '/brokers/type/ecn',
    title: 'Best ECN Forex Brokers',
    description: 'For serious traders seeking direct market access, tight spreads, and fast execution. Compare the top true ECN brokers.',
    filterFn: (b) => hasAnyExecutionType(b, ['ecn']),
  },
  {
    name: 'Scalping Brokers',
    path: '/brokers/type/scalping',
    title: 'Best Brokers for Scalping',
    description: 'Maximize your high-frequency trading strategy with brokers offering the lowest spreads, fastest execution, and ECN/STP environments.',
    filterFn: (b) => {
      const commissionCost = parseCommission(b?.tradingConditions?.commission) / 10; // Convert commission from $ to pips
      const totalCost = getSpread(b, 'eurusd') + commissionCost;
      return hasAnyExecutionType(b, ['ecn', 'stp']) && totalCost < 0.8;
    },
  },
  {
    name: 'Copy Trading',
    path: '/brokers/type/copy-trading',
    title: 'Best Copy Trading Brokers',
    description: 'Leverage the expertise of seasoned traders. Explore the best platforms for social and copy trading to automate your strategy.',
    filterFn: (b) => supportsCopyTrading(b),
  },
  {
    name: 'Islamic Brokers',
    path: '/brokers/type/islamic',
    title: 'Best Islamic (Swap-Free) Forex Brokers',
    description: 'Find Sharia-compliant forex brokers that offer swap-free accounts, ensuring your trading aligns with Islamic finance principles.',
    filterFn: (b) => hasIslamicAccount(b),
  },
  {
    name: 'High Leverage',
    path: '/brokers/type/high-leverage',
    title: 'High Leverage Forex Brokers',
    description: 'Explore brokers offering high leverage (1:500 or greater) to maximize your trading potential. Understand the associated risks and benefits.',
    filterFn: (b) => parseLeverage(b?.tradingConditions?.maxLeverage) >= 500,
  },
  {
    name: 'Stock Trading',
    path: '/brokers/type/stock-trading',
    title: 'Best Brokers for Stock Trading',
    description: 'Diversify your portfolio with brokers that offer a wide range of stock CFDs and other equity instruments from global markets.',
    filterFn: (b) => getTradableInstrumentCount(b, 'stocks') > 100,
  },
  {
    name: 'Telegram Signals',
    path: '/brokers/type/telegram-signals',
    title: 'Brokers with Telegram Signals',
    description: 'Get real-time trading signals and market analysis directly to your device. Find brokers that offer integrated Telegram signal services.',
    filterFn: (b) => parseBooleanFlag((b as any)?.providesSignals),
  },
   {
    name: 'Gold (XAU/USD)',
    path: '/brokers/type/gold-trading',
    title: 'Best Brokers for Gold (XAU/USD) Trading',
    description: 'Trade one of the world\'s most popular commodities. Find brokers with low spreads and excellent conditions for trading Gold.',
    filterFn: (b) => getTradableInstrumentCount(b, 'commodities') > 0,
  },
];

export const categoryPages: CategoryPageInfo[] = [...regionFilters, ...platformAndTypeFilters];

export const categoryPageGroups = {
    region: regionFilters.map(({ name, path }) => ({ name, path })),
    platform: platformAndTypeFilters.map(({ name, path }) => ({ name, path })),
};