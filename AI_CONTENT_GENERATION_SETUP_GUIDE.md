# AI Content Generation Setup Guide

## Overview
This guide provides detailed instructions for setting up and configuring the AI content generation system using the Gemini API for the programmatic SEO system.

## Current Implementation Status

### ✅ Already Implemented
- `AIContentGenerator` service with Gemini API integration
- Content templates for different page types
- Rate limiting and caching integration
- Content validation service
- Quality scoring system

### 🔄 Needs Configuration
- Gemini API key setup
- Content generation templates optimization
- Rate limiting configuration
- Error handling and retry logic

## 1. Gemini API Setup

### Step 1: Get Gemini API Key

1. **Go to Google AI Studio**
   - Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key"
   - Give your key a descriptive name (e.g., "Broker Analysis SEO")
   - Copy the API key for configuration

3. **Enable APIs**
   - Ensure the Generative Language API is enabled
   - Check quota limits and usage limits

### Step 2: Configure Environment Variables

Add to your `.env` file:

```bash
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=2048
GEMINI_TOP_P=0.8
GEMINI_TOP_K=40

# Content Generation Settings
CONTENT_GENERATION_ENABLED=true
CONTENT_GENERATION_BATCH_SIZE=10
CONTENT_GENERATION_RETRY_ATTEMPTS=3
CONTENT_GENERATION_RETRY_DELAY=1000
```

## 2. Enhanced Content Generation Service

### File: `services/content/enhancedAIContentGenerator.ts`

