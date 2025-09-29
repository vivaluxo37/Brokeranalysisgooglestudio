


export interface Author {
  slug: string;
  name: string;
  avatarUrl: string;
  credentials?: string;
  bio: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  keyTakeaways?: string[];
  content: string; // Markdown content
  author: {
    name: string;
    slug: string;
    avatarUrl: string;
  };
  reviewedBy?: {
    name: string;
    slug: string;
  };
  date: string; // ISO 8601
  lastUpdated?: string; // ISO 8601
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
  topicId: string; // Can be a brokerId or a blogPostSlug
  userId: string;
  userName: string;
  title: string;
  content: string;
  date: string;
  upvotes: number;
  replies: DiscussionReply[];
}

// Enhanced promotion types for the new promotion system
export type PromotionType = 
  | 'cashback' 
  | 'deposit_bonus' 
  | 'commission_discount' 
  | 'copy_trading' 
  | 'vip_program' 
  | 'platform_bonus'
  | 'welcome_bonus'
  | 'no_deposit_bonus'
  | 'loyalty_program'
  | 'trading_competition';

export type ActivationMethod = 'automatic' | 'manual' | 'contact_required';
export type RateType = 'percentage' | 'fixed_per_lot' | 'fixed_amount';
export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'one_time';
export type FeatureType = 'advantage' | 'requirement' | 'note' | 'warning';

export interface ContactInfo {
  email?: string;
  telegram?: string;
  phone?: string;
  whatsapp?: string;
  skype?: string;
}

export interface PromotionRequirements {
  minDeposit?: number;
  accountTypes?: string[];
  tradingVolume?: number;
  eligibleCountries?: string[];
  excludedCountries?: string[];
  minAge?: number;
  verificationRequired?: boolean;
  newClientsOnly?: boolean;
}

export interface PromotionRate {
  id: string;
  promotionId: string;
  tierName?: string;
  minVolume: number;
  maxVolume?: number;
  rateType: RateType;
  rateValue: number;
  currency: string;
  frequency: PaymentFrequency;
  description?: string;
  displayOrder: number;
}

export interface PromotionFeature {
  id: string;
  promotionId: string;
  featureText: string;
  featureType: FeatureType;
  displayOrder: number;
  isHighlighted: boolean;
}

export interface PromotionAnalytics {
  id: string;
  promotionId: string;
  date: string;
  views: number;
  clicks: number;
  conversions: number;
  uniqueVisitors: number;
}

export interface Promotion {
  id: string;
  brokerId: string;
  broker?: {
    name: string;
    logo: string;
    rating: number;
    platforms: string[];
  };
  title: string;
  description?: string;
  promotionType: PromotionType;
  isActive: boolean;
  isFeatured: boolean;
  isExclusive: boolean;
  isPopular: boolean;
  startDate: string;
  endDate?: string;
  activationMethod: ActivationMethod;
  contactInfo?: ContactInfo;
  requirements: PromotionRequirements;
  terms?: string;
  websiteUrl?: string;
  rates?: PromotionRate[];
  features?: PromotionFeature[];
  analytics?: PromotionAnalytics[];
  createdAt: string;
  updatedAt: string;
}

export interface CalculationResult {
  rebateAmount: number;
  rateValue: number;
  rateType: RateType;
  tierName?: string;
  currency: string;
  frequency: PaymentFrequency;
  dailyRebate?: number;
  monthlyRebate?: number;
  yearlyRebate?: number;
  effectiveCostReduction?: number;
  nextTierVolume?: number;
  nextTierRebate?: number;
}

export interface PromotionFilters {
  brokers?: string[];
  promotionTypes?: PromotionType[];
  rebateRange?: {
    min: number;
    max: number;
  };
  accountTypes?: string[];
  activationMethod?: ActivationMethod[];
  sortBy?: 'rating' | 'rebate_amount' | 'popularity' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

export interface AvailableFilters {
  brokers: Array<{ id: string; name: string; count: number }>;
  promotionTypes: Array<{ type: PromotionType; count: number }>;
  activationMethods: Array<{ method: ActivationMethod; count: number }>;
  rebateRanges: Array<{ min: number; max: number; count: number }>;
}

// Legacy interface for backward compatibility
export interface BrokerPromotion {
  type: 'welcome-bonus' | 'deposit-bonus' | 'no-deposit-bonus' | 'cashback' | 'loyalty-program' | 'trading-competition';
  title: string;
  description: string;
  amount: string;
  validUntil?: string;
  minDeposit: number;
  terms: string;
  isExclusive: boolean;
  isPopular: boolean;
  isActive: boolean;
  websiteUrl?: string;
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
    currentPromotions?: BrokerPromotion[];
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
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
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

export interface StrategyMatcherHistoryItem {
    id: string;
    timestamp: string;
    strategy: string;
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
  getPostsByTopicId: (topicId: string) => DiscussionPost[];
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

export interface TradingJournalEntry {
  id: string;
  userId: string;
  date: string; // ISO 8601
  instrument: string; // e.g., 'EUR/USD'
  direction: 'Buy' | 'Sell';
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  strategyUsed?: string;
  notes?: string;
  profitOrLoss: number;
}

export interface TradingJournalContextType {
  journalEntries: TradingJournalEntry[];
  getEntriesByUserId: (userId: string) => TradingJournalEntry[];
  addEntry: (entry: Omit<TradingJournalEntry, 'id' | 'userId' | 'date' | 'profitOrLoss'>) => Promise<void>;
  updateEntry: (entryId: string, updates: Partial<Omit<TradingJournalEntry, 'id' | 'userId'>>) => Promise<void>;
  deleteEntry: (entryId: string) => Promise<void>;
  getJournalStats: (userId: string) => {
    totalPL: number;
    winRate: number;
    totalTrades: number;
    biggestWin: number;
    biggestLoss: number;
  };
}

export interface MarketMood {
    score: number;
    level: 'Extreme Risk-Off' | 'Risk-Off' | 'Neutral' | 'Risk-On' | 'Extreme Risk-On';
    summary: string;
}

export interface BrokerAlternative {
    brokerId: string;
    reasoning: string;
}

export interface BrokerAlternativesResponse {
    recommendations: BrokerAlternative[];
}


// API Request/Response Types for Promotions
export interface GetPromotionsRequest {
  filters?: {
    brokerIds?: string[];
    promotionTypes?: PromotionType[];
    isActive?: boolean;
    isFeatured?: boolean;
    minRebate?: number;
    maxRebate?: number;
    activationMethod?: ActivationMethod[];
    accountTypes?: string[];
  };
  sort?: {
    field: 'rating' | 'rebate_amount' | 'popularity' | 'newest' | 'created_at' | 'updated_at';
    order: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface GetPromotionsResponse {
  promotions: Promotion[];
  totalCount: number;
  hasMore: boolean;
  filters: AvailableFilters;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CalculateRebateRequest {
  promotionId: string;
  monthlyVolume: number;
  accountType?: string;
}

export interface CalculateRebateResponse {
  result: CalculationResult;
  recommendations?: Promotion[];
}

export interface CreatePromotionRequest {
  brokerId: string;
  title: string;
  description?: string;
  promotionType: PromotionType;
  activationMethod: ActivationMethod;
  contactInfo?: ContactInfo;
  requirements: PromotionRequirements;
  rates: Omit<PromotionRate, 'id' | 'promotionId'>[];
  features?: Omit<PromotionFeature, 'id' | 'promotionId'>[];
  startDate: string;
  endDate?: string;
  isFeatured?: boolean;
  isExclusive?: boolean;
  isPopular?: boolean;
  terms?: string;
  websiteUrl?: string;
}

export interface UpdatePromotionRequest {
  id: string;
  title?: string;
  description?: string;
  promotionType?: PromotionType;
  activationMethod?: ActivationMethod;
  contactInfo?: ContactInfo;
  requirements?: PromotionRequirements;
  rates?: Omit<PromotionRate, 'id' | 'promotionId'>[];
  features?: Omit<PromotionFeature, 'id' | 'promotionId'>[];
  startDate?: string;
  endDate?: string;
  isFeatured?: boolean;
  isExclusive?: boolean;
  isPopular?: boolean;
  isActive?: boolean;
  terms?: string;
  websiteUrl?: string;
}

export interface PromotionStatsResponse {
  promotionId: string;
  totalViews: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  topReferrers: string[];
  performanceByDate: Array<{
    date: string;
    views: number;
    clicks: number;
    conversions: number;
  }>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface QuizProgress {
    [quizKey: string]: {
        score: number;
        total: number;
        date: string; // ISO string of last attempt
    };
}

export interface WebinarProgress {
    [webinarTitle: string]: {
        viewed: boolean;
        date: string;
    };
}

export interface EducationProgress {
    quizzes: QuizProgress;
    webinars: WebinarProgress;
}

export interface EducationContextType {
    progress: EducationProgress;
    saveQuizResult: (quizKey: string, score: number, total: number) => void;
    markWebinarAsViewed: (webinarTitle: string) => void;
}

export interface OnboardingStep {
  targetSelector: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export interface OnboardingContextType {
  startTour: () => void;
  endTour: () => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  skipTour: () => void;
  currentStep: number;
  isActive: boolean;
  tourSteps: OnboardingStep[];
}

// ============================================================================
// PROMOTION API INTERFACES
// ============================================================================

export interface GetPromotionsRequest {
  filters?: PromotionFilters;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface GetPromotionsResponse {
  promotions: Promotion[];
  totalCount: number;
  hasMore: boolean;
  filters: AvailableFilters;
}

export interface CalculateRebateRequest {
  promotionId: string;
  monthlyVolume: number;
  accountType?: string;
}

export interface CalculateRebateResponse {
  result: CalculationResult;
  recommendations?: Promotion[];
}

export interface CreatePromotionRequest {
  brokerId: string;
  title: string;
  description?: string;
  promotionType: PromotionType;
  activationMethod: ActivationMethod;
  contactInfo?: ContactInfo;
  requirements: PromotionRequirements;
  rates: Omit<PromotionRate, 'id' | 'promotionId'>[];
  features: Omit<PromotionFeature, 'id' | 'promotionId'>[];
  startDate: string;
  endDate?: string;
  isFeatured?: boolean;
  isExclusive?: boolean;
  isPopular?: boolean;
  terms?: string;
  websiteUrl?: string;
}

export interface UpdatePromotionRequest extends Partial<CreatePromotionRequest> {
  id: string;
}

export interface PromotionStatsResponse {
  promotionId: string;
  totalViews: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  clickThroughRate: number;
  daysActive: number;
  topReferrers?: string[];
  performanceByDate?: Array<{
    date: string;
    views: number;
    clicks: number;
    conversions: number;
  }>;
}

export interface AdminPromotionAnalytics {
  overview: {
    totalPromotions: number;
    activePromotions: number;
    featuredPromotions: number;
    totalViews: number;
    totalClicks: number;
    totalConversions: number;
    averageConversionRate: number;
  };
  topPerformingPromotions: Array<{
    promotion: Promotion;
    stats: PromotionStatsResponse;
  }>;
  promotionsByType: Array<{
    type: PromotionType;
    count: number;
    conversionRate: number;
  }>;
  recentActivity: Array<{
    date: string;
    views: number;
    clicks: number;
    conversions: number;
  }>;
}
