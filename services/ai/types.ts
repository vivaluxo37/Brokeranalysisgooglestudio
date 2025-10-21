/**
 * AI Service Types
 * Common types used across AI services
 */

export interface AIProvider {
  name: string;
  apiKey?: string;
  enabled: boolean;
  priority: number;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  provider?: string;
  tokensUsed?: number;
}

export interface ChatbotMessage {
  message: string;
  timestamp?: string;
  role?: 'user' | 'assistant';
}

export interface ChatbotResponse {
  response: string;
  timestamp: string;
  error?: string;
  suggestions?: string[];
}

export interface BrokerMatcherRequest {
  preferences: {
    tradingStyle?: string;
    experienceLevel?: string;
    initialDeposit?: number;
    preferredPlatforms?: string[];
    importantFeatures?: string[];
    region?: string;
  };
  tradingStyle?: string;
  experience?: string;
  budget?: string;
  region?: string;
}

export interface BrokerMatcherResponse {
  recommendations: BrokerRecommendation[];
  reasoning: string;
  timestamp: string;
  error?: string;
}

export interface BrokerRecommendation {
  broker: any; // Should be typed as Broker
  score: number;
  reasoning: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
}

export interface LearningProgress {
  topic: string;
  attempts: number;
  bestScore: number;
  totalTimeSpent: number;
  lastCompleted: string | null;
  mastered: boolean;
}

export interface AIAnalytics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  providerUsage: Record<string, number>;
  errorTypes: Record<string, number>;
}

export interface ConversationContext {
  conversationId: string;
  userId?: string;
  sessionId?: string;
  startTime: string;
  lastActivity: string;
  messageCount: number;
  context?: Record<string, any>;
}

export interface RateLimitInfo {
  remaining: number;
  resetTime: number;
  limit: number;
  windowMs: number;
}

export interface AIConfig {
  providers: AIProvider[];
  fallbackEnabled: boolean;
  rateLimiting: {
    enabled: boolean;
    requestsPerWindow: number;
    windowMs: number;
  };
  caching: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  analytics: {
    enabled: boolean;
    trackResponses: boolean;
    trackErrors: boolean;
  };
}