```typescript
/**
 * Enhanced AI Content Generator
 * 
 * Enhanced version with better error handling, retry logic,
 * and content optimization
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { contentCache } from '../cache/contentCache';
import { rateLimiter } from '../utils/rateLimiter';
import { contentValidationService } from './contentValidationService';
import { performanceMonitoringService } from '../performance/performanceMonitoringService';

interface EnhancedContentGenerationRequest {
  type: 'page_content' | 'meta_description' | 'article' | 'comparison' | 'faq';
  context: {
    pageType: string;
    category?: string;
    country?: string;
    broker?: string;
    strategy?: string;
    feature?: string;
    keywords?: string[];
    targetAudience?: string;
    tone?: 'professional' | 'friendly' | 'technical' | 'promotional' | 'educational' | 'analytical';
    length?: 'short' | 'medium' | 'long';
    region?: string;
    topic?: string;
  };
  options?: {
    includeStructuredData?: boolean;
    includeFAQs?: boolean;
    includeComparison?: boolean;
    maxTokens?: number;
    temperature?: number;
    length?: 'short' | 'medium' | 'long';
    optimizeForSEO?: boolean;
    language?: string;
    retryOnFailure?: boolean;
  };
}

interface EnhancedContentGenerationResult {
  content: string;
  structuredData?: Record<string, any>;
  faqs?: Array<{ question: string; answer: string }>;
  comparison?: Array<{ feature: string; value: string }>;
  metadata: {
    wordCount: number;
    readingTime: number;
    qualityScore: number;
    generatedAt: string;
    model: string;
    tokensUsed: number;
    generationTime: number;
    retryCount: number;
  };
  validation: {
    isValid: boolean;
    score: number;
    issues: Array<{
      type: 'error' | 'warning' | 'info';
      category: 'quality' | 'seo' | 'compliance' | 'technical';
      message: string;
      suggestion?: string;
    }>;
  };
}

export class EnhancedAIContentGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private config = {
    maxRetries: 3,
    retryDelay: 1000,
    timeoutMs: 30000,
    qualityThreshold: 0.7,
    maxTokens: 2048,
    temperature: 0.7
  };

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-pro',
      generationConfig: {
        temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
        topP: parseFloat(process.env.GEMINI_TOP_P || '0.8'),
        topK: parseInt(process.env.GEMINI_TOP_K || '40'),
        maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '2048'),
      }
    });
  }

  /**
   * Generate enhanced content with retry logic and validation
   */
  async generateContent(
    request: EnhancedContentGenerationRequest
  ): Promise<EnhancedContentGenerationResult> {
    const startTime = Date.now();
    let retryCount = 0;
    let lastError: Error | null = null;

    // Check cache first
    const cacheKey = this.generateCacheKey(request);
    const cachedResult = await contentCache.get(cacheKey);
    if (cachedResult) {
      return {
        ...cachedResult,
        metadata: {
          ...cachedResult.metadata,
          generationTime: Date.now() - startTime,
          retryCount: 0
        }
      };
    }

    // Apply rate limiting
    await rateLimiter.checkLimit('ai-content-generation');

    // Retry logic
    while (retryCount <= this.config.maxRetries) {
      try {
        const result = await this.attemptContentGeneration(request, retryCount);
        
        // Validate content
        const validation = await contentValidationService.validateContent(
          result.content,
          {
            type: request.context.pageType,
            keywords: request.context.keywords || [],
            targetLength: this.getTargetLength(request),
            category: request.context.category,
            country: request.context.country
          }
        );

        // Check if content meets quality threshold
        if (validation.score >= this.config.qualityThreshold) {
          const enhancedResult: EnhancedContentGenerationResult = {
            ...result,
            validation,
            metadata: {
              ...result.metadata,
              generationTime: Date.now() - startTime,
              retryCount
            }
          };

          // Cache successful result
          await contentCache.set(cacheKey, enhancedResult, {
            ttl: 24 * 60 * 60 * 1000, // 24 hours
            tags: this.generateCacheTags(request)
          });

          return enhancedResult;
        } else {
          throw new Error(`Content quality score ${validation.score} below threshold ${this.config.qualityThreshold}`);
        }

      } catch (error) {
        lastError = error as Error;
        retryCount++;
        
        if (retryCount <= this.config.maxRetries) {
          console.warn(`Content generation attempt ${retryCount} failed:`, error);
          await this.delay(this.config.retryDelay * retryCount);
        }
      }
    }

    // All retries failed
    throw new Error(`Content generation failed after ${retryCount} attempts: ${lastError?.message}`);
  }

  /**
   * Attempt content generation
   */
  private async attemptContentGeneration(
    request: EnhancedContentGenerationRequest,
    retryCount: number
  ): Promise<Omit<EnhancedContentGenerationResult, 'validation' | 'metadata'>> {
    const startTime = Date.now();

    // Get appropriate template
    const template = this.getTemplate(request);
    if (!template) {
      throw new Error(`No template found for content type: ${request.type}`);
    }

    // Build prompt
    const prompt = this.buildPrompt(template, request, retryCount);

    // Add retry-specific instructions
    const enhancedPrompt = retryCount > 0 ? 
      `${prompt}\n\nPlease ensure this response is high quality and comprehensive.` : 
      prompt;

    // Generate content with timeout
    const result = await Promise.race([
      this.model.generateContent(enhancedPrompt),
      this.timeout(this.config.timeoutMs)
    ]);

    const generatedText = result.response.text();
    const generationTime = Date.now() - startTime;

    // Process content
    const processedResult = await this.processGeneratedContent(
      generatedText,
      request,
      template,
      generationTime
    );

    return processedResult;
  }

  /**
   * Get template for request
   */
  private getTemplate(request: EnhancedContentGenerationRequest) {
    const templates = {
      'category_page': this.getCategoryPageTemplate(),
      'country_page': this.getCountryPageTemplate(),
      'category_country_page': this.getCategoryCountryPageTemplate(),
      'meta_description': this.getMetaDescriptionTemplate(),
      'strategy_guide': this.getStrategyGuideTemplate(),
      'feature_comparison': this.getFeatureComparisonTemplate()
    };

    const templateKey = this.getTemplateKey(request);
    return templates[templateKey];
  }

  /**
   * Get category page template
   */
  private getCategoryPageTemplate() {
    return {
      id: 'category_page',
      name: 'Category Page Content',
      type: 'page_content',
      prompt: `Generate comprehensive, SEO-optimized content for a {category} trading category page targeting {country} traders.

REQUIREMENTS:
- Professional yet accessible tone
- 800-1200 words
- Include key benefits and considerations
- Mention top regulatory requirements
- Highlight important features to look for
- Include practical tips for beginners
- Add comparison points for broker selection
- End with clear call-to-action
- Use proper heading structure (H1, H2, H3)
- Include bullet points and numbered lists
- Optimize for search engines with natural keyword usage

CONTEXT:
- Category: {category}
- Country: {country}
- Target Audience: {targetAudience}
- Keywords: {keywords}
- Language: {language}

STRUCTURE:
1. Introduction to {category} trading
2. Benefits of {category} trading in {country}
3. Regulatory considerations
4. How to choose the best {category} broker
5. Key features and tools
6. Getting started guide
7. Conclusion

