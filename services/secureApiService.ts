/**
 * Secure API Service
 * Handles all API calls through the secure proxy server
 */

import { validateAndSanitize, userMessageSchema, globalRateLimiter } from '../utils/validation'

import type { Broker, AIRecommendation } from '../types'

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-api.com'
  : 'http://localhost:3001'

class SecureApiService {
  private getClientIdentifier(): string {
    // Get a unique identifier for rate limiting
    // In a real app, this could be user ID, IP, or session ID
    return sessionStorage.getItem('clientId') ||
           localStorage.getItem('clientId') ||
           `anonymous-${ Math.random().toString(36).substr(2, 9)}`
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, defaultOptions)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      return response
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  /**
   * Check if the proxy server is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.request('/health')
      const data = await response.json()
      return data.status === 'OK'
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }

  /**
   * Send chatbot message through secure proxy
   */
  async sendChatbotMessage(message: string, brokerContext?: string): Promise<string> {
    // Rate limiting check
    const clientIdentifier = this.getClientIdentifier()
    if (!globalRateLimiter.isAllowed(clientIdentifier)) {
      throw new Error('Too many requests. Please wait before trying again.')
    }

    // Validate and sanitize input
    const validationResult = validateAndSanitize(
      { message, brokerContext: brokerContext || '' },
      userMessageSchema,
    )

    if (!validationResult.isValid) {
      throw new Error(validationResult.errors.join(', '))
    }

    try {
      const response = await this.request('/api/chatbot', {
        method: 'POST',
        body: JSON.stringify(validationResult.data),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to get chatbot response')
      }

      return data.response
    } catch (error) {
      console.error('Chatbot API error:', error)
      throw new Error('Unable to process your request. Please try again later.')
    }
  }

  /**
   * Get broker recommendations through secure proxy
   */
  async getBrokerRecommendations(
    preferences: Record<string, any>,
    tradingStyle?: string,
    experience?: string,
    budget?: string,
    region?: string,
  ): Promise<string> {
    if (!preferences || typeof preferences !== 'object') {
      throw new Error('Invalid preferences format')
    }

    try {
      const response = await this.request('/api/broker-matcher', {
        method: 'POST',
        body: JSON.stringify({
          preferences,
          tradingStyle: tradingStyle?.substring(0, 100),
          experience: experience?.substring(0, 50),
          budget: budget?.substring(0, 100),
          region: region?.substring(0, 100),
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to get broker recommendations')
      }

      return data.recommendations
    } catch (error) {
      console.error('Broker matcher API error:', error)
      throw new Error('Unable to generate broker recommendations. Please try again later.')
    }
  }

  /**
   * Generic method for future API endpoints
   */
  async customRequest(endpoint: string, data: any): Promise<any> {
    try {
      const response = await this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Request failed')
      }

      return result.data || result
    } catch (error) {
      console.error(`Custom API request failed for ${endpoint}:`, error)
      throw error
    }
  }
}

// Create singleton instance
export const secureApiService = new SecureApiService()

// Export types for better TypeScript support
export interface ChatbotMessage {
  message: string;
  brokerContext?: string;
}

export interface BrokerMatcherRequest {
  preferences: Record<string, any>;
  tradingStyle?: string;
  experience?: string;
  budget?: string;
  region?: string;
}
