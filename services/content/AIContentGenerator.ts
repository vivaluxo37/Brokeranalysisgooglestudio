/**
 * AI Content Generator Service
 * 
 * This service handles AI-powered content generation for programmatic SEO pages.
 * It uses the Gemini API to generate high-quality, context-aware content with
 * proper caching and rate limiting.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { contentCache } from '../cache/contentCache';
import { rateLimiter } from '../utils/rateLimiter';

// Types for content generation
export interface ContentGenerationRequest {
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
  };
}

export interface ContentGenerationResult {
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
  };
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: ContentGenerationRequest['type'];
  prompt: string;
  variables: string[];
  examples?: Array<{
    input: Record<string, any>;
    output: string;
  }>;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Content templates for different page types
const CONTENT_TEMPLATES: Record<string, ContentTemplate> = {
  'category_page': {
    id: 'category_page',
    name: 'Category Page Content',
    type: 'page_content',
    prompt: `Generate comprehensive content for a {category} trading category page targeting {country} traders.

Requirements:
- Professional yet accessible tone
- 800-1200 words
- Include key benefits and considerations
- Mention top regulatory requirements
- Highlight important features to look for
- Include practical tips for beginners
- Add comparison points for broker selection
- End with clear call-to-action

Context:
- Category: {category}
- Country: {country}
- Target Audience: {targetAudience}
- Keywords: {keywords}

Structure:
1. Introduction to {category} trading
2. Benefits of {category} trading in {country}
3. Regulatory considerations
4. How to choose the best {category} broker
5. Key features and tools
6. Getting started guide
7. Conclusion

Generate the content now:`,
    variables: ['category', 'country', 'targetAudience', 'keywords']
  },

  'country_page': {
    id: 'country_page',
    name: 'Country Page Content',
    type: 'page_content',
    prompt: `Create comprehensive content for trading brokers in {country}.

Requirements:
- Professional and informative tone
- 1000-1500 words
- Cover regulatory landscape
- Include tax considerations
- Mention popular trading instruments
- Highlight local market specifics
- Include broker selection criteria
- Add practical guidance

Context:
- Country: {country}
- Region: {region}
- Currency: {currency}
- Regulatory Authority: {regulatoryAuthority}
- Target Audience: {targetAudience}
- Keywords: {keywords}

Structure:
1. Trading landscape in {country}
2. Regulatory framework and investor protection
3. Tax implications for traders
4. Popular trading instruments and markets
5. How to choose a broker in {country}
6. Local trading considerations
7. Recommended broker features
8. Getting started guide

Generate the content now:`,
    variables: ['country', 'region', 'currency', 'regulatoryAuthority', 'targetAudience', 'keywords']
  },

  'category_country_page': {
    id: 'category_country_page',
    name: 'Category-Country Page Content',
    type: 'page_content',
    prompt: `Generate specialized content for {category} trading in {country}.

Requirements:
- Highly targeted and specific content
- 900-1300 words
- Combine category expertise with local market knowledge
- Include country-specific regulations for {category}
- Mention local broker options
- Highlight unique opportunities
- Provide actionable advice

Context:
- Category: {category}
- Country: {country}
- Region: {region}
- Currency: {currency}
- Target Audience: {targetAudience}
- Keywords: {keywords}

Structure:
1. {category} trading opportunities in {country}
2. Regulatory requirements for {category} trading
3. Market specifics and trading hours
4. Top {category} brokers serving {country}
5. Platform and tool recommendations
6. Risk management strategies
7. Tax considerations for {category} traders
8. Getting started checklist

Generate the content now:`,
    variables: ['category', 'country', 'region', 'currency', 'targetAudience', 'keywords']
  },

  'meta_description': {
    id: 'meta_description',
    name: 'Meta Description',
    type: 'meta_description',
    prompt: `Create a compelling meta description (150-160 characters) for a {pageType} page about {topic} targeting {country}.

Requirements:
- Include primary keyword naturally
- Compelling and clickable
- Clear value proposition
- Call-to-action oriented
- Under 160 characters

Context:
- Page Type: {pageType}
- Topic: {topic}
- Country: {country}
- Keywords: {keywords}

Generate the meta description:`,
    variables: ['pageType', 'topic', 'country', 'keywords']
  },

  'strategy_guide': {
    id: 'strategy_guide',
    name: 'Strategy Guide Content',
    type: 'article',
    prompt: `Create a comprehensive guide for {strategy} trading strategy.

Requirements:
- Educational and practical tone
- 1200-1800 words
- Step-by-step instructions
- Include examples and case studies
- Risk management section
- Tool and indicator recommendations
- Common mistakes to avoid

Context:
- Strategy: {strategy}
- Experience Level: {experienceLevel}
- Trading Style: {tradingStyle}
- Timeframes: {timeframes}
- Target Audience: {targetAudience}
- Keywords: {keywords}

Structure:
1. What is {strategy} trading?
2. How {strategy} strategy works
3. Required tools and indicators
4. Step-by-step implementation
5. Risk management techniques
6. Examples and case studies
7. Common mistakes and how to avoid them
8. Tips for success
9. Conclusion

Generate the comprehensive guide now:`,
    variables: ['strategy', 'experienceLevel', 'tradingStyle', 'timeframes', 'targetAudience', 'keywords']
  },

  'feature_comparison': {
    id: 'feature_comparison',
    name: 'Feature Comparison Content',
    type: 'comparison',
    prompt: `Create detailed comparison content for brokers offering {feature}.

Requirements:
- Comparative and analytical tone
- 800-1200 words
- Feature-by-feature analysis
- Include pros and cons
- Provider recommendations
- Selection criteria

Context:
- Feature: {feature}
- Target Audience: {targetAudience}
- Keywords: {keywords}

Structure:
1. What is {feature} and why it matters
2. Key aspects to evaluate
3. Top providers comparison
4. Detailed feature analysis
5. Pros and cons of each option
6. Selection criteria and recommendations
7. Implementation tips
8. Conclusion

Generate the comparison content now:`,
    variables: ['feature', 'targetAudience', 'keywords']
  }
};

/**
 * AI Content Generator Service
 */
