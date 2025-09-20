
export interface Broker {
  id: string;
  name: string;
  logoUrl: string;
  score: number;
  foundingYear: number;
  headquarters: string;
  description: string;
  regulation: {
    regulators: string[];
  };
  tradingConditions: {
    spreads: {
      eurusd: number;
      gbpusd: number;
      usdjpy: number;
    };
    commission: string;
    swapFees: string;
    maxLeverage: string;
  };
  accessibility: {
    minDeposit: number;
    depositMethods: string[];
    withdrawalMethods: string[];
    customerSupport: string[];
  };
  technology: {
    platforms: string[];
    executionType: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, pass: string) => Promise<void>;
}

export interface ComparisonContextType {
  comparisonList: string[];
  addBrokerToComparison: (brokerId: string) => void;
  removeBrokerFromComparison: (brokerId: string) => void;
  isBrokerInComparison: (brokerId: string) => boolean;
  clearComparison: () => void;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
