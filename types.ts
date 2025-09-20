

export interface Review {
  id: string;
  brokerId: string;
  userId: string;
  userName: string;
  rating: number; // Score out of 5
  comment: string;
  date: string; // ISO 8601 format
  verified?: boolean;
}

export interface Broker {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  score: number;
  foundingYear: number;
  headquarters: string;
  description: string;
  regulation: {
    regulators: string[];
  };
  ratings: {
      regulation: number;
      costs: number;
      platforms: number;
      support: number;
  };
  tradingConditions: {
    spreads: {
      eurusd: number;
      gbpusd: number;
      usdjpy: number;
    };
    commission: string;
    swapFeeCategory: 'Low' | 'Standard' | 'High';
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
  reviews?: Review[];
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
  updateUser: (name: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export interface ComparisonContextType {
  comparisonList: string[];
  addBrokerToComparison: (brokerId: string) => void;
  removeBrokerFromComparison: (brokerId: string) => void;
  isBrokerInComparison: (brokerId: string) => boolean;
  clearComparison: () => void;
}

export interface FavoritesContextType {
  favoritesList: string[];
  addBrokerToFavorites: (brokerId: string) => void;
  removeBrokerFromFavorites: (brokerId: string) => void;
  isBrokerInFavorites: (brokerId: string) => boolean;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface AIRecommendation {
  recommendedBrokerIds: string[];
  reasoning: string;
}

export interface MatcherHistoryItem {
    id: string;
    timestamp: string;
    preferences: {
        experience: string;
        platforms: string;
        minDeposit: string;
        priority: string;
    };
    reasoning: string;
    recommendedBrokerIds: string[];
}