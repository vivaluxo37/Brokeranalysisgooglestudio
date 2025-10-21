/**
 * AI Provider Configuration and Management System
 * Supports Gemini (primary), HuggingFace, and OpenRouter as fallback providers
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

// AI Provider Types and Interfaces
export interface AIProvider {
  name: string;
  type: 'gemini' | 'huggingface' | 'openrouter';
  apiKey: string;
  baseUrl?: string;
  models: AIModel[];
  priority: number; // Lower number = higher priority
  rateLimit?: {
    requestsPerMinute?: number;
    requestsPerDay?: number;
    tokensPerMinute?: number;
  };
  isAvailable: boolean;
  lastError?: string;
  lastUsed?: Date;
  failureCount: number;
  successCount: number;
}

export interface AIModel {
  id: string;
  name: string;
  contextWindow: number;
  isFree?: boolean;
  capabilities?: string[];
}

export interface StreamResponse {
  stream: ReadableStream;
  provider: string;
  model: string;
}

// API Keys and Configuration
const GEMINI_API_KEY = import.meta.env.VITE_API_KEY
const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_KEY
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_KEY

// Debug environment variables
console.log('[AI Providers] Environment variables status:', {
  GEMINI_API_KEY: GEMINI_API_KEY ? '✅ Available' : '❌ Missing',
  HUGGINGFACE_API_KEY: HUGGINGFACE_API_KEY ? '✅ Available' : '❌ Missing',
  OPENROUTER_API_KEY: OPENROUTER_API_KEY ? '✅ Available' : '❌ Missing',
})

// Provider Configurations
export const AI_PROVIDERS: AIProvider[] = [
  {
    name: 'Google Gemini',
    type: 'gemini',
    apiKey: GEMINI_API_KEY,
    priority: 1,
    models: [
      { id: 'gemini-pro-latest', name: 'Gemini Pro Latest', contextWindow: 128000 },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', contextWindow: 128000 },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', contextWindow: 128000 },
    ],
    rateLimit: {
      requestsPerMinute: 60,
      requestsPerDay: 1500,
    },
    isAvailable: true,
    failureCount: 0,
    successCount: 0,
  },
  {
    name: 'HuggingFace',
    type: 'huggingface',
    apiKey: HUGGINGFACE_API_KEY,
    baseUrl: 'https://api-inference.huggingface.co/models',
    priority: 2,
    models: [
      { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct', name: 'Llama 3.1 70B', contextWindow: 32000, isFree: true },
      { id: 'mistralai/Mistral-7B-Instruct-v0.3', name: 'Mistral 7B', contextWindow: 8192, isFree: true },
      { id: 'microsoft/Phi-3.5-mini-instruct', name: 'Phi 3.5 Mini', contextWindow: 8192, isFree: true },
      { id: 'google/gemma-2-9b-it', name: 'Gemma 2 9B', contextWindow: 8192, isFree: true },
    ],
    rateLimit: {
      requestsPerMinute: 10,
      requestsPerDay: 100,
    },
    isAvailable: true,
    failureCount: 0,
    successCount: 0,
  },
  {
    name: 'OpenRouter',
    type: 'openrouter',
    apiKey: OPENROUTER_API_KEY,
    baseUrl: 'https://openrouter.ai/api/v1',
    priority: 3,
    models: [
      { id: 'openrouter/sonoma-dusk-alpha', name: 'Sonoma Dusk Alpha', contextWindow: 2000000, isFree: true },
      { id: 'openrouter/sonoma-sky-alpha', name: 'Sonoma Sky Alpha', contextWindow: 2000000, isFree: true },
      { id: 'deepseek/deepseek-chat-v3.1:free', name: 'DeepSeek V3.1', contextWindow: 64000, isFree: true },
      { id: 'openai/gpt-oss-120b:free', name: 'GPT OSS 120B', contextWindow: 33000, isFree: true },
      { id: 'openai/gpt-oss-20b:free', name: 'GPT OSS 20B', contextWindow: 131000, isFree: true },
      { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air', contextWindow: 131000, isFree: true },
      { id: 'qwen/qwen3-coder:free', name: 'Qwen3 Coder', contextWindow: 262000, isFree: true },
      { id: 'moonshotai/kimi-k2:free', name: 'Kimi K2', contextWindow: 33000, isFree: true },
      { id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', name: 'Venice Uncensored', contextWindow: 33000, isFree: true },
      { id: 'google/gemma-3n-e2b-it:free', name: 'Gemma 3n 2B', contextWindow: 8000, isFree: true },
      { id: 'tencent/hunyuan-a13b-instruct:free', name: 'Hunyuan A13B', contextWindow: 32000, isFree: true },
    ],
    rateLimit: {
      requestsPerMinute: 20,
      requestsPerDay: 1000,
    },
    isAvailable: true,
    failureCount: 0,
    successCount: 0,
  },
]

// Provider Manager Class
class AIProviderManager {
  private readonly providers: AIProvider[] = [...AI_PROVIDERS]
  private readonly currentProviderIndex: number = 0
  private readonly requestCounts: Map<string, { minute: number; day: number; timestamp: Date }> = new Map()
  private readonly geminiClient: GoogleGenerativeAI

  constructor() {
    this.geminiClient = new GoogleGenerativeAI(GEMINI_API_KEY)
    this.initializeRequestTracking()
  }

  private initializeRequestTracking() {
    this.providers.forEach(provider => {
      this.requestCounts.set(provider.name, {
        minute: 0,
        day: 0,
        timestamp: new Date(),
      })
    })
  }

  private isRateLimited(provider: AIProvider): boolean {
    const counts = this.requestCounts.get(provider.name)
    if (!counts || !provider.rateLimit) {return false}

    const now = new Date()
    const timeDiff = now.getTime() - counts.timestamp.getTime()

    // Reset minute counter if more than a minute has passed
    if (timeDiff > 60000) {
      counts.minute = 0
    }

    // Reset day counter if it's a new day
    if (counts.timestamp.getDate() !== now.getDate()) {
      counts.day = 0
      counts.minute = 0
    }

    // Check rate limits
    if (provider.rateLimit.requestsPerMinute && counts.minute >= provider.rateLimit.requestsPerMinute) {
      return true
    }
    if (provider.rateLimit.requestsPerDay && counts.day >= provider.rateLimit.requestsPerDay) {
      return true
    }

    return false
  }

  private incrementRequestCount(providerName: string) {
    const counts = this.requestCounts.get(providerName)
    if (counts) {
      counts.minute++
      counts.day++
      counts.timestamp = new Date()
    }
  }

  private async callGeminiAPI(prompt: string, systemInstruction?: string, stream: boolean = true): Promise<any> {
    try {
      // Check if API key is available
      if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key' || GEMINI_API_KEY.startsWith('your_')) {
        console.error('[AI Providers] Gemini API key not configured or invalid')
        throw new Error('Gemini API key is not configured')
      }

      console.log('[AI Providers] Using Gemini API with key length:', GEMINI_API_KEY.length)

      const model = this.geminiClient.getGenerativeModel({
        model: 'gemini-pro-latest',
        ...(systemInstruction && { systemInstruction }),
      })

      this.incrementRequestCount('Google Gemini')

      if (stream) {
        const result = await model.generateContentStream(prompt)
        return result.stream
      }
      const result = await model.generateContent(prompt)
      return result.response.text()

    } catch (error: any) {
      console.error('Gemini API error:', error)

      // Check for various error types
      const errorMessage = error.message || error.toString()
      if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('limit')) {
        this.providers[0].isAvailable = false
        this.providers[0].lastError = 'Rate limit exceeded'
        this.providers[0].failureCount++

        // Mark Gemini as rate limited for 1 minute
        setTimeout(() => {
          this.providers[0].isAvailable = true
          this.providers[0].lastError = undefined
        }, 60000)
      } else if (errorMessage.includes('API key') || errorMessage.includes('permission')) {
        this.providers[0].isAvailable = false
        this.providers[0].lastError = 'API key invalid or missing'
        this.providers[0].failureCount++
      } else {
        this.providers[0].failureCount++
        this.providers[0].lastError = errorMessage
      }

      throw error
    }
  }

  private async callHuggingFaceAPI(prompt: string, modelId: string, stream: boolean = true): Promise<any> {
    const url = `${this.providers[1].baseUrl}/${modelId}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.7,
            stream,
            return_full_text: false,
          },
        }),
      })

      this.incrementRequestCount('HuggingFace')

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`HuggingFace API error: ${error}`)
      }

      if (stream && response.body) {
        // Create a custom stream for HuggingFace
        return this.createHuggingFaceStream(response.body)
      }
      const data = await response.json()
      return data[0]?.generated_text || data.generated_text || ''

    } catch (error) {
      console.error('HuggingFace API error:', error)
      this.providers[1].failureCount++
      throw error
    }
  }

  private createHuggingFaceStream(body: ReadableStream): ReadableStream {
    return new ReadableStream({
      async start(controller) {
        const reader = body.getReader()
        const decoder = new TextDecoder()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {break}

            const chunk = decoder.decode(value)
            controller.enqueue(new TextEncoder().encode(chunk))
          }
        } finally {
          controller.close()
        }
      },
    })
  }

  private async callOpenRouterAPI(prompt: string, modelId: string, stream: boolean = true): Promise<any> {
    const url = `${this.providers[2].baseUrl}/chat/completions`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Broker Analysis Tool',
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'user', content: prompt },
          ],
          stream,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      })

      this.incrementRequestCount('OpenRouter')

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`OpenRouter API error: ${error}`)
      }

      if (stream && response.body) {
        // OpenRouter returns SSE stream
        return this.createOpenRouterStream(response.body)
      }
      const data = await response.json()
      return data.choices[0]?.message?.content || ''

    } catch (error) {
      console.error('OpenRouter API error:', error)
      this.providers[2].failureCount++
      throw error
    }
  }

  private createOpenRouterStream(body: ReadableStream): ReadableStream {
    return new ReadableStream({
      async start(controller) {
        const reader = body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {break}

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  controller.close()
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices[0]?.delta?.content
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content))
                  }
                } catch (e) {
                  // Ignore parse errors
                }
              }
            }
          }
        } finally {
          controller.close()
        }
      },
    })
  }

  public async generateResponse(
    prompt: string,
    options: {
      systemInstruction?: string;
      stream?: boolean;
      preferredProvider?: string;
    } = {},
  ): Promise<any> {
    const { systemInstruction, stream = true, preferredProvider } = options

    console.log('🤖 AI Provider Manager: Starting response generation...')
    console.log(`📝 Prompt length: ${prompt.length} characters`)
    console.log(`🔄 Stream mode: ${stream}`)

    // Sort providers by priority
    const sortedProviders = [...this.providers].sort((a, b) => a.priority - b.priority)

    // Try preferred provider first if specified
    if (preferredProvider) {
      const preferred = sortedProviders.find(p => p.name === preferredProvider)
      if (preferred) {
        sortedProviders.splice(sortedProviders.indexOf(preferred), 1)
        sortedProviders.unshift(preferred)
      }
    }

    let lastError: Error | null = null

    // Try each provider in order until one succeeds
    for (const provider of sortedProviders) {
      console.log(`🔍 Testing ${provider.name} (Available: ${provider.isAvailable}, Failures: ${provider.failureCount})`)

      if (!provider.isAvailable || this.isRateLimited(provider)) {
        const reason = !provider.isAvailable ? 'Not available' : 'Rate limited'
        console.log(`⏭️ Skipping ${provider.name}: ${reason}`)
        if (provider.lastError) {
          console.log(`📄 Last error: ${provider.lastError}`)
        }
        continue
      }

      try {
        console.log(`🚀 Using ${provider.name} for AI response`)
        provider.lastUsed = new Date()

        let result

        switch (provider.type) {
          case 'gemini':
            result = await this.callGeminiAPI(prompt, systemInstruction, stream)
            break

          case 'huggingface':
            // Select the best available model
            const hfModel = provider.models[0].id
            result = await this.callHuggingFaceAPI(
              systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt,
              hfModel,
              stream,
            )
            break

          case 'openrouter':
            // Use the best free model (Sonoma Dusk Alpha for best quality)
            const orModel = provider.models[0].id
            const fullPrompt = systemInstruction
              ? `System: ${systemInstruction}\n\nUser: ${prompt}`
              : prompt
            result = await this.callOpenRouterAPI(fullPrompt, orModel, stream)
            break

          default:
            throw new Error(`Unknown provider type: ${provider.type}`)
        }

        provider.successCount++

        // Log successful usage
        console.log(`✅ Successfully used ${provider.name} (Success: ${provider.successCount}, Failures: ${provider.failureCount})`)

        return {
          result,
          provider: provider.name,
          model: provider.type === 'gemini' ? 'gemini-pro-latest' : provider.models[0].name,
        }

      } catch (error) {
        console.error(`❌ Error with ${provider.name}:`, error)
        lastError = error instanceof Error ? error : new Error(String(error))
        provider.failureCount++
        provider.lastError = lastError.message

        // If this was the last provider, throw the error
        if (provider === sortedProviders[sortedProviders.length - 1]) {
          const errorMessage = `All AI providers failed. Last error: ${lastError.message}`
          console.error(`🚫 ${errorMessage}`)
          throw new Error(errorMessage)
        }
      }
    }

    const noProvidersError = new Error('No AI providers available')
    console.error('🚫 No AI providers are available')
    throw noProvidersError
  }

  public getProviderStatus(): AIProvider[] {
    return this.providers.map(p => ({
      ...p,
      requestCounts: this.requestCounts.get(p.name),
    }))
  }

  public resetProvider(providerName: string) {
    const provider = this.providers.find(p => p.name === providerName)
    if (provider) {
      provider.isAvailable = true
      provider.failureCount = 0
      provider.lastError = undefined

      const counts = this.requestCounts.get(providerName)
      if (counts) {
        counts.minute = 0
        counts.day = 0
      }
    }
  }
}

// Export singleton instance
export const aiProviderManager = new AIProviderManager()