export class AIContentGenerator {
  private model: any;
  private cacheEnabled: boolean = true;
  private rateLimitEnabled: boolean = true;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * Generate content based on request
   */
  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResult> {
    try {
      // Check cache first
      if (this.cacheEnabled) {
        const cachedResult = await this.getCachedContent(request);
        if (cachedResult) {
          return cachedResult;
        }
      }

      // Apply rate limiting
      if (this.rateLimitEnabled) {
        await rateLimiter.checkLimit('ai-content-generation');
      }

      // Get appropriate template
      const template = this.getTemplate(request);
      if (!template) {
        throw new Error(`No template found for content type: ${request.type}`);
      }

      // Build prompt from template
      const prompt = this.buildPrompt(template, request);

      // Generate content with Gemini
      const startTime = Date.now();
      const result = await this.model.generateContent(prompt);
      const generatedText = result.response.text();
      const generationTime = Date.now() - startTime;

      // Process and structure the generated content
      const processedResult = await this.processGeneratedContent(
        generatedText,
        request,
        template,
        generationTime
      );

      // Cache the result
      if (this.cacheEnabled) {
        await this.cacheContent(request, processedResult);
      }

      return processedResult;

    } catch (error) {
      console.error('Error generating AI content:', error);
      throw new Error(`Content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get cached content if available
   */
  private async getCachedContent(request: ContentGenerationRequest): Promise<ContentGenerationResult | null> {
    try {
      const cacheKey = this.generateCacheKey(request);
      const cached = await contentCache.get(cacheKey);
      
      if (cached && !this.isCacheExpired(cached)) {
        return cached.content;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cached content:', error);
      return null;
    }
  }

  /**
   * Cache generated content
   */
  private async cacheContent(request: ContentGenerationRequest, result: ContentGenerationResult): Promise<void> {
    try {
      const cacheKey = this.generateCacheKey(request);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      await contentCache.set(cacheKey, {
        content: result,
        request,
        cachedAt: new Date(),
        expiresAt
      });
    } catch (error) {
      console.error('Error caching content:', error);
    }
  }

  /**
   * Generate cache key from request
   */
  private generateCacheKey(request: ContentGenerationRequest): string {
    const keyData = {
      type: request.type,
      context: request.context,
      options: request.options
    };
    
    return `ai-content-${Buffer.from(JSON.stringify(keyData)).toString('base64')}`;
  }

  /**
   * Check if cache is expired
   */
  private isCacheExpired(cached: any): boolean {
    return cached.expiresAt && new Date() > new Date(cached.expiresAt);
  }

  /**
   * Get appropriate template for request
   */
  private getTemplate(request: ContentGenerationRequest): ContentTemplate | null {
    const templateKey = this.getTemplateKey(request);
    return CONTENT_TEMPLATES[templateKey] || null;
  }

  /**
   * Get template key from request
   */
  private getTemplateKey(request: ContentGenerationRequest): string {
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
  private buildPrompt(template: ContentTemplate, request: ContentGenerationRequest): string {
    let prompt = template.prompt;
    
    // Replace variables in template
    template.variables.forEach(variable => {
      const value = this.getVariableValue(variable, request);
      prompt = prompt.replace(new RegExp(`{${variable}}`, 'g'), value);
    });
    
    // Add any additional instructions from options
    if (request.options) {
      if (request.options.maxTokens) {
        prompt += `\n\nMaximum tokens: ${request.options.maxTokens}`;
      }
      if (request.options.temperature) {
        prompt += `\n\nTemperature: ${request.options.temperature}`;
      }
    }
    
    return prompt;
  }

  /**
   * Get variable value from request context
   */
  private getVariableValue(variable: string, request: ContentGenerationRequest): string {
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
      default:
        return '';
    }
  }

  /**
   * Get country region
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

  /**
   * Get country currency
   */
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

  /**
   * Get country regulator
   */
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

  /**
   * Process generated content and add metadata
   */
  private async processGeneratedContent(
    generatedText: string,
    request: ContentGenerationRequest,
    template: ContentTemplate,
    generationTime: number
  ): Promise<ContentGenerationResult> {
    const wordCount = generatedText.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed
    
    // Calculate quality score based on various factors
    const qualityScore = this.calculateQualityScore(generatedText, request, generationTime);
    
    const result: ContentGenerationResult = {
      content: generatedText,
      metadata: {
        wordCount,
        readingTime,
        qualityScore,
        generatedAt: new Date().toISOString(),
        model: 'gemini-pro'
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
   * Calculate quality score for generated content
   */
  private calculateQualityScore(
    content: string,
    request: ContentGenerationRequest,
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
    
    // Content quality indicators
    if (content.toLowerCase().includes(request.context.keywords?.[0] || '')) score += 0.05;
    if (content.length > 500) score += 0.05; // Substantial content
    
    // Generation speed (faster is better up to a point)
    if (generationTime < 10000) score += 0.05; // Under 10 seconds
    
    return Math.min(score, 1.0);
  }

  /**
   * Get target word count based on request
   */
  private getTargetLength(request: ContentGenerationRequest): number {
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
   * Generate structured data for SEO
   */
  private generateStructuredData(request: ContentGenerationRequest, content: string): Record<string, any> {
    const { context } = request;
    
    const baseStructuredData: Record<string, any> = {
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
      }
    };

    // Add specific structured data based on page type
    if (context.category) {
      baseStructuredData.about = context.category;
    }
    
    if (context.country) {
      baseStructuredData.spatialCoverage = {
        '@type': 'Country',
        name: context.country
      };
    }

    return baseStructuredData;
  }

  /**
   * Generate headline from request
   */
  private generateHeadline(request: ContentGenerationRequest): string {
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
   * Extract description from content
   */
  private extractDescription(content: string): string {
    const sentences = content.split(/[.!?]+/);
    const firstTwoSentences = sentences.slice(0, 2).join('. ').trim();
    return firstTwoSentences.length > 160 ? firstTwoSentences.substring(0, 157) + '...' : firstTwoSentences;
  }

  /**
   * Extract FAQs from generated content
   */
  private async extractFAQs(content: string, request: ContentGenerationRequest): Promise<Array<{ question: string; answer: string }>> {
    // Look for question patterns in the content
    const questionPattern = /(?:What|How|Why|When|Where|Which|Who)\s+[^?]*\?/gi;
    const questions = content.match(questionPattern) || [];
    
    // Generate structured FAQs
    const faqs: Array<{ question: string; answer: string }> = [];
    
    for (const question of questions.slice(0, 5)) { // Limit to 5 FAQs
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
    
    // If no FAQs found, generate generic ones
    if (faqs.length === 0) {
      faqs.push(...this.generateGenericFAQs(request));
    }
    
    return faqs;
  }

  /**
   * Generate generic FAQs based on context
   */
  private generateGenericFAQs(request: ContentGenerationRequest): Array<{ question: string; answer: string }> {
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
   * Extract comparison points from content
   */
  private extractComparisonPoints(content: string, request: ContentGenerationRequest): Array<{ feature: string; value: string }> {
    // Look for comparison patterns
    const comparisonPoints: Array<{ feature: string; value: string }> = [];
    
    // Common features to look for
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
   * Enable/disable caching
   */
  setCacheEnabled(enabled: boolean): void {
    this.cacheEnabled = enabled;
  }

  /**
   * Enable/disable rate limiting
   */
  setRateLimitEnabled(enabled: boolean): void {
    this.rateLimitEnabled = enabled;
  }
}

// Export singleton instance
export const aiContentGenerator = new AIContentGenerator();
export default aiContentGenerator;