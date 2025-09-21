import { Broker, Review, AIRecommendation, NewsArticle } from '../types';
import * as backend from './backendService';

// This file now acts as a secure frontend client. It calls the simulated
// backend service, which is the only place the API key is handled.

// --- Chatbot Functionality ---
export const getChatbotResponseStream = async (message: string) => {
  return backend.handleChatbotStream(message);
};

// --- Broker Matcher Functionality ---
interface BrokerMatcherPreferences {
  experience: string;
  platforms: string;
  minDeposit: string;
  priority: string;
}
interface BrokerRecommendationResponse {
  reasoning: string;
  recommendedBrokerIds: string[];
}
export const getBrokerRecommendations = async (
  preferences: BrokerMatcherPreferences,
  brokers: Broker[]
): Promise<BrokerRecommendationResponse> => {
    return backend.handleBrokerRecommendations(preferences, brokers);
};

// --- Cost Analysis Functionality ---
interface CostData {
    name: string;
    websiteUrl: string;
    spread: number;
    commission: number;
    totalCost: number;
}
export const getCostAnalysis = async (instrument: string, costData: CostData[]): Promise<string> => {
    return backend.handleCostAnalysis(instrument, costData);
};

// --- Personalized Cost Projection ---
export type TradingStyle = 'Scalper' | 'Day Trader' | 'Swing Trader';
interface PersonalizedCostRequest {
    style: TradingStyle;
    instrument: string;
    brokers: { name: string; websiteUrl: string; spread: number; commission: number; swapCategory: 'Low' | 'Standard' | 'High' }[];
}
export const getPersonalizedCostProjection = async (request: PersonalizedCostRequest): Promise<string> => {
    return backend.handlePersonalizedCostProjection(request);
};

// --- AI Review Summarizer ---
export interface ReviewSummary {
    summary: string;
    pros: string[];
    cons: string[];
}
export const getReviewSummary = async (brokerName: string, reviews: Review[]): Promise<ReviewSummary> => {
    return backend.handleReviewSummary(brokerName, reviews);
};

// --- Regulatory Trust Score ---
export interface TrustScore {
    score: number;
    reasoning: string;
    sources: { uri: string, title: string }[];
}
export const getRegulatoryTrustScore = async (brokerName: string, regulators: string[]): Promise<TrustScore> => {
    return backend.handleRegulatoryTrustScore(brokerName, regulators);
};

// --- AI Comparison Summary ---
export const getComparisonSummary = async (brokers: Broker[]): Promise<string> => {
    return backend.handleComparisonSummary(brokers);
}

// --- AI Duel Verdict ---
export const getDuelVerdict = async (broker1: Broker, broker2: Broker): Promise<string> => {
    return backend.handleDuelVerdict(broker1, broker2);
}

// --- AI Broker Recommendation ---
export const getAIRecommendation = async (brokers: Broker[]): Promise<AIRecommendation> => {
    return backend.handleAIRecommendation(brokers);
};

// --- AI News Analysis ---
interface NewsAnalysisResponse {
    analysis: string;
    recommendedBrokerIds: string[];
}
export const getNewsAnalysis = async (article: NewsArticle, brokers: Broker[]): Promise<NewsAnalysisResponse> => {
    return backend.handleNewsAnalysis(article, brokers);
};