SEO REQUIREMENTS:
- Include primary keyword "{category}" naturally
- Use secondary keywords from: {keywords}
- Include location-based terms for {country}
- Maintain keyword density of 1-2%
- Use related semantic terms

Generate the content now:`,
      variables: ['category', 'country', 'targetAudience', 'keywords', 'language']
    };
  }

  /**
   * Get country page template
   */
  private getCountryPageTemplate() {
    return {
      id: 'country_page',
      name: 'Country Page Content',
      type: 'page_content',
      prompt: `Create comprehensive, SEO-optimized content for trading brokers in {country}.

REQUIREMENTS:
- Professional and informative tone
- 1000-1500 words
- Cover regulatory landscape
- Include tax considerations
- Mention popular trading instruments
- Highlight local market specifics
- Include broker selection criteria
- Add practical guidance
- Use proper heading structure
- Include local context and examples

CONTEXT:
- Country: {country}
- Region: {region}
- Currency: {currency}
- Regulatory Authority: {regulatoryAuthority}
- Target Audience: {targetAudience}
- Keywords: {keywords}
- Language: {language}

STRUCTURE:
1. Trading landscape in {country}
2. Regulatory framework and investor protection
3. Tax implications for traders
4. Popular trading instruments and markets
5. How to choose a broker in {country}
6. Local trading considerations
7. Recommended broker features
8. Getting started guide

SEO REQUIREMENTS:
- Include "{country}" naturally throughout
- Use regulatory authority name: {regulatoryAuthority}
- Include currency: {currency}
- Use local trading terms
- Target keywords: {keywords}

Generate the content now:`,
      variables: ['country', 'region', 'currency', 'regulatoryAuthority', 'targetAudience', 'keywords', 'language']
    };
  }

  /**
   * Get category-country page template
   */
  private getCategoryCountryPageTemplate() {
    return {
      id: 'category_country_page',
      name: 'Category-Country Page Content',
      type: 'page_content',
      prompt: `Generate specialized, SEO-optimized content for {category} trading in {country}.

REQUIREMENTS:
- Highly targeted and specific content
- 900-1300 words
- Combine category expertise with local market knowledge
- Include country-specific regulations for {category}
- Mention local broker options
- Highlight unique opportunities
- Provide actionable advice
- Use local examples and context
- Optimize for local search intent

CONTEXT:
- Category: {category}
- Country: {country}
- Region: {region}
- Currency: {currency}
- Target Audience: {targetAudience}
- Keywords: {keywords}
- Language: {language}

STRUCTURE:
1. {category} trading opportunities in {country}
2. Regulatory requirements for {category} trading
3. Market specifics and trading hours
4. Top {category} brokers serving {country}
5. Platform and tool recommendations
6. Risk management strategies
7. Tax considerations for {category} traders
8. Getting started checklist

SEO REQUIREMENTS:
- Target long-tail keywords: "{category} {country}"
- Include local regulatory information
- Use currency: {currency}
- Mention local trading hours
- Target keywords: {keywords}

Generate the content now:`,
      variables: ['category', 'country', 'region', 'currency', 'targetAudience', 'keywords', 'language']
    };
  }

  /**
   * Get meta description template
   */
  private getMetaDescriptionTemplate() {
    return {
      id: 'meta_description',
      name: 'Meta Description',
      type: 'meta_description',
      prompt: `Create a compelling, SEO-optimized meta description (150-160 characters) for a {pageType} page about {topic} targeting {country}.

REQUIREMENTS:
- Include primary keyword naturally
- Compelling and clickable
- Clear value proposition
- Call-to-action oriented
- Under 160 characters
- Include location if relevant
- Use action words
- Stand out in search results

CONTEXT:
- Page Type: {pageType}
- Topic: {topic}
- Country: {country}
- Keywords: {keywords}
- Language: {language}

Generate the meta description:`,
      variables: ['pageType', 'topic', 'country', 'keywords', 'language']
    };
  }

  /**
   * Get strategy guide template
   */
  private getStrategyGuideTemplate() {
    return {
      id: 'strategy_guide',
      name: 'Strategy Guide Content',
      type: 'article',
      prompt: `Create a comprehensive, educational guide for {strategy} trading strategy.

REQUIREMENTS:
- Educational and practical tone
- 1200-1800 words
- Step-by-step instructions
- Include examples and case studies
- Risk management section
- Tool and indicator recommendations
- Common mistakes to avoid
- Visual descriptions for charts
- Actionable tips

