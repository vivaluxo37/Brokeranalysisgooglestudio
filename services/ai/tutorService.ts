/**
 * AI Tutor Service
 * Handles educational content generation and tutoring functionality
 */

import { validateAndSanitize } from '../../utils/validation'
import { secureApiService } from '../secureApiService'

export interface TutorRequest {
  topic: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  userLevel?: string;
  contentFormat?: 'text' | 'quiz' | 'examples' | 'comprehensive';
}

export interface TutorResponse {
  content: string;
  timestamp: string;
  topic: string;
  difficulty: string;
  error?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

class TutorService {
  private readonly contentCache: Map<string, TutorResponse> = new Map()
  private readonly cacheExpiry = 30 * 60 * 1000 // 30 minutes

  /**
   * Get educational content for a specific topic
   */
  async getContent(request: TutorRequest): Promise<TutorResponse> {
    try {
      // Validate input
      const validation = validateAndSanitize(request, {
        topic: {
          required: true,
          minLength: 1,
          maxLength: 200,
          pattern: /^[^<>]*$/,
        },
        difficulty: {
          required: false,
          custom: (value: string) => {
            if (!value) {return true}
            return ['beginner', 'intermediate', 'advanced'].includes(value) ||
                   'Invalid difficulty level'
          },
        },
        userLevel: {
          required: false,
          maxLength: 50,
          pattern: /^[^<>]*$/,
        },
        contentFormat: {
          required: false,
          custom: (value: string) => {
            if (!value) {return true}
            return ['text', 'quiz', 'examples', 'comprehensive'].includes(value) ||
                   'Invalid content format'
          },
        },
      })

      if (!validation.isValid) {
        return {
          content: '',
          timestamp: new Date().toISOString(),
          topic: request.topic,
          difficulty: request.difficulty || 'beginner',
          error: validation.errors.join(', '),
        }
      }

      // Check cache first
      const cacheKey = this.generateCacheKey(validation.data)
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        return cached
      }

      // Get content from API
      const content = await secureApiService.getTutorContent(
        validation.data.topic,
        validation.data.difficulty,
        validation.data.userLevel,
      )

      const response: TutorResponse = {
        content,
        timestamp: new Date().toISOString(),
        topic: validation.data.topic,
        difficulty: validation.data.difficulty || 'beginner',
      }

      // Cache the response
      this.cacheResponse(cacheKey, response)

      return response

    } catch (error) {
      console.error('Tutor service error:', error)
      return {
        content: '',
        timestamp: new Date().toISOString(),
        topic: request.topic,
        difficulty: request.difficulty || 'beginner',
        error: error instanceof Error ? error.message : 'Failed to generate content',
      }
    }
  }

  /**
   * Generate a quiz for a specific topic
   */
  async generateQuiz(topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner'): Promise<QuizQuestion[]> {
    try {
      const content = await this.getContent({
        topic,
        difficulty,
        contentFormat: 'quiz',
      })

      if (content.error) {
        throw new Error(content.error)
      }

      // Parse quiz from content (assuming the AI returns structured quiz data)
      return this.parseQuizFromContent(content.content)

    } catch (error) {
      console.error('Quiz generation error:', error)
      // Return a fallback quiz
      return this.getFallbackQuiz(topic, difficulty)
    }
  }

  /**
   * Get learning path recommendations
   */
  getLearningPath(userLevel: 'beginner' | 'intermediate' | 'advanced'): string[] {
    const paths = {
      beginner: [
        'What is Forex Trading?',
        'Currency Pairs Explained',
        'Reading Price Charts',
        'Market Orders Explained',
        'Risk Management Basics',
        'Choosing Your First Broker',
        'Setting Up a Demo Account',
        'Common Trading Mistakes',
      ],
      intermediate: [
        'Technical Analysis Fundamentals',
        'Candlestick Patterns',
        'Support and Resistance Levels',
        'Moving Averages',
        'Risk-Reward Ratios',
        'Trading Psychology',
        'Economic Calendar Impact',
        'Choosing the Right Trading Platform',
      ],
      advanced: [
        'Advanced Chart Patterns',
        'Fibonacci Retracement',
        'Elliott Wave Theory',
        'Multiple Timeframe Analysis',
        'Algorithmic Trading Basics',
        'Advanced Risk Management',
        'Institutional Trading Strategies',
        'Performance Analysis',
      ],
    }

    return paths[userLevel]
  }

