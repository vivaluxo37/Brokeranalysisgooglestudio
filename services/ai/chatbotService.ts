/**
 * Chatbot Service
 * Handles all chatbot-related functionality
 */

import { validateAndSanitize, userMessageSchema } from '../../utils/validation'
import { secureApiService } from '../secureApiService'

import type { Broker } from '../../types'

export interface ChatbotMessage {
  message: string;
  brokerContext?: string;
}

export interface ChatbotResponse {
  response: string;
  timestamp: string;
  error?: string;
}

class ChatbotService {
  private readonly conversationHistory: Map<string, ChatbotMessage[]> = new Map()
  private readonly maxHistoryLength = 10

  /**
   * Send a message to the chatbot
   */
  async sendMessage(message: string, brokerContext?: string): Promise<ChatbotResponse> {
    try {
      // Validate input
      const validation = validateAndSanitize(
        { message, brokerContext: brokerContext || '' },
        userMessageSchema,
      )

      if (!validation.isValid) {
        return {
          response: '',
          timestamp: new Date().toISOString(),
          error: validation.errors.join(', '),
        }
      }

      // Get conversation context
      const conversationId = this.getConversationId()
      const history = this.getConversationHistory(conversationId)

      // Add current message to history
      history.push(validation.data)
      this.trimHistory(conversationId)

      // Send to API
      const response = await secureApiService.sendChatbotMessage(
        validation.data.message,
        validation.data.brokerContext,
      )

      // Add response to history
      history.push({
        message: response,
        timestamp: new Date().toISOString(),
      })

      return {
        response,
        timestamp: new Date().toISOString(),
      }

    } catch (error) {
      console.error('Chatbot service error:', error)
      return {
        response: '',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory(conversationId?: string): ChatbotMessage[] {
    const id = conversationId || this.getConversationId()
    return this.conversationHistory.get(id) || []
  }

  /**
   * Clear conversation history
   */
  clearHistory(conversationId?: string): void {
    const id = conversationId || this.getConversationId()
    this.conversationHistory.delete(id)
  }

  /**
   * Get or generate conversation ID
   */
  private getConversationId(): string {
    let conversationId = sessionStorage.getItem('chatbot-conversation-id')

    if (!conversationId) {
      conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('chatbot-conversation-id', conversationId)
    }

    return conversationId
  }

  /**
   * Trim conversation history to prevent memory issues
   */
  private trimHistory(conversationId: string): void {
    const history = this.conversationHistory.get(conversationId)
    if (history && history.length > this.maxHistoryLength) {
      this.conversationHistory.set(
        conversationId,
        history.slice(-this.maxHistoryLength),
      )
    }
  }

  /**
   * Format broker data for context
   */
  formatBrokerContext(brokers: Broker[]): string {
    return JSON.stringify(
      brokers.map(broker => ({
        id: broker.id,
        name: broker.name,
        websiteUrl: broker.websiteUrl,
        internalPath: `/#/broker/${broker.id}`,
        score: broker.score,
        minDeposit: broker.accessibility.minDeposit,
        platforms: broker.technology.platforms,
        maxLeverage: broker.tradingConditions.maxLeverage,
        regulators: broker.regulation.regulators,
        spreads: broker.tradingConditions.spreads,
        commission: broker.tradingConditions.commission,
        executionType: broker.technology.executionType,
      })),
      null,
      2,
    )
  }

  /**
   * Get suggested questions based on context
   */
  getSuggestedQuestions(context?: 'beginner' | 'intermediate' | 'advanced'): string[] {
    const suggestions = {
      beginner: [
        'What is forex trading?',
        'How do I choose a broker?',
        'What is leverage?',
        'How much money do I need to start?',
        'What are the risks?',
      ],
      intermediate: [
        'What are the best ECN brokers?',
        'How do spreads work?',
        'What trading platforms should I use?',
        'How do I manage risk?',
        'What are the best strategies?',
      ],
      advanced: [
        'Which brokers have the lowest spreads?',
        'How do I optimize my trading costs?',
        'What are the regulatory differences?',
        'How do I compare execution speeds?',
        'What are the best professional tools?',
      ],
    }

    return suggestions[context || 'beginner']
  }

  /**
   * Analyze sentiment of user message
   */
  analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['good', 'great', 'excellent', 'best', 'amazing', 'helpful', 'thank']
    const negativeWords = ['bad', 'terrible', 'worst', 'awful', 'useless', 'frustrated', 'angry']

    const lowerMessage = message.toLowerCase()

    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length

    if (positiveCount > negativeCount) {return 'positive'}
    if (negativeCount > positiveCount) {return 'negative'}
    return 'neutral'
  }

  /**
   * Get chat statistics
   */
  getStatistics(): {
    totalConversations: number;
    totalMessages: number;
    averageMessagesPerConversation: number;
    } {
    const totalConversations = this.conversationHistory.size
    let totalMessages = 0

    this.conversationHistory.forEach(history => {
      totalMessages += history.length
    })

    return {
      totalConversations,
      totalMessages,
      averageMessagesPerConversation: totalConversations > 0 ? totalMessages / totalConversations : 0,
    }
  }
}

// Create singleton instance
const chatbotService = new ChatbotService()

export default chatbotService