CONTEXT:
- Strategy: {strategy}
- Experience Level: {experienceLevel}
- Trading Style: {tradingStyle}
- Timeframes: {timeframes}
- Target Audience: {targetAudience}
- Keywords: {keywords}
- Language: {language}

STRUCTURE:
1. What is {strategy} trading?
2. How {strategy} strategy works
3. Required tools and indicators
4. Step-by-step implementation
5. Risk management techniques
6. Examples and case studies
7. Common mistakes and how to avoid them
8. Tips for success
9. Conclusion

SEO REQUIREMENTS:
- Target "{strategy}" as primary keyword
- Include related trading terms
- Use educational keywords
- Target keywords: {keywords}

Generate the comprehensive guide now:`,
      variables: ['strategy', 'experienceLevel', 'tradingStyle', 'timeframes', 'targetAudience', 'keywords', 'language']
    };
  }

  /**
   * Get feature comparison template
   */
  private getFeatureComparisonTemplate() {
    return {
      id: 'feature_comparison',
      name: 'Feature Comparison Content',
      type: 'comparison',
      prompt: `Create detailed comparison content for brokers offering {feature}.

REQUIREMENTS:
- Comparative and analytical tone
- 800-1200 words
- Feature-by-feature analysis
- Include pros and cons
- Provider recommendations
- Selection criteria
- Comparison table format
- Actionable insights

CONTEXT:
- Feature: {feature}
- Target Audience: {targetAudience}
- Keywords: {keywords}
- Language: {language}

STRUCTURE:
1. What is {feature} and why it matters
2. Key aspects to evaluate
3. Top providers comparison
4. Detailed feature analysis
5. Pros and cons of each option
6. Selection criteria and recommendations
7. Implementation tips
8. Conclusion

SEO REQUIREMENTS:
- Target "{feature}" as primary keyword
- Include comparison keywords
- Use provider names
- Target keywords: {keywords}

