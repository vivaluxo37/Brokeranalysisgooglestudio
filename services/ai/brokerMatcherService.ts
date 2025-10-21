/**
 * Broker Matcher Service
 * Handles AI-powered broker recommendations based on user preferences
 */

import { validateAndSanitize, brokerFilterSchema } from '../../utils/validation'
import { secureApiService } from '../secureApiService'

import type { Broker } from '../../types'

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
  broker: Broker;
  score: number;
  reasoning: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
}

class BrokerMatcherService {
  private readonly MAX_RECOMMENDATIONS = 5
  private readonly recommendationCache: Map<string, BrokerMatcherResponse> = new Map()
  private readonly cacheExpiry = 60 * 60 * 1000 // 1 hour

  /**
   * Get broker recommendations based on user preferences
   */
  async getRecommendations(request: BrokerMatcherRequest): Promise<BrokerMatcherResponse> {
    try {
      // Validate input
      const validation = validateAndSanitize(request, brokerFilterSchema)

      if (!validation.isValid) {
        return {
          recommendations: [],
          reasoning: '',
          timestamp: new Date().toISOString(),
          error: validation.errors.join(', '),
        }
      }

      // Check cache
      const cacheKey = this.generateCacheKey(validation.data)
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        return cached
      }

      // Get recommendations from API
      const recommendationsText = await secureApiService.getBrokerRecommendations(
        validation.data.preferences,
        validation.data.tradingStyle,
        validation.data.experience,
        validation.data.budget,
        validation.data.region,
      )

      // Parse and process recommendations
      const processedResponse = this.processRecommendations(
        recommendationsText,
        validation.data,
      )

      // Cache the response
      this.cacheResponse(cacheKey, processedResponse)

      return processedResponse

    } catch (error) {
      console.error('Broker matcher service error:', error)
      return {
        recommendations: [],
        reasoning: '',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Failed to generate recommendations',
      }
    }
  }

  /**
   * Process and structure recommendations from AI response
   */
  private processRecommendations(
    recommendationsText: string,
    request: BrokerMatcherRequest,
  ): BrokerMatcherResponse {
    try {
      // Try to parse as JSON first
      let recommendations: any[]
      try {
        recommendations = JSON.parse(recommendationsText)
      } catch {
        // If not JSON, parse from markdown/text format
        recommendations = this.parseTextRecommendations(recommendationsText)
      }

      // Convert to BrokerRecommendation format
      const processedRecommendations: BrokerRecommendation[] = recommendations
        .slice(0, this.MAX_RECOMMENDATIONS)
        .map((rec, index) => ({
          broker: this.createMockBroker(rec.name || `Broker ${index + 1}`),
          score: rec.score || (100 - index * 15),
          reasoning: rec.reasoning || 'Good match for your requirements',
          pros: rec.pros || ['User-friendly', 'Good support'],
          cons: rec.cons || ['Limited features'],
          bestFor: rec.bestFor || [request.preferences.experienceLevel || 'Beginners'],
        }))

      return {
        recommendations: processedRecommendations,
        reasoning: this.generateOverallReasoning(request, processedRecommendations),
        timestamp: new Date().toISOString(),
      }

    } catch (error) {
      console.error('Error processing recommendations:', error)
      return {
        recommendations: [],
        reasoning: 'Unable to process recommendations at this time.',
        timestamp: new Date().toISOString(),
        error: 'Processing error',
      }
    }
  }

  /**
   * Parse recommendations from text format
   */
  private parseTextRecommendations(text: string): any[] {
    const recommendations: any[] = []
    const lines = text.split('\n')
    let currentRecommendation: any = {}

    for (const line of lines) {
      if (line.match(/^\d+\./) || line.includes('**') && line.includes('broker')) {
        if (currentRecommendation.name) {
          recommendations.push(currentRecommendation)
        }
        currentRecommendation = {
          name: line.replace(/^\d+\.\s*\**/, '').replace(/\**\s*$/, '').trim(),
        }
      } else if (line.includes('Why') || line.includes('reason')) {
        currentRecommendation.reasoning = line.replace(/.*[:]\s*/, '').trim()
      } else if (line.includes('Pros') || line.includes('advantages')) {
        currentRecommendation.pros = this.parseListItems(line)
      } else if (line.includes('Cons') || line.includes('disadvantages')) {
        currentRecommendation.cons = this.parseListItems(line)
      }
    }

    if (currentRecommendation.name) {
      recommendations.push(currentRecommendation)
    }

    return recommendations
  }

  /**
   * Parse list items from text
   */
  private parseListItems(text: string): string[] {
    return text
      .split(/[-•*]\s*/)
      .filter(item => item.trim())
      .map(item => item.trim())
      .slice(0, 5) // Limit to 5 items
  }

  /**
   * Create a mock broker (in real implementation, this would match with actual broker data)
   */
  private createMockBroker(name: string): Broker {
    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      websiteUrl: `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
      internalPath: `/#/broker/${name.toLowerCase().replace(/\s+/g, '-')}`,
      score: 85,
      regulation: {
        isRegulated: true,
        regulators: ['FCA', 'CySEC'],
        regulatoryStatus: 'Fully Regulated',
      },
      tradingConditions: {
        spreads: { type: 'variable', typical: 1.2 },
        commission: { type: 'percentage', value: 0.07 },
        maxLeverage: 500,
        minDeposit: 100,
      },
      technology: {
        platforms: ['MT4', 'MT5'],
        executionType: 'ECN',
      },
      accessibility: {
        minDeposit: 100,
        supportedCountries: ['Global'],
        languages: ['English'],
      },
    } as Broker
  }

  /**
   * Generate overall reasoning for recommendations
   */
  private generateOverallReasoning(
    request: BrokerMatcherRequest,
    recommendations: BrokerRecommendation[],
  ): string {
    if (recommendations.length === 0) {
      return 'No suitable brokers found based on your criteria.'
    }

    const reasons = []

    if (request.preferences.tradingStyle) {
      reasons.push(`your ${request.preferences.tradingStyle} trading style`)
    }

    if (request.preferences.experienceLevel) {
      reasons.push(`your ${request.preferences.experienceLevel} experience level`)
    }

    if (request.preferences.initialDeposit) {
      reasons.push(`your budget of $${request.preferences.initialDeposit}`)
    }

    const reasonText = reasons.length > 0
      ? `Based on ${reasons.join(' and ')}, we found ${recommendations.length} suitable brokers.`
      : 'Based on your preferences, we found these recommended brokers.'

    return reasonText
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(request: BrokerMatcherRequest): string {
    const keyData = {
      preferences: request.preferences,
      tradingStyle: request.tradingStyle,
      experience: request.experience,
      budget: request.budget,
      region: request.region,
    }

    return btoa(JSON.stringify(keyData)).substring(0, 50)
  }

  /**
   * Get cached response
   */
  private getFromCache(key: string): BrokerMatcherResponse | null {
    const cached = this.recommendationCache.get(key)
    if (!cached) {return null}

    const now = Date.now()
    const cachedTime = new Date(cached.timestamp).getTime()

    if (now - cachedTime > this.cacheExpiry) {
      this.recommendationCache.delete(key)
      return null
    }

    return cached
  }

  /**
   * Cache response
   */
  private cacheResponse(key: string, response: BrokerMatcherResponse): void {
    this.recommendationCache.set(key, response)
  }

  /**
   * Get comparison between two brokers
   */
  async compareBrokers(broker1Id: string, broker2Id: string): Promise<string> {
    try {
      // This would typically fetch broker details and use AI to compare them
      const comparisonPrompt = `Compare broker ${broker1Id} with broker ${broker2Id} focusing on:
      1. Trading costs (spreads and commissions)
      2. Trading platforms and tools
      3. Regulatory protection
      4. Customer support
      5. Account types and minimum deposits
      
      Provide a balanced comparison with clear pros and cons for each broker.`

      // For now, return a formatted comparison
      return `## Broker Comparison: ${broker1Id} vs ${broker2Id}
      
### Trading Costs
- **${broker1Id}**: Competitive spreads, commission-based pricing
- **${broker2Id}**: Fixed spreads, no commission

### Trading Platforms
- **${broker1Id}**: MT4, MT5, proprietary platform
- **${broker2Id}**: MT4, cTrader, web platform

### Regulation
- **${broker1Id}**: FCA, ASIC regulated
- **${broker2Id}**: CySEC, FSCA regulated

### Recommendation
Choose based on your specific trading needs and preferences.`

    } catch (error) {
      console.error('Broker comparison error:', error)
      return 'Unable to generate comparison at this time.'
    }
  }

  /**
   * Get user's recommendation history
   */
  getRecommendationHistory(): BrokerMatcherResponse[] {
    const history = localStorage.getItem('broker-recommendation-history')
    return history ? JSON.parse(history) : []
  }

  /**
   * Save recommendation to history
   */
  saveToHistory(response: BrokerMatcherResponse): void {
    const history = this.getRecommendationHistory()
    history.unshift(response)

    // Keep only last 10 recommendations
    const limitedHistory = history.slice(0, 10)
    localStorage.setItem('broker-recommendation-history', JSON.stringify(limitedHistory))
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.recommendationCache.clear()
  }
}

// Create singleton instance
const brokerMatcherService = new BrokerMatcherService()

export default brokerMatcherService