  /**
   * Get topic suggestions based on user progress
   */
  getTopicSuggestions(completedTopics: string[], userLevel: 'beginner' | 'intermediate' | 'advanced'): string[] {
    const allTopics = this.getLearningPath(userLevel)
    const completedSet = new Set(completedTopics)

    return allTopics.filter(topic => !completedSet.has(topic))
  }

  /**
   * Track user progress
   */
  trackProgress(topic: string, score: number, timeSpent: number): void {
    const progress = this.getUserProgress()

    if (!progress[topic]) {
      progress[topic] = {
        attempts: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        lastCompleted: null,
      }
    }

    progress[topic].attempts++
    progress[topic].bestScore = Math.max(progress[topic].bestScore, score)
    progress[topic].totalTimeSpent += timeSpent
    progress[topic].lastCompleted = new Date().toISOString()

    this.saveUserProgress(progress)
  }

  /**
   * Get user progress
   */
  getUserProgress(): Record<string, any> {
    const saved = localStorage.getItem('tutor-progress')
    return saved ? JSON.parse(saved) : {}
  }

  /**
   * Save user progress
   */
  private saveUserProgress(progress: Record<string, any>): void {
    localStorage.setItem('tutor-progress', JSON.stringify(progress))
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(request: TutorRequest): string {
    return `${request.topic}-${request.difficulty || 'beginner'}-${request.userLevel || 'unknown'}-${request.contentFormat || 'text'}`
  }

  /**
   * Get cached response
   */
  private getFromCache(key: string): TutorResponse | null {
    const cached = this.contentCache.get(key)
    if (!cached) {return null}

    const now = Date.now()
    const cachedTime = new Date(cached.timestamp).getTime()

    if (now - cachedTime > this.cacheExpiry) {
      this.contentCache.delete(key)
      return null
    }

    return cached
  }

  /**
   * Cache response
   */
  private cacheResponse(key: string, response: TutorResponse): void {
    this.contentCache.set(key, response)
  }

  /**
   * Parse quiz from content
   */
  private parseQuizFromContent(content: string): QuizQuestion[] {
    try {
      // Try to parse as JSON first
      if (content.trim().startsWith('[') || content.trim().startsWith('{')) {
        return JSON.parse(content)
      }

      // Parse from markdown format
      const questions: QuizQuestion[] = []
      const lines = content.split('\n')
      let currentQuestion: Partial<QuizQuestion> = {}

      for (const line of lines) {
        if (line.startsWith('###') || line.startsWith('**Question:')) {
          if (currentQuestion.question) {
            questions.push(currentQuestion as QuizQuestion)
          }
          currentQuestion = { question: line.replace(/^(###|\*\*Question:\*\*)\s*/, '').trim() }
        } else if (line.startsWith('-') || line.match(/^[A-D]\./)) {
          if (!currentQuestion.options) {currentQuestion.options = []}
          currentQuestion.options.push(line.replace(/^[-A-D.]\s*/, '').trim())
        } else if (line.includes('Correct') || line.includes('Answer:')) {
          const match = line.match(/(\d+)/)
          if (match) {currentQuestion.correctAnswer = parseInt(match[1]) - 1}
        }
      }

      if (currentQuestion.question) {
        questions.push(currentQuestion as QuizQuestion)
      }

      return questions.length > 0 ? questions : this.getFallbackQuiz('General', 'beginner')
    } catch (error) {
      console.error('Failed to parse quiz:', error)
      return this.getFallbackQuiz('General', 'beginner')
    }
  }

  /**
   * Get fallback quiz
   */
  private getFallbackQuiz(topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced'): QuizQuestion[] {
    return [
      {
        question: `What is the main purpose of ${topic}?`,
        options: [
          'To understand market trends',
          'To make profitable trades',
          'To analyze financial data',
          'All of the above',
        ],
        correctAnswer: 3,
        explanation: `${topic} serves multiple purposes in trading education.`,
      },
    ]
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.contentCache.clear()
  }
}

// Create singleton instance
const tutorService = new TutorService()

export default tutorService