Generate the comparison content now:`,
      variables: ['feature', 'targetAudience', 'keywords', 'language']
    };
  }

  /**
   * Get template key from request
   */
  private getTemplateKey(request: EnhancedContentGenerationRequest): string {
    const { type, context } = request;
    
    switch (type) {
      case 'page_content':
        if (context.category && context.country) {
          return 'category_country_page';
        } else if (context.category) {
          return 'category_page';
        } else if (context.country) {
          return 'country_page';
        }
        break;
      
      case 'meta_description':
        return 'meta_description';
      
      case 'article':
        if (context.strategy) {
          return 'strategy_guide';
        }
        break;
      
      case 'comparison':
        if (context.feature) {
          return 'feature_comparison';
        }
        break;
    }
    
    return '';
  }

  /**
   * Build prompt from template and request
   */
  private buildPrompt(
    template: any,
    request: EnhancedContentGenerationRequest,
    retryCount: number
  ): string {
    let prompt = template.prompt;
    
    // Replace variables in template
    template.variables.forEach(variable => {
      const value = this.getVariableValue(variable, request);
      prompt = prompt.replace(new RegExp(`{${variable}}`, 'g'), value);
    });
    
    // Add retry-specific instructions
    if (retryCount > 0) {
      prompt += `\n\nIMPORTANT: This is retry attempt ${retryCount + 1}. Please ensure the content is comprehensive, well-structured, and meets all requirements.`;
    }

    // Add SEO optimization instructions
    if (request.options?.optimizeForSEO) {
      prompt += `\n\nSEO OPTIMIZATION: Ensure natural keyword usage, proper heading structure, and meta-description friendly content.`;
    }
    
    // Add language instructions
    if (request.options?.language) {
      prompt += `\n\nLANGUAGE: Generate content in ${request.options.language}.`;
    }
    
    return prompt;
  }

  /**
   * Get variable value from request context
   */
  private getVariableValue(variable: string, request: EnhancedContentGenerationRequest): string {
    const { context } = request;
    
    switch (variable) {
      case 'category':
        return context.category || 'trading';
      case 'country':
        return context.country || 'global';
      case 'region':
        return this.getCountryRegion(context.country) || 'global';
      case 'currency':
        return this.getCountryCurrency(context.country) || 'USD';
      case 'regulatoryAuthority':
        return this.getCountryRegulator(context.country) || 'local authorities';
      case 'targetAudience':
        return context.targetAudience || 'traders of all levels';
      case 'keywords':
        return (context.keywords || []).join(', ');
      case 'pageType':
        return context.pageType || 'informational';
      case 'topic':
        return context.category || context.country || context.strategy || context.feature || 'trading';
      case 'strategy':
        return context.strategy || 'trading';
      case 'experienceLevel':
        return context.targetAudience?.includes('beginner') ? 'beginner' : 'intermediate';
      case 'tradingStyle':
        return context.strategy?.includes('day') ? 'day trading' : 'swing trading';
      case 'timeframes':
        return context.strategy?.includes('scalping') ? '1-5 minutes' : '4 hours - daily';
      case 'feature':
        return context.feature || 'trading features';
      case 'language':
        return request.options?.language || 'English';
      default:
        return '';
    }
  }

  /**
   * Process generated content
   */
  private async processGeneratedContent(
    generatedText: string,
    request: EnhancedContentGenerationRequest,
    template: any,
    generationTime: number
  ): Promise<Omit<EnhancedContentGenerationResult, 'validation' | 'metadata'>> {
    const wordCount = generatedText.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Calculate quality score
    const qualityScore = this.calculateQualityScore(generatedText, request, generationTime);
    
    const result: Omit<EnhancedContentGenerationResult, 'validation' | 'metadata'> = {
      content: generatedText,
      metadata: {
        wordCount,
        readingTime,
        qualityScore,
        generatedAt: new Date().toISOString(),
        model: process.env.GEMINI_MODEL || 'gemini-pro',
        tokensUsed: this.estimateTokenCount(generatedText),
        generationTime,
        retryCount: 0
      }
    };

    // Add structured data if requested
    if (request.options?.includeStructuredData) {
      result.structuredData = this.generateStructuredData(request, generatedText);
    }

    // Add FAQs if requested
    if (request.options?.includeFAQs) {
      result.faqs = await this.extractFAQs(generatedText, request);
    }

    // Add comparison if requested
    if (request.options?.includeComparison) {
      result.comparison = this.extractComparisonPoints(generatedText, request);
    }

    return result;
  }

  /**
   * Calculate quality score
   */
  private calculateQualityScore(
    content: string,
    request: EnhancedContentGenerationRequest,
    generationTime: number
  ): number {
    let score = 0.5; // Base score
    
    // Length appropriateness
    const wordCount = content.split(/\s+/).length;
    const targetLength = this.getTargetLength(request);
    if (wordCount >= targetLength * 0.8 && wordCount <= targetLength * 1.2) {
      score += 0.2;
    }
    
    // Structure indicators
    if (content.includes('\n\n')) score += 0.1; // Has paragraphs
    if (content.match(/\d+\./)) score += 0.1; // Has numbered lists
    if (content.match(/^#+\s/m)) score += 0.1; // Has headings
    
    // Content quality indicators
    if (content.toLowerCase().includes(request.context.keywords?.[0] || '')) score += 0.05;
    if (content.length > 500) score += 0.05; // Substantial content
    
    // Generation speed
    if (generationTime < 10000) score += 0.05; // Under 10 seconds
    
    return Math.min(score, 1.0);
  }

  /**
   * Get target word count
   */
  private getTargetLength(request: EnhancedContentGenerationRequest): number {
    const { type, options } = request;
    
    switch (type) {
      case 'meta_description':
        return 30; // ~150 characters
      case 'page_content':
        return options?.length === 'short' ? 600 : options?.length === 'long' ? 1500 : 1000;
      case 'article':
        return options?.length === 'short' ? 800 : options?.length === 'long' ? 2000 : 1500;
      case 'comparison':
        return 800;
      default:
        return 1000;
    }
  }

  /**
   * Estimate token count
   */
  private estimateTokenCount(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Generate structured data
   */
  private generateStructuredData(request: EnhancedContentGenerationRequest, content: string): Record<string, any> {
    const { context } = request;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: this.generateHeadline(request),
      description: this.extractDescription(content),
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name: 'Broker Analysis'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Broker Analysis'
      },
      ...(context.category && { about: context.category }),
      ...(context.country && { 
        spatialCoverage: {
          '@type': 'Country',
          name: context.country
        }
      })
    };
  }

  /**
   * Generate headline
   */
  private generateHeadline(request: EnhancedContentGenerationRequest): string {
    const { context } = request;
    
    if (context.category && context.country) {
      return `Best ${context.category} Brokers in ${context.country} 2025`;
    } else if (context.category) {
      return `Best ${context.category} Brokers 2025`;
    } else if (context.country) {
      return `Best Trading Brokers in ${context.country} 2025`;
    } else if (context.strategy) {
      return `${context.strategy} Trading Strategy Guide`;
    } else if (context.feature) {
      return `Brokers with ${context.feature} - Complete Guide`;
    }
    
    return 'Trading Broker Guide 2025';
  }

  /**
   * Extract description
   */
  private extractDescription(content: string): string {
    const sentences = content.split(/[.!?]+/);
    const firstTwoSentences = sentences.slice(0, 2).join('. ').trim();
    return firstTwoSentences.length > 160 ? firstTwoSentences.substring(0, 157) + '...' : firstTwoSentences;
  }

  /**
   * Extract FAQs
   */
  private async extractFAQs(content: string, request: EnhancedContentGenerationRequest): Promise<Array<{ question: string; answer: string }>> {
    const questionPattern = /(?:What|How|Why|When|Where|Which|Who)\s+[^?]*\?/gi;
    const questions = content.match(questionPattern) || [];
    
    const faqs: Array<{ question: string; answer: string }> = [];
    
    for (const question of questions.slice(0, 5)) {
      const startIndex = content.indexOf(question);
      if (startIndex !== -1) {
        const endIndex = content.indexOf('\n\n', startIndex);
        const answerSection = endIndex !== -1 ? 
          content.substring(startIndex + question.length, endIndex).trim() :
          content.substring(startIndex + question.length).split('\n')[0].trim();
        
        if (answerSection.length > 20) {
          faqs.push({
            question: question.trim(),
            answer: answerSection
          });
        }
      }
    }
    
    if (faqs.length === 0) {
      faqs.push(...this.generateGenericFAQs(request));
    }
    
    return faqs;
  }

  /**
   * Generate generic FAQs
   */
  private generateGenericFAQs(request: EnhancedContentGenerationRequest): Array<{ question: string; answer: string }> {
    const { context } = request;
    const faqs: Array<{ question: string; answer: string }> = [];
    
    if (context.category) {
      faqs.push({
        question: `What is ${context.category} trading?`,
        answer: `${context.category} trading involves speculating on price movements of ${context.category} instruments through various financial platforms.`
      });
    }
    
    if (context.country) {
      faqs.push({
        question: `Is trading regulated in ${context.country}?`,
        answer: `Yes, trading in ${context.country} is regulated by local financial authorities to ensure investor protection and market integrity.`
      });
    }
    
    faqs.push({
      question: 'How do I choose the right broker?',
      answer: 'Consider factors like regulation, fees, trading platforms, customer support, and available instruments when selecting a broker.'
    });
    
    return faqs;
  }

  /**
   * Extract comparison points
   */
  private extractComparisonPoints(content: string, request: EnhancedContentGenerationRequest): Array<{ feature: string; value: string }> {
    const comparisonPoints: Array<{ feature: string; value: string }> = [];
    const features = ['regulation', 'fees', 'platforms', 'support', 'instruments', 'leverage'];
    
    features.forEach(feature => {
      const regex = new RegExp(`${feature}[:\\s]*([^\\n]+)`, 'i');
      const match = content.match(regex);
      if (match) {
        comparisonPoints.push({
          feature: feature.charAt(0).toUpperCase() + feature.slice(1),
          value: match[1].trim()
        });
      }
    });
    
    return comparisonPoints;
  }

  /**
   * Helper methods
   */
  private getCountryRegion(country?: string): string | null {
    const regions: Record<string, string> = {
      'US': 'North America',
      'CA': 'North America',
      'GB': 'Europe',
      'DE': 'Europe',
      'FR': 'Europe',
      'IT': 'Europe',
      'ES': 'Europe',
      'AU': 'Oceania',
      'JP': 'Asia',
      'SG': 'Asia'
    };
    
    return country ? regions[country] || null : null;
  }

  private getCountryCurrency(country?: string): string | null {
    const currencies: Record<string, string> = {
      'US': 'USD',
      'CA': 'CAD',
      'GB': 'GBP',
      'EU': 'EUR',
      'DE': 'EUR',
      'FR': 'EUR',
      'IT': 'EUR',
      'ES': 'EUR',
      'AU': 'AUD',
      'JP': 'JPY',
      'SG': 'SGD'
    };
    
    return country ? currencies[country] || null : null;
  }

  private getCountryRegulator(country?: string): string | null {
    const regulators: Record<string, string> = {
      'US': 'SEC/CFTC',
      'CA': 'CIRO',
      'GB': 'FCA',
      'DE': 'BaFin',
      'FR': 'AMF',
      'IT': 'CONSOB',
      'ES': 'CNMV',
      'AU': 'ASIC',
      'JP': 'FSA',
      'SG': 'MAS'
    };
    
    return country ? regulators[country] || null : null;
  }

  private generateCacheKey(request: EnhancedContentGenerationRequest): string {
    const keyData = {
      type: request.type,
      context: request.context,
      options: request.options
    };
    
    return `enhanced-ai-content-${Buffer.from(JSON.stringify(keyData)).toString('base64')}`;
  }

  private generateCacheTags(request: EnhancedContentGenerationRequest): string[] {
    const tags = [`content-type:${request.type}`];
    
    if (request.context.category) {
      tags.push(`category:${request.context.category}`);
    }
    
    if (request.context.country) {
      tags.push(`country:${request.context.country}`);
    }
    
    if (request.context.strategy) {
      tags.push(`strategy:${request.context.strategy}`);
    }
    
    if (request.context.feature) {
      tags.push(`feature:${request.context.feature}`);
    }
    
    return tags;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private timeout(ms: number): Promise<never> {
    return new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    );
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; model: string; apiKeyConfigured: boolean }> {
    try {
      const testResult = await this.model.generateContent('Hello');
      return {
        status: 'healthy',
        model: process.env.GEMINI_MODEL || 'gemini-pro',
        apiKeyConfigured: !!process.env.GEMINI_API_KEY
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        model: process.env.GEMINI_MODEL || 'gemini-pro',
        apiKeyConfigured: !!process.env.GEMINI_API_KEY
      };
    }
  }
}

// Export singleton instance
export const enhancedAIContentGenerator = new EnhancedAIContentGenerator();
export default enhancedAIContentGenerator;
```

