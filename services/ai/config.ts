/**
 * AI Service Configuration
 * Centralized configuration for all AI services
 */

import type { AIConfig, AIProvider } from './types'

// Default AI configuration
export const aiConfig: AIConfig = {
  providers: [
    {
      name: 'proxy',
      enabled: true,
      priority: 1,
      maxTokens: 2000,
      temperature: 0.7,
    },
    {
      name: 'gemini',
      enabled: false, // Disabled in favor of proxy
      priority: 2,
      maxTokens: 2000,
      temperature: 0.7,
    },
    {
      name: 'openai',
      enabled: false,
      priority: 3,
      maxTokens: 1500,
      temperature: 0.8,
    },
  ],
  fallbackEnabled: true,
  rateLimiting: {
    enabled: true,
    requestsPerWindow: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  caching: {
    enabled: true,
    ttl: 30 * 60 * 1000, // 30 minutes
    maxSize: 1000, // Maximum cached items
  },
  analytics: {
    enabled: process.env.NODE_ENV === 'production',
    trackResponses: true,
    trackErrors: true,
  },
}

// Feature flags
export const aiFeatures = {
  chatbot: process.env.VITE_ENABLE_AI_FEATURES === 'true',
  tutor: process.env.VITE_ENABLE_AI_FEATURES === 'true',
  brokerMatcher: process.env.VITE_ENABLE_AI_FEATURES === 'true',
  analytics: process.env.NODE_ENV === 'production',
  caching: true,
  fallback: true,
  rateLimiting: true,
}

// API endpoints
export const aiEndpoints = {
  chatbot: '/api/chatbot',
  tutor: '/api/tutor',
  brokerMatcher: '/api/broker-matcher',
  analytics: '/api/analytics',
  health: '/api/health',
}

// Error messages
export const aiErrorMessages = {
  networkError: 'Network error occurred. Please check your connection.',
  rateLimitExceeded: 'Too many requests. Please wait before trying again.',
  serviceUnavailable: 'AI service is currently unavailable. Please try again later.',
  invalidInput: 'Invalid input provided. Please check your request.',
  timeout: 'Request timed out. Please try again.',
  unknown: 'An unknown error occurred. Please try again.',
  disabled: 'AI features are currently disabled.',
}

// Default responses for fallback scenarios
export const fallbackResponses = {
  chatbot: {
    greeting: 'Hello! I\'m here to help you with forex trading questions. What would you like to know?',
    error: 'I\'m having trouble processing your request right now. Please try again later.',
    noResults: 'I couldn\'t find specific information about that. Can you try rephrasing your question?',
  },
  tutor: {
    error: 'I\'m unable to generate educational content at the moment. Please try again later.',
    notFound: 'I don\'t have information about that topic. Would you like to learn about something else?',
  },
  brokerMatcher: {
    error: 'I\'m unable to generate broker recommendations right now. Please try again later.',
    noMatch: 'I couldn\'t find brokers matching your specific criteria. Try adjusting your preferences.',
  },
}

// Conversation settings
export const conversationSettings = {
  maxHistoryLength: 20,
  maxMessageLength: 2000,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  autoSave: true,
  persistence: 'sessionStorage', // 'localStorage' | 'sessionStorage' | 'memory'
}

// Content generation settings
export const contentGeneration = {
  maxTokens: 2000,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  presencePenalty: 0.1,
  frequencyPenalty: 0.1,
}

// Quiz settings
export const quizSettings = {
  defaultDifficulty: 'beginner' as const,
  questionsPerTopic: 5,
  passingScore: 70,
  timeLimit: 300, // 5 minutes per question
  shuffleOptions: true,
  showExplanations: true,
}

// Broker matching settings
export const brokerMatching = {
  maxRecommendations: 5,
  minScore: 60,
  weightFactors: {
    regulation: 0.3,
    costs: 0.25,
    platforms: 0.2,
    support: 0.15,
    features: 0.1,
  },
  cacheExpiry: 60 * 60 * 1000, // 1 hour
}

// Analytics settings
export const analyticsSettings = {
  trackUserInteractions: true,
  trackResponseTimes: true,
  trackErrorRates: true,
  trackProviderUsage: true,
  batchSize: 50,
  flushInterval: 60 * 1000, // 1 minute
  maxRetries: 3,
}

// Development settings
export const devSettings = {
  enableDebugMode: process.env.VITE_ENABLE_DEBUG_MODE === 'true',
  logApiCalls: process.env.NODE_ENV === 'development',
  showPerformanceMetrics: process.env.NODE_ENV === 'development',
  mockResponses: process.env.NODE_ENV === 'development' && process.env.VITE_MOCK_AI === 'true',
}

export default {
  config: aiConfig,
  features: aiFeatures,
  endpoints: aiEndpoints,
  errorMessages: aiErrorMessages,
  fallbackResponses,
  conversationSettings,
  contentGeneration,
  quizSettings,
  brokerMatching,
  analyticsSettings,
  devSettings,
}
