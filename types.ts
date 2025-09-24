

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  content: string; // Markdown content
  author: {
    name: string;
    avatarUrl: string;
  };
  date: string; // ISO 8601
  tags: string[];
  imageUrl: string;
  readTimeMinutes: number;
}

export interface Review {
  id: string;
  brokerId: string;
  userId: string;
  userName: string;
  rating: number; // Score out of 5
  comment: string;
  date: string; // ISO 8601 format
  verified?: boolean;
  withdrawalExperience?: {
    days: number;
    method: string;
  };
}

export interface DiscussionReply {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  date: string;
  upvotes: number;
}

export interface DiscussionPost {
  id: string;
  brokerId: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  date: string;
  upvotes: number;
  replies: DiscussionReply[];
}


export interface AccountType {
    name: string;
    type: 'ECN' | 'STP' | 'Standard' | 'NDD';
    minDeposit: number;
    spreads: string; // e.g., "From 0.0 pips"
    commission: string; // e.g., "$3.50 per lot"
    bestFor: string;
}

// New detailed types for Broker
export interface DepositWithdrawal {
    depositMethods: string[];
    withdrawalMethods: string[];
    depositFees: string; // "None", "Up to 2%", etc.
    withdrawalFees: string;
    processingTime: {
        deposits: string; // e.g., "Instant for cards, 1-3 days for bank transfer"
        withdrawals: string;
    };
    minWithdrawal: number;
}

export interface Promotions {
    welcomeBonus?: string;
    depositBonus?: string;
    loyaltyProgram?: boolean;
}

export interface Support {
    languages: string[];
    channels: string[]; // 'Live Chat', 'Phone', etc.
    hours: '24/5' | '24/7' | string;
}

export interface Security {
    regulatedBy: { regulator: string; licenseNumber?: string }[];
    segregatedAccounts: boolean;
    investorCompensationScheme: {
        available: boolean;
        amount?: string; // e.g., "up to £85,000"
    };
    twoFactorAuth: boolean;
}

export interface TradingEnvironment {
    executionSpeedMs?: number;
    slippage: string; // e.g., "Low", "Average positive"
    requotes: boolean;
    liquidityProviders?: string[];
    marketDepth: boolean;
    orderTypes: string[];
    guaranteedStopLoss: {
        available: boolean;
        cost?: string;
    };
}

export interface PlatformFeatures {
    charting: {
        indicators: number;
        drawingTools: number;
    };
    automatedTrading: string[]; // 'EAs', 'API', 'FIX'
    copyTrading: {
        available: boolean;
        platforms: string[]; // 'Built-in', 'ZuluTrade', 'Myfxbook'
    };
    backtesting: boolean;
    newsIntegration: boolean;
}

export interface AccountManagement {
    islamicAccount: {
        available: boolean;
        conditions?: string;
    };
    baseCurrencies: string[];
    mamPammSupport: boolean;
    corporateAccounts: boolean;
}

export interface Transparency {
    audited: boolean;
    yearsInBusiness: number;
    tradingVolumeDisclosed: boolean;
    clientBase?: string; // e.g., "1M+ clients in 150 countries"
}

// Scam Broker Shield Types
export interface Signal {
  type: 'REGULATOR_WARNING' | 'URL_FLAG' | 'BLACKLIST' | 'USER_COMPLAINTS' | 'HEURISTIC';
  source: string;
  description: string;
  scoreWeight: number;
  evidenceUrl?: string;
  timestamp: string;
}

export interface RiskProfile {
  score: number; // 0-100
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  summary?: string; // Statically defined, can be replaced by AI later
  signals: Signal[];
}


// Update the main Broker interface
export interface Broker {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  score: number;
  foundingYear: number;
  headquarters: string;
  description: string;
  summary?: string;
  pros?: string[];
  cons?: string[];
  restrictedCountries?: string[];
  
  // New detailed fields
  coreInfo: {
      brokerType: 'ECN' | 'STP' | 'Market Maker' | 'Hybrid' | 'NDD';
      mobileTrading: boolean;
      demoAccount: boolean;
  };

  accountTypes?: AccountType[];
  
  // Re-structuring fees to be more detailed
  fees: {
    trading: {
        spreadType: 'Fixed' | 'Variable' | 'Raw';
        averageSpreads: { pair: string; spread: string }[];
        commissionStructure: string;
        overnightSwapFees: string;
    };
    nonTrading: {
        inactivityFee: string;
        withdrawalFee: string;
        depositFee: string;
        conversionFee?: string;
    };
  };

  tradableInstruments: {
      forexPairs: { total: number; details: string };
      commodities: { total: number; details: string };
      indices: { total: number; details: string };
      stocks: { total: number; details: string };
      cryptocurrencies: { total: number; details: string };
      etfs?: { total: number; details: string };
  };
  
  tradingConditionsExtended: {
    minTradeSize: number; // in lots
    scalpingAllowed: boolean;
    hedgingAllowed: boolean;
    eaAllowed: boolean;
    negativeBalanceProtection: boolean;
    marginCallLevel: string; // e.g. "100%"
    stopOutLevel: string; // e.g. "50%"
  };

  depositWithdrawal: DepositWithdrawal;

  promotions?: Promotions;
  
  customerSupport: Support;

  security: Security;

  tradingEnvironment: TradingEnvironment;
  
  platformFeatures: PlatformFeatures;

  accountManagement: AccountManagement;

  transparency: Transparency;
  
  // Legacy fields for backward compatibility
  regulation: {
    regulators: string[];
  };
  ratings: {
      regulation: number;
      costs: number;
      platforms: number;
      support: number;
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
    apiAccess?: boolean;
    eaSupport?: boolean;
  };
  tradingConditions: { // Legacy trading conditions
    spreads: { eurusd: number; gbpusd: number; usdjpy: number; };
    commission: string;
    swapFeeCategory: 'Low' | 'Standard' | 'High';
    maxLeverage: string;
    minLotSize?: number;
  };
  copyTrading?: boolean;
  isIslamic?: boolean;
  providesSignals?: boolean;
  socialTrading?: {
      popularityScore: number; 
      topTradersCount: number; 
      platforms: string[];
  };
  reviews?: Review[];
  riskProfile?: RiskProfile;
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

export interface BrokerMatcherPreferences {
    country: string;
    experience: string;
    feeStructure: string;
    depositMethod: string;
    currencyPairs: string;
    specialPreferences: string[];
}

export interface MatcherHistoryItem {
    id: string;
    timestamp: string;
    preferences: BrokerMatcherPreferences;
    reasoning: string;
    recommendedBrokerIds: string[];
}

export interface ReviewsContextType {
  reviews: Review[];
  getReviewsByBrokerId: (brokerId: string) => Review[];
  getReviewsByUserId: (userId: string) => Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'verified'>) => void;
  verifyReview: (reviewId: string) => void;
  getAverageWithdrawalTime: (brokerId: string) => { averageDays: number | null; reportCount: number };
}

export interface DiscussionContextType {
  posts: DiscussionPost[];
  getPostsByBrokerId: (brokerId: string) => DiscussionPost[];
  addPost: (post: Omit<DiscussionPost, 'id' | 'date' | 'upvotes' | 'replies'>) => void;
  addReply: (reply: Omit<DiscussionReply, 'id' | 'date' | 'upvotes'>) => void;
  upvotePost: (postId: string) => void;
  upvoteReply: (replyId: string) => void;
}

export interface Alert {
  id: string;
  brokerId: string;
  title: string;
  description: string;
  date: string; // ISO 8601 format
  severity: 'High' | 'Medium' | 'Low';
  read: boolean;
}

export interface AlertsContextType {
  alerts: Alert[];
  unreadCount: number;
  markAllAsRead: () => void;
  getAlertsForFavorites: (favoriteBrokerIds: string[]) => Alert[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  date: string; // ISO 8601
  category: 'Forex' | 'Economy' | 'Central Banks' | 'Geopolitics' | 'Commodities';
  importance: 'High' | 'Medium' | 'Low';
}