## 3. Content Generation Queue Service

### File: `services/content/contentGenerationQueueService.ts`

```typescript
/**
 * Content Generation Queue Service
 * 
 * Manages queued content generation tasks with
 * priority handling and batch processing
 */

interface QueueTask {
  id: string;
  type: 'page_content' | 'meta_description' | 'article' | 'comparison' | 'faq';
  context: any;
  options?: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  scheduledAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

interface QueueStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  avgProcessingTime: number;
}

export class ContentGenerationQueueService {
  private queue: QueueTask[] = [];
  private processing = false;
  private batchSize = 5;
  private processingInterval = 5000; // 5 seconds
  private maxConcurrent = 3;

  constructor() {
    this.startProcessing();
  }

  /**
   * Add task to queue
   */
  async addTask(
    type: QueueTask['type'],
    context: any,
    options?: any,
    priority: QueueTask['priority'] = 'medium'
  ): Promise<string> {
    const task: QueueTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      context,
      options,
      priority,
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date(),
      scheduledAt: new Date(),
      status: 'pending'
    };

    this.queue.push(task);
    this.sortQueue();

    return task.id;
  }

  /**
   * Add batch tasks
   */
  async addBatchTasks(tasks: Array<{
    type: QueueTask['type'];
    context: any;
    options?: any;
    priority?: QueueTask['priority'];
  }>): Promise<string[]> {
    const taskIds: string[] = [];
    
    for (const taskData of tasks) {
      const taskId = await this.addTask(
        taskData.type,
        taskData.context,
        taskData.options,
        taskData.priority || 'medium'
      );
      taskIds.push(taskId);
    }

    return taskIds;
  }

  /**
   * Get queue statistics
   */
  getStats(): QueueStats {
    const stats: QueueStats = {
      total: this.queue.length,
      pending: this.queue.filter(t => t.status === 'pending').length,
      processing: this.queue.filter(t => t.status === 'processing').length,
      completed: this.queue.filter(t => t.status === 'completed').length,
      failed: this.queue.filter(t => t.status === 'failed').length,
      avgProcessingTime: 0
    };

    // Calculate average processing time
    const completedTasks = this.queue.filter(t => t.status === 'completed');
    if (completedTasks.length > 0) {
      const totalTime = completedTasks.reduce((sum, task) => {
        // This would be calculated based on actual processing time
        return sum + 5000; // 5 seconds average
      }, 0);
      stats.avgProcessingTime = totalTime / completedTasks.length;
    }

    return stats;
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId: string): QueueTask | null {
    return this.queue.find(task => task.id === taskId) || null;
  }

  /**
   * Cancel task
   */
  cancelTask(taskId: string): boolean {
    const index = this.queue.findIndex(task => task.id === taskId);
    if (index !== -1 && this.queue[index].status === 'pending') {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Retry failed task
   */
  async retryTask(taskId: string): Promise<boolean> {
    const task = this.queue.find(t => t.id === taskId);
    if (task && task.status === 'failed') {
      task.status = 'pending';
      task.attempts = 0;
      task.scheduledAt = new Date();
      task.error = undefined;
      this.sortQueue();
      return true;
    }
    return false;
  }

  /**
   * Clear completed tasks
   */
  clearCompleted(): number {
    const initialLength = this.queue.length;
    this.queue = this.queue.filter(task => task.status !== 'completed');
    return initialLength - this.queue.length;
  }

  /**
   * Start processing queue
   */
  private startProcessing(): void {
    setInterval(async () => {
      if (!this.processing) {
        await this.processQueue();
      }
    }, this.processingInterval);
  }

  /**
   * Process queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing) return;

    this.processing = true;

    try {
      const pendingTasks = this.queue
        .filter(task => task.status === 'pending')
        .filter(task => task.scheduledAt <= new Date())
        .slice(0, this.batchSize);

      if (pendingTasks.length === 0) {
        return;
      }

      // Process tasks concurrently
      const promises = pendingTasks.map(task => this.processTask(task));
      await Promise.allSettled(promises);

    } catch (error) {
      console.error('Queue processing error:', error);
    } finally {
      this.processing = false;
    }
  }

  /**
   * Process individual task
   */
  private async processTask(task: QueueTask): Promise<void> {
    task.status = 'processing';
    task.attempts++;

    try {
      // Import here to avoid circular dependencies
      const { enhancedAIContentGenerator } = await import('./enhancedAIContentGenerator');
      
      const result = await enhancedAIContentGenerator.generateContent({
        type: task.type,
        context: task.context,
        options: task.options
      });

      task.status = 'completed';
      task.result = result;

    } catch (error) {
      console.error(`Task ${task.id} failed:`, error);
      
      if (task.attempts >= task.maxAttempts) {
        task.status = 'failed';
        task.error = error instanceof Error ? error.message : 'Unknown error';
      } else {
        // Retry with exponential backoff
        task.status = 'pending';
        task.scheduledAt = new Date(Date.now() + Math.pow(2, task.attempts) * 1000);
      }
    }
  }

  /**
   * Sort queue by priority and scheduled time
   */
  private sortQueue(): void {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    
    this.queue.sort((a, b) => {
      // First by priority
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by scheduled time
      return a.scheduledAt.getTime() - b.scheduledAt.getTime();
    });
  }
}

// Export singleton instance
export const contentGenerationQueueService = new ContentGenerationQueueService();
export default contentGenerationQueueService;
```

## Implementation Steps

1. **Set up Gemini API key** in environment variables
2. **Install required dependencies**:
   ```bash
   npm install @google/generative-ai
   ```
3. **Implement the enhanced content generator**
4. **Set up the content generation queue**
5. **Configure rate limiting and caching**
6. **Test content generation**
7. **Monitor performance and quality**

## Testing the Setup

### Test API Connection

```javascript
// test-gemini-api.js
const { enhancedAIContentGenerator } = require('./services/content/enhancedAIContentGenerator');

async function testAPI() {
  try {
    const result = await enhancedAIContentGenerator.generateContent({
      type: 'page_content',
      context: {
        pageType: 'category',
        category: 'forex',
        country: 'US',
        targetAudience: 'beginners',
        keywords: ['forex trading', 'brokers', 'USD']
      },
      options: {
        includeStructuredData: true,
        includeFAQs: true,
        optimizeForSEO: true
      }
    });

    console.log('Generated content:', result.content.substring(0, 200) + '...');
    console.log('Quality score:', result.metadata.qualityScore);
    console.log('Word count:', result.metadata.wordCount);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAPI();
```

## Configuration Best Practices

1. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **Rate Limiting**
   - Monitor API usage
   - Implement exponential backoff
   - Cache responses appropriately

3. **Content Quality**
   - Set appropriate quality thresholds
   - Validate generated content
   - Monitor quality scores

4. **Performance Optimization**
   - Use queue for batch processing
   - Implement caching
   - Monitor generation times

This enhanced AI content generation system will provide high-quality, SEO-optimized content for the programmatic SEO system with robust error handling and performance optimization.