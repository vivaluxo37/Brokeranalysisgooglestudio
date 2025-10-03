/**
 * SEO-Optimized Content Generation Engine
 * Generates high-quality, SEO-optimized content for programmatic directory pages
 * Integrates with caching system and structured data generation
 */

import { Broker } from '../types';
import { SEOPageConfig } from '../data/seoPageConfigs';
import { CountryConfig } from '../lib/constants/countries';
import { programmaticCache } from './programmaticCache';
import { performanceMonitoring } from './performanceMonitoring';

// Content interfaces
export interface GeneratedContent {
  mainContent: ContentSection[];
  seoContent: SEOContent;
  metadata: ContentMetadata;
  readabilityScore: number;
  wordCount: number;
  keywordDensity: Record<string, number>;
}

export interface ContentSection {
  id: string;
  type: 'hero' | 'intro' | 'comparison' | 'features' | 'faq' | 'conclusion';
  title: string;
  content: string;
  html: string;
  keywords: string[];
  order: number;
}

export interface SEOContent {
  headings: {
    h1: string;
    h2: string[];
    h3: string[];
  };
  keywordVariations: string[];
  internalLinks: InternalLink[];
  externalLinks: ExternalLink[];
  callsToAction: CallToAction[];
}

export interface ContentMetadata {
  generatedAt: string;
  pageType: 'category' | 'country' | 'seo';
  targetKeywords: string[];
  brokerCount: number;
  contentVersion: string;
  lastUpdated: string;
  quality: {
    seoScore: number;
    readabilityScore: number;
    keywordOptimization: number;
    contentDepth: number;
  };
}

export interface InternalLink {
  text: string;
  url: string;
  context: string;
  relevance: number;
}

export interface ExternalLink {
  text: string;
  url: string;
  context: string;
  rel: 'nofollow' | 'sponsored' | 'ugc' | '';
}

export interface CallToAction {
  text: string;
  type: 'primary' | 'secondary';
  context: string;
  placement: 'inline' | 'section-end' | 'content-end';
}

// Content generation configuration
interface ContentGenerationConfig {
  targetWordCount: {
    category: { min: 1500, max: 3000, optimal: 2000 };
    country: { min: 1200, max: 2500, optimal: 1800 };
    seo: { min: 1000, max: 2000, optimal: 1400 };
  };
  keywordDensity: {
    primary: { min: 1.0, max: 2.5, optimal: 1.8 };
    secondary: { min: 0.5, max: 1.5, optimal: 1.0 };
    related: { min: 0.3, max: 1.0, optimal: 0.6 };
  };
  readabilityTarget: {
    min: 60;
    max: 80;
    optimal: 70;
  };
  structureRules: {
    maxSentenceLength: 25;
    maxParagraphLength: 150;
    minHeadingDistance: 200;
  };
}

class ContentGeneratorService {
  private config: ContentGenerationConfig;
  private contentCache = new Map<string, GeneratedContent>();
  private templateLibrary = new Map<string, string>();

  constructor() {
    this.config = {
      targetWordCount: {
        category: { min: 1500, max: 3000, optimal: 2000 },
        country: { min: 1200, max: 2500, optimal: 1800 },
        seo: { min: 1000, max: 2000, optimal: 1400 }
      },
      keywordDensity: {
        primary: { min: 1.0, max: 2.5, optimal: 1.8 },
        secondary: { min: 0.5, max: 1.5, optimal: 1.0 },
        related: { min: 0.3, max: 1.0, optimal: 0.6 }
      },
      readabilityTarget: {
        min: 60,
        max: 80,
        optimal: 70
      },
      structureRules: {
        maxSentenceLength: 25,
        maxParagraphLength: 150,
        minHeadingDistance: 200
      }
    };

    this.initializeTemplateLibrary();
  }

  /**
   * Generate complete SEO-optimized content for programmatic pages
   */
  async generateOptimizedContent(
    pageType: 'category' | 'country' | 'seo',
    pageSlug: string,
    brokers: Broker[],
    config: SEOPageConfig | CountryConfig,
    additionalContext?: any
  ): Promise<GeneratedContent> {
    const cacheKey = `content:${pageType}:${pageSlug}`;
    const startTime = Date.now();

    // Try cache first
    try {
      const cached = await programmaticCache.get('content', pageSlug);
      if (cached) {
        performanceMonitoring.trackCacheAccess(cacheKey, true, Date.now() - startTime);
        return cached;
      }
    } catch (error) {
      console.warn('Failed to get content from cache:', error);
    }

    // Generate new content
    const generatedContent = await this.createContent(pageType, pageSlug, brokers, config, additionalContext);
    
    // Optimize content for SEO
    const optimizedContent = this.optimizeContentForSEO(generatedContent, pageType, brokers);
    
    // Cache the results
    try {
      await programmaticCache.set('content', pageSlug, optimizedContent, {
        dependencies: [`brokers:all`],
        version: '1.0'
      });
    } catch (error) {
      console.warn('Failed to cache content:', error);
    }

    performanceMonitoring.trackCacheAccess(cacheKey, false, Date.now() - startTime);
    return optimizedContent;
  }

  /**
   * Create content based on page type and configuration
   */
  private async createContent(
    pageType: 'category' | 'country' | 'seo',
    pageSlug: string,
    brokers: Broker[],
    config: SEOPageConfig | CountryConfig,
    additionalContext?: any
  ): Promise<GeneratedContent> {
    switch (pageType) {
      case 'category':
        return this.generateCategoryContent(pageSlug, config as SEOPageConfig, brokers);
      case 'country':
        return this.generateCountryContent(pageSlug, config as CountryConfig, brokers);
      case 'seo':
        return this.generateSEOContent(pageSlug, config as SEOPageConfig, brokers);
      default:
        throw new Error(`Unknown page type: ${pageType}`);
    }
  }

  /**
   * Generate content for category pages
   */
  private generateCategoryContent(
    pageSlug: string,
    config: SEOPageConfig,
    brokers: Broker[]
  ): GeneratedContent {
    const targetKeywords = [
      config.title.toLowerCase(),
      ...config.highlights.map(h => h.toLowerCase()),
      'forex broker',
      'trading platform'
    ];

    const sections: ContentSection[] = [];

    // 1. Hero Section
    sections.push(this.createHeroSection(config, brokers, targetKeywords));

    // 2. Introduction Section
    sections.push(this.createIntroSection(config, brokers, targetKeywords));

    // 3. Comparison Section
    sections.push(this.createComparisonSection(config, brokers, targetKeywords));

    // 4. Features Section
    sections.push(this.createFeaturesSection(config, brokers, targetKeywords));

    // 5. FAQ Section
    sections.push(this.createFAQSection(config, brokers, targetKeywords, 'category'));

    // 6. Conclusion Section
    sections.push(this.createConclusionSection(config, brokers, targetKeywords));

    return this.assembleContent(sections, targetKeywords, 'category', brokers.length);
  }

  /**
   * Generate content for country pages
   */
  private generateCountryContent(
    pageSlug: string,
    config: CountryConfig,
    brokers: Broker[]
  ): GeneratedContent {
    const countryName = config.name;
    const targetKeywords = [
      `${countryName.toLowerCase()} forex brokers`,
      `forex trading ${countryName.toLowerCase()}`,
      'regulated brokers',
      'currency trading'
    ];

    const sections: ContentSection[] = [];

    // 1. Hero Section for Country
    sections.push(this.createCountryHeroSection(config, brokers, targetKeywords));

    // 2. Regulation Overview
    sections.push(this.createRegulationSection(config, brokers, targetKeywords));

    // 3. Top Brokers Comparison
    sections.push(this.createCountryComparisonSection(config, brokers, targetKeywords));

    // 4. Trading Conditions
    sections.push(this.createTradingConditionsSection(config, brokers, targetKeywords));

    // 5. FAQ Section
    sections.push(this.createFAQSection(config, brokers, targetKeywords, 'country'));

    // 6. Conclusion
    sections.push(this.createCountryConclusionSection(config, brokers, targetKeywords));

    return this.assembleContent(sections, targetKeywords, 'country', brokers.length);
  }

  /**
   * Generate content for SEO pages
   */
  private generateSEOContent(
    pageSlug: string,
    config: SEOPageConfig,
    brokers: Broker[]
  ): GeneratedContent {
    const targetKeywords = [
      config.title.toLowerCase(),
      ...config.highlights.map(h => h.toLowerCase()),
      pageSlug.replace(/-/g, ' ')
    ];

    const sections: ContentSection[] = [];

    // 1. SEO Page Hero
    sections.push(this.createSEOHeroSection(config, brokers, targetKeywords));

    // 2. Detailed Analysis
    sections.push(this.createAnalysisSection(config, brokers, targetKeywords));

    // 3. Broker Reviews (if applicable)
    if (brokers.length > 0) {
      sections.push(this.createReviewsSection(config, brokers, targetKeywords));
    }

    // 4. Educational Content
    sections.push(this.createEducationalSection(config, brokers, targetKeywords));

    // 5. FAQ Section
    sections.push(this.createFAQSection(config, brokers, targetKeywords, 'seo'));

    // 6. Conclusion
    sections.push(this.createSEOConclusionSection(config, brokers, targetKeywords));

    return this.assembleContent(sections, targetKeywords, 'seo', brokers.length);
  }

  /**
   * Create individual content sections
   */
  private createHeroSection(
    config: SEOPageConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const topBrokers = brokers.slice(0, 3).map(b => b.name).join(', ');
    const content = `
      Looking for the ${config.title.toLowerCase()}? Our comprehensive analysis covers ${brokers.length} leading forex brokers 
      specializing in ${config.highlights.slice(0, 2).join(' and ')}. Compare ${topBrokers} and other top-rated brokers 
      to find the perfect trading platform for your needs.

      ${config.description} Our expert team has evaluated each broker based on regulation, trading conditions, 
      platform features, and customer support to bring you this definitive comparison guide.
    `.trim();

    return {
      id: 'hero',
      type: 'hero',
      title: config.title,
      content: content,
      html: this.formatAsHTML(content, 'hero'),
      keywords: keywords.slice(0, 5),
      order: 1
    };
  }

  private createIntroSection(
    config: SEOPageConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const avgSpread = brokers.length > 0 
      ? (brokers.reduce((sum, b) => sum + (b.tradingConditions?.spreads?.eurusd || 1.5), 0) / brokers.length).toFixed(1)
      : '1.2';
    
    const regulatedCount = brokers.filter(b => b.regulation?.regulators?.length > 0).length;

    const content = `
      ## What Makes the ${config.title}?

      When selecting from the ${config.title.toLowerCase()}, several key factors set the leaders apart from the competition. 
      Our analysis of ${brokers.length} brokers reveals that the top performers excel in ${config.highlights[0]}, 
      ${config.highlights[1]}, and overall trading conditions.

      ### Key Statistics:
      - **${regulatedCount}** fully regulated brokers
      - Average spreads starting from **${avgSpread} pips** on major pairs  
      - **${brokers.filter(b => b.platforms?.mt4 || b.platforms?.mt5).length}** brokers offering MetaTrader platforms
      - Minimum deposits ranging from **$${Math.min(...brokers.map(b => b.accessibility?.minDeposit || 100))}** to **$${Math.max(...brokers.map(b => b.accessibility?.minDeposit || 500))}**

      The forex trading landscape is highly competitive, and choosing the right broker can significantly impact your trading success. 
      ${config.highlights[2] || 'Professional execution'} and ${config.highlights[3] || 'competitive spreads'} are essential features 
      that serious traders demand from their chosen platform.
    `.trim();

    return {
      id: 'intro',
      type: 'intro',
      title: `What Makes the ${config.title}?`,
      content: content,
      html: this.formatAsHTML(content, 'intro'),
      keywords: keywords.slice(0, 8),
      order: 2
    };
  }

  private createComparisonSection(
    config: SEOPageConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const topBrokers = brokers.slice(0, 5);
    
    let comparisonTable = `
      ## Top ${config.title} Comparison

      Here's our detailed comparison of the leading ${config.title.toLowerCase()}:

      | Broker | Min Deposit | Spreads | Regulation | Platform |
      |--------|-------------|---------|------------|----------|
    `;

    topBrokers.forEach(broker => {
      const minDeposit = broker.accessibility?.minDeposit || 'N/A';
      const spread = broker.tradingConditions?.spreads?.eurusd || 'N/A';
      const regulation = broker.regulation?.regulators?.[0] || 'N/A';
      const platform = broker.platforms?.mt4 ? 'MT4' : broker.platforms?.mt5 ? 'MT5' : 'Proprietary';
      
      comparisonTable += `| ${broker.name} | $${minDeposit} | ${spread} pips | ${regulation} | ${platform} |\n`;
    });

    const content = `
      ${comparisonTable}

      ### Detailed Analysis

      Each broker in our ${config.title.toLowerCase()} comparison has been carefully evaluated based on multiple criteria. 
      **${topBrokers[0]?.name || 'The leading broker'}** stands out for its ${config.highlights[0]}, while 
      **${topBrokers[1]?.name || 'another top choice'}** excels in ${config.highlights[1]}.

      When comparing ${config.title.toLowerCase()}, consider these essential factors:
      - **Regulatory compliance** and investor protection measures
      - **Trading costs** including spreads, commissions, and overnight fees
      - **Platform reliability** and available trading tools
      - **Customer support** quality and availability
      - **Deposit and withdrawal** methods and processing times

      The ${config.title.toLowerCase()} in our comparison offer competitive advantages in different areas, 
      allowing traders to choose based on their specific requirements and trading style.
    `.trim();

    return {
      id: 'comparison',
      type: 'comparison',
      title: `Top ${config.title} Comparison`,
      content: content,
      html: this.formatAsHTML(content, 'comparison'),
      keywords: keywords,
      order: 3
    };
  }

  private createFeaturesSection(
    config: SEOPageConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const features = config.highlights.slice(0, 4);
    
    const content = `
      ## Essential Features of ${config.title}

      The ${config.title.toLowerCase()} share several common characteristics that set them apart in the competitive forex market:

      ### ${features[0] || 'Advanced Trading Technology'}
      Modern forex trading demands sophisticated technology and reliable execution. The top brokers in our ${config.title.toLowerCase()} 
      comparison utilize cutting-edge infrastructure to ensure fast order execution and minimal slippage during volatile market conditions.

      ### ${features[1] || 'Comprehensive Market Access'}  
      Access to a wide range of trading instruments is crucial for portfolio diversification. Leading brokers offer major and minor 
      currency pairs, commodities, indices, and cryptocurrencies through a single trading account.

      ### ${features[2] || 'Professional Support'}
      Quality customer support can make the difference between a successful trading experience and frustration. The ${config.title.toLowerCase()} 
      provide multilingual support teams available during market hours to assist with technical issues and trading queries.

      ### ${features[3] || 'Educational Resources'}
      Continuous learning is essential for trading success. Top brokers offer comprehensive educational materials, market analysis, 
      and trading signals to help both beginners and experienced traders improve their performance.

      These features combine to create a trading environment where both retail and institutional traders can execute their strategies 
      effectively while maintaining confidence in their chosen broker's reliability and professionalism.
    `.trim();

    return {
      id: 'features',
      type: 'features',
      title: `Essential Features of ${config.title}`,
      content: content,
      html: this.formatAsHTML(content, 'features'),
      keywords: keywords.slice(0, 6),
      order: 4
    };
  }

  private createFAQSection(
    config: SEOPageConfig | CountryConfig,
    brokers: Broker[],
    keywords: string[],
    pageType: string
  ): ContentSection {
    const faqs = this.generateFAQs(config, brokers, pageType);
    
    let content = `## Frequently Asked Questions\n\n`;
    
    faqs.forEach(faq => {
      content += `### ${faq.question}\n\n${faq.answer}\n\n`;
    });

    return {
      id: 'faq',
      type: 'faq',
      title: 'Frequently Asked Questions',
      content: content,
      html: this.formatAsHTML(content, 'faq'),
      keywords: keywords.slice(0, 4),
      order: 5
    };
  }

  private createConclusionSection(
    config: SEOPageConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const topBroker = brokers[0]?.name || 'leading broker';
    
    const content = `
      ## Conclusion: Choosing Your Ideal Broker

      Selecting from the ${config.title.toLowerCase()} requires careful consideration of your trading goals, experience level, 
      and preferred trading instruments. Our comprehensive analysis of ${brokers.length} brokers reveals that each offers 
      unique advantages depending on your specific requirements.

      **${topBroker}** emerges as a top choice for traders seeking ${config.highlights[0]}, while other brokers in our 
      comparison excel in areas such as ${config.highlights[1]} and ${config.highlights[2]}.

      ### Key Takeaways:
      - **Regulation matters**: Always choose regulated brokers for investor protection
      - **Compare total costs**: Look beyond spreads to include all trading fees  
      - **Test platforms**: Use demo accounts to evaluate trading platforms
      - **Consider support**: Ensure customer service meets your expectations
      - **Start small**: Begin with minimum deposits to test broker services

      The ${config.title.toLowerCase()} in our comparison continue to evolve, offering improved services and competitive 
      conditions to attract and retain traders. Regular evaluation of your broker's performance ensures you maintain 
      the best possible trading environment for your success.

      Ready to start trading? Compare the detailed features of each broker and choose the one that aligns best with your 
      trading strategy and goals.
    `.trim();

    return {
      id: 'conclusion',
      type: 'conclusion',
      title: 'Conclusion: Choosing Your Ideal Broker',
      content: content,
      html: this.formatAsHTML(content, 'conclusion'),
      keywords: keywords.slice(0, 5),
      order: 6
    };
  }

  /**
   * Country-specific section creators
   */
  private createCountryHeroSection(
    config: CountryConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const countryName = config.name;
    const topBrokers = brokers.slice(0, 3).map(b => b.name).join(', ');
    
    const content = `
      Discover the best forex brokers available in ${countryName} for ${new Date().getFullYear()}. Our comprehensive analysis 
      covers ${brokers.length} regulated brokers that accept traders from ${countryName}, including ${topBrokers} and other 
      leading platforms.

      Trading forex in ${countryName} has never been more accessible, with local and international brokers offering 
      competitive spreads, advanced platforms, and comprehensive support for ${countryName} traders. Whether you're 
      a beginner or experienced trader, find the perfect broker that meets local regulations and your trading requirements.
    `.trim();

    return {
      id: 'hero',
      type: 'hero',
      title: `Best Forex Brokers in ${countryName}`,
      content: content,
      html: this.formatAsHTML(content, 'hero'),
      keywords: keywords,
      order: 1
    };
  }

  private createRegulationSection(
    config: CountryConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const countryName = config.name;
    const regulatedBrokers = brokers.filter(b => b.regulation?.regulators?.length > 0);
    
    const content = `
      ## Forex Regulation in ${countryName}

      Understanding forex regulation in ${countryName} is crucial for trader protection and legal compliance. 
      Our analysis shows ${regulatedBrokers.length} out of ${brokers.length} brokers operate under proper regulatory oversight.

      ### Regulatory Landscape
      Forex brokers serving ${countryName} traders typically hold licenses from major financial authorities including:
      - **CySEC (Cyprus)** - European regulation with strong investor protection
      - **FCA (UK)** - Prestigious regulation with strict operational requirements  
      - **ASIC (Australia)** - Comprehensive oversight for Asia-Pacific markets
      - **NFA/CFTC (US)** - Stringent regulation for US-compliant brokers

      ### Why Regulation Matters
      Regulated brokers in ${countryName} must comply with:
      - **Segregated client funds** - Your deposits are protected separately  
      - **Compensation schemes** - Additional protection for eligible clients
      - **Regular audits** - Financial stability and operational compliance
      - **Fair trading practices** - Transparent pricing and execution policies

      Choosing regulated brokers ensures your trading activities in ${countryName} are protected under established 
      financial frameworks designed to safeguard retail traders.
    `.trim();

    return {
      id: 'regulation',
      type: 'intro',
      title: `Forex Regulation in ${countryName}`,
      content: content,
      html: this.formatAsHTML(content, 'regulation'),
      keywords: keywords,
      order: 2
    };
  }

  private createCountryComparisonSection(
    config: CountryConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const countryName = config.name;
    const topBrokers = brokers.slice(0, 5);
    
    let comparisonContent = `
      ## Top Forex Brokers for ${countryName} Traders

      | Broker | Regulation | Min Deposit | Spreads | ${countryName} Support |
      |--------|------------|-------------|---------|---------------------|
    `;

    topBrokers.forEach(broker => {
      const regulation = broker.regulation?.regulators?.[0] || 'International';
      const minDeposit = broker.accessibility?.minDeposit || 'Varies';
      const spread = broker.tradingConditions?.spreads?.eurusd || 'Variable';
      const support = 'Available'; // This would be determined by actual support analysis
      
      comparisonContent += `| ${broker.name} | ${regulation} | $${minDeposit} | ${spread} pips | ${support} |\n`;
    });

    const content = `
      ${comparisonContent}

      ### Broker Analysis for ${countryName}

      Each broker in our ${countryName} comparison has been evaluated based on their suitability for local traders:

      **${topBrokers[0]?.name || 'Leading Broker'}** offers excellent conditions for ${countryName} traders with 
      competitive spreads and reliable execution. Their platform supports local payment methods and provides 
      customer service during ${countryName} market hours.

      **${topBrokers[1]?.name || 'Second Choice'}** stands out for its comprehensive educational resources and 
      advanced trading tools, making it ideal for both beginners and experienced traders in ${countryName}.

      ### Considerations for ${countryName} Traders:
      - **Local payment methods** for easy deposits and withdrawals
      - **Customer support** in local time zones and languages
      - **Regulatory compliance** with ${countryName} financial laws  
      - **Market access** during Asian, European, and American sessions
      - **Tax implications** of forex trading profits in ${countryName}

      These factors ensure ${countryName} traders can access international forex markets while maintaining 
      compliance with local regulations and convenient service access.
    `.trim();

    return {
      id: 'comparison',
      type: 'comparison',
      title: `Top Forex Brokers for ${countryName} Traders`,
      content: content,
      html: this.formatAsHTML(content, 'comparison'),
      keywords: keywords,
      order: 3
    };
  }

  private createTradingConditionsSection(
    config: CountryConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const countryName = config.name;
    const avgSpread = brokers.length > 0 
      ? (brokers.reduce((sum, b) => sum + (b.tradingConditions?.spreads?.eurusd || 1.5), 0) / brokers.length).toFixed(1)
      : '1.2';

    const content = `
      ## Trading Conditions for ${countryName} Traders

      Understanding trading conditions is essential for ${countryName} traders to maximize their profit potential 
      and minimize trading costs across different market conditions.

      ### Spreads and Commission Structure
      The brokers in our ${countryName} comparison offer competitive spreads with averages starting from ${avgSpread} pips 
      on major currency pairs. Most brokers provide:
      - **Variable spreads** that fluctuate with market conditions
      - **Fixed spreads** for predictable trading costs  
      - **Commission-based** accounts with lower spreads
      - **No-commission** accounts with slightly wider spreads

      ### Platform Access and Features  
      ${countryName} traders benefit from multiple platform options:
      - **MetaTrader 4/5** - Industry-standard platforms with advanced charting
      - **Web platforms** - Browser-based trading without downloads
      - **Mobile apps** - Trade on-the-go with full functionality
      - **API access** - Algorithmic trading capabilities for advanced users

      ### Account Types and Minimums
      Brokers serving ${countryName} typically offer:
      - **Micro accounts** starting from $10-$100 minimum deposits
      - **Standard accounts** with $500-$1,000 minimums  
      - **VIP accounts** for high-volume traders with premium features
      - **Islamic accounts** compliant with Sharia law requirements

      ### Execution Quality
      Fast and reliable execution is crucial for ${countryName} traders, especially during:
      - Major economic announcements affecting local currency
      - Overnight gaps between trading sessions
      - High-volatility periods in global markets
      - News events impacting ${countryName} economy

      The best brokers for ${countryName} maintain execution speeds under 50 milliseconds and provide 
      price improvement when possible, ensuring optimal trading conditions regardless of market volatility.
    `.trim();

    return {
      id: 'trading-conditions',
      type: 'features',
      title: `Trading Conditions for ${countryName} Traders`,
      content: content,
      html: this.formatAsHTML(content, 'trading-conditions'),
      keywords: keywords,
      order: 4
    };
  }

  private createCountryConclusionSection(
    config: CountryConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const countryName = config.name;
    const topBroker = brokers[0]?.name || 'leading broker';

    const content = `
      ## Final Thoughts: Best Forex Broker for ${countryName}

      Choosing the right forex broker as a ${countryName} trader involves balancing regulation, trading costs, 
      platform features, and local support. Our analysis of ${brokers.length} brokers reveals significant 
      differences in their suitability for ${countryName} traders.

      **${topBroker}** emerges as our top recommendation for ${countryName} traders, offering the best 
      combination of regulatory compliance, competitive spreads, and comprehensive support for local traders.

      ### Action Steps for ${countryName} Traders:
      1. **Verify regulation** - Confirm broker licenses and investor protection
      2. **Test platforms** - Open demo accounts to evaluate trading conditions  
      3. **Compare costs** - Calculate total trading expenses including spreads and fees
      4. **Check support** - Ensure customer service availability during your trading hours
      5. **Start small** - Begin with minimum deposits to test broker reliability

      ### Market Outlook for ${countryName}
      The forex market continues to evolve, with brokers improving their services for ${countryName} traders through:
      - Enhanced mobile trading capabilities
      - Improved payment processing for local methods
      - Educational resources tailored to ${countryName} market conditions  
      - Better integration with local financial systems

      Stay informed about regulatory changes affecting forex trading in ${countryName} and regularly review 
      your broker's performance to ensure you maintain optimal trading conditions.

      Ready to start trading? Choose from our recommended brokers and begin your forex trading journey with 
      confidence in ${countryName}'s supportive regulatory environment.
    `.trim();

    return {
      id: 'conclusion',
      type: 'conclusion',
      title: `Final Thoughts: Best Forex Broker for ${countryName}`,
      content: content,
      html: this.formatAsHTML(content, 'conclusion'),
      keywords: keywords,
      order: 6
    };
  }

  /**
   * SEO-specific section creators  
   */
  private createSEOHeroSection(
    config: SEOPageConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const content = `
      ${config.description}

      Our comprehensive analysis covers industry-leading brokers and platforms, providing you with the insights 
      needed to make informed trading decisions. Whether you're interested in ${config.highlights[0]} or 
      ${config.highlights[1]}, this guide covers everything you need to know.

      Discover detailed comparisons, expert reviews, and actionable insights that will help you navigate 
      the complex world of forex trading with confidence.
    `.trim();

    return {
      id: 'hero',
      type: 'hero',
      title: config.title,
      content: content,
      html: this.formatAsHTML(content, 'hero'),
      keywords: keywords,
      order: 1
    };
  }

  private createAnalysisSection(
    config: SEOPageConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const content = `
      ## In-Depth Analysis: ${config.title}

      Understanding the nuances of ${config.title.toLowerCase()} requires examining multiple factors that 
      influence trading success. Our analysis considers ${config.highlights.join(', ')} and their impact 
      on overall trading performance.

      ### Market Overview
      The current forex market landscape presents both opportunities and challenges for traders. Key trends include:
      - Increased regulatory oversight ensuring better investor protection
      - Technological advances improving execution speed and reliability  
      - Growing competition leading to better trading conditions
      - Enhanced educational resources for trader development

      ### Evaluation Criteria
      When analyzing ${config.title.toLowerCase()}, we focus on:
      - **Regulatory status** and compliance with international standards
      - **Trading costs** including spreads, commissions, and overnight fees
      - **Platform technology** and available trading tools
      - **Customer service** quality and availability
      - **Educational resources** and market analysis quality

      ${brokers.length > 0 ? `
      Our research covers ${brokers.length} leading brokers, each offering unique advantages for different 
      types of traders. From beginners seeking educational support to professionals requiring advanced 
      execution capabilities, the right choice depends on individual trading goals and experience levels.
      ` : ''}

      This comprehensive approach ensures our recommendations align with both current market conditions 
      and long-term trading success factors.
    `.trim();

    return {
      id: 'analysis',
      type: 'intro',
      title: `In-Depth Analysis: ${config.title}`,
      content: content,
      html: this.formatAsHTML(content, 'analysis'),
      keywords: keywords,
      order: 2
    };
  }

  private createReviewsSection(
    config: SEOPageConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const topBrokers = brokers.slice(0, 3);
    
    let reviewContent = `
      ## Broker Reviews and Ratings

      Based on our comprehensive evaluation methodology, here are detailed reviews of the top brokers 
      related to ${config.title.toLowerCase()}:

    `;

    topBrokers.forEach((broker, index) => {
      const rating = this.calculateBrokerRating(broker);
      reviewContent += `
      ### ${index + 1}. ${broker.name} - ${rating}/5 Stars

      **Strengths:**
      - ${broker.regulation?.regulators?.length > 0 ? 'Properly regulated and licensed' : 'International presence'}
      - ${broker.tradingConditions?.spreads?.eurusd ? `Competitive spreads from ${broker.tradingConditions.spreads.eurusd} pips` : 'Competitive pricing'}
      - ${broker.platforms?.mt4 || broker.platforms?.mt5 ? 'MetaTrader platform support' : 'Advanced trading platform'}
      - ${broker.accessibility?.demoAccount ? 'Demo account available' : 'Professional trading tools'}

      **Consider This Broker If:**
      - You value ${config.highlights[0] || 'professional service'}
      - You need ${config.highlights[1] || 'reliable execution'}  
      - You want ${config.highlights[2] || 'competitive conditions'}

      ${broker.summary || `${broker.name} offers a comprehensive trading environment suitable for various trading styles and experience levels.`}

      `;
    });

    return {
      id: 'reviews',
      type: 'comparison',
      title: 'Broker Reviews and Ratings',
      content: reviewContent,
      html: this.formatAsHTML(reviewContent, 'reviews'),
      keywords: keywords,
      order: 3
    };
  }

  private createEducationalSection(
    config: SEOPageConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const content = `
      ## Educational Resources and Trading Tips

      Success in forex trading requires continuous learning and adaptation to changing market conditions. 
      Understanding ${config.title.toLowerCase()} involves mastering both technical and fundamental analysis approaches.

      ### Essential Trading Concepts
      - **Risk Management**: Never risk more than 2% of your account on a single trade
      - **Position Sizing**: Calculate appropriate lot sizes based on account balance and risk tolerance
      - **Market Analysis**: Combine technical indicators with fundamental news analysis
      - **Trading Psychology**: Maintain discipline and emotional control during volatile periods

      ### Common Mistakes to Avoid
      - Over-leveraging positions beyond your risk tolerance
      - Trading without a predetermined strategy or plan
      - Ignoring economic calendars and high-impact news events
      - Failing to use stop-loss orders for risk protection

      ### Advanced Strategies
      For experienced traders interested in ${config.highlights[0]} and ${config.highlights[1]}, consider:
      - **Scalping**: Quick profits from small price movements
      - **Swing Trading**: Capturing medium-term trends over days or weeks
      - **Position Trading**: Long-term strategies based on fundamental analysis
      - **Algorithmic Trading**: Automated systems for consistent execution

      ### Continuous Improvement
      Successful traders continuously refine their approach through:
      - Regular performance analysis and trade journaling
      - Staying updated with market news and economic indicators
      - Practicing new strategies in demo environments
      - Learning from both profitable and losing trades

      The best brokers provide comprehensive educational resources, including webinars, tutorials, 
      and market analysis to support your trading education journey.
    `.trim();

    return {
      id: 'educational',
      type: 'features',
      title: 'Educational Resources and Trading Tips',
      content: content,
      html: this.formatAsHTML(content, 'educational'),
      keywords: keywords,
      order: 4
    };
  }

  private createSEOConclusionSection(
    config: SEOPageConfig,
    brokers: Broker[],
    keywords: string[]
  ): ContentSection {
    const content = `
      ## Summary: ${config.title} Success Factors

      Mastering ${config.title.toLowerCase()} requires the right combination of knowledge, tools, and broker support. 
      Our analysis reveals that success depends on ${config.highlights.join(', ')} working together to create 
      optimal trading conditions.

      ### Key Success Factors:
      - **Choose the right broker**: Regulation, costs, and platform quality matter most
      - **Develop a trading plan**: Clear strategies with defined risk parameters  
      - **Continuous education**: Stay updated with market developments and new techniques
      - **Risk management**: Preserve capital through disciplined position sizing
      - **Performance tracking**: Regular analysis of trading results and improvements

      ${brokers.length > 0 ? `
      The ${brokers.length} brokers in our analysis each offer unique advantages. Consider your trading style, 
      experience level, and specific requirements when making your selection.
      ` : ''}

      ### Next Steps:
      1. **Define your goals**: Clarify your trading objectives and risk tolerance
      2. **Research thoroughly**: Compare broker features and conditions
      3. **Start with demos**: Test strategies without financial risk
      4. **Begin conservatively**: Start with small positions and gradually increase
      5. **Stay disciplined**: Stick to your trading plan and risk management rules

      The forex market offers significant opportunities for prepared traders who approach it with proper 
      knowledge, tools, and professional broker support. Success in ${config.title.toLowerCase()} 
      comes from consistent application of proven strategies combined with continuous learning and adaptation.

      Ready to take the next step? Choose a reputable broker from our comparison and begin your journey 
      toward ${config.title.toLowerCase()} success.
    `.trim();

    return {
      id: 'conclusion',
      type: 'conclusion',
      title: `Summary: ${config.title} Success Factors`,
      content: content,
      html: this.formatAsHTML(content, 'conclusion'),
      keywords: keywords,
      order: 6
    };
  }

  /**
   * Assemble content sections into complete generated content
   */
  private assembleContent(
    sections: ContentSection[],
    targetKeywords: string[],
    pageType: 'category' | 'country' | 'seo',
    brokerCount: number
  ): GeneratedContent {
    // Sort sections by order
    sections.sort((a, b) => a.order - b.order);

    // Calculate content metrics
    const totalContent = sections.map(s => s.content).join('\n\n');
    const wordCount = this.calculateWordCount(totalContent);
    const keywordDensity = this.calculateKeywordDensity(totalContent, targetKeywords);
    const readabilityScore = this.calculateReadabilityScore(totalContent);

    // Generate SEO content
    const seoContent: SEOContent = {
      headings: {
        h1: sections[0]?.title || '',
        h2: sections.filter(s => s.type !== 'hero').map(s => s.title),
        h3: this.extractH3Headings(sections)
      },
      keywordVariations: this.generateKeywordVariations(targetKeywords),
      internalLinks: this.generateInternalLinks(pageType, targetKeywords),
      externalLinks: this.generateExternalLinks(targetKeywords),
      callsToAction: this.generateCallsToAction(pageType)
    };

    // Generate metadata
    const metadata: ContentMetadata = {
      generatedAt: new Date().toISOString(),
      pageType,
      targetKeywords,
      brokerCount,
      contentVersion: '1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      quality: {
        seoScore: this.calculateSEOScore(sections, targetKeywords, seoContent),
        readabilityScore,
        keywordOptimization: this.calculateKeywordOptimization(keywordDensity, targetKeywords),
        contentDepth: this.calculateContentDepth(sections, wordCount)
      }
    };

    return {
      mainContent: sections,
      seoContent,
      metadata,
      readabilityScore,
      wordCount,
      keywordDensity
    };
  }

  /**
   * Helper methods for content optimization and analysis
   */
  private optimizeContentForSEO(
    content: GeneratedContent,
    pageType: string,
    brokers: Broker[]
  ): GeneratedContent {
    // Optimize keyword density
    const optimizedSections = content.mainContent.map(section => ({
      ...section,
      content: this.optimizeKeywordDensity(section.content, content.metadata.targetKeywords),
      html: this.formatAsHTML(section.content, section.type)
    }));

    return {
      ...content,
      mainContent: optimizedSections
    };
  }

  private optimizeKeywordDensity(content: string, keywords: string[]): string {
    // Simple keyword optimization - replace some generic terms with keywords
    let optimized = content;
    
    keywords.forEach(keyword => {
      const density = this.calculateKeywordDensityForKeyword(optimized, keyword);
      const target = this.config.keywordDensity.primary.optimal / 100;
      
      if (density < target) {
        // Add keyword variations naturally
        optimized = optimized.replace(/\btrading\b/gi, `${keyword} trading`, 1);
        optimized = optimized.replace(/\bbrokers\b/gi, `${keyword} brokers`, 1);
      }
    });

    return optimized;
  }

  private formatAsHTML(content: string, sectionType: string): string {
    // Convert markdown-style content to HTML
    let html = content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\|([^|]*)\|/g, (match, cell) => `<td>${cell.trim()}</td>`)
      .replace(/^\|(.*)\|$/gm, '<tr>$1</tr>');

    // Wrap in appropriate HTML structure
    html = `<div class="content-section content-${sectionType}"><p>${html}</p></div>`;
    
    return html;
  }

  private generateFAQs(
    config: SEOPageConfig | CountryConfig,
    brokers: Broker[],
    pageType: string
  ): Array<{ question: string; answer: string }> {
    const faqs: Array<{ question: string; answer: string }> = [];

    if (pageType === 'category') {
      const categoryConfig = config as SEOPageConfig;
      faqs.push(
        {
          question: `What are the ${categoryConfig.title.toLowerCase()}?`,
          answer: `The ${categoryConfig.title.toLowerCase()} are selected based on ${categoryConfig.highlights.slice(0, 2).join(', ')}, regulatory compliance, and overall trading conditions. Our analysis covers ${brokers.length} brokers to identify the most suitable options for different trader needs.`
        },
        {
          question: `How do I choose the right broker from the ${categoryConfig.title.toLowerCase()}?`,
          answer: `Consider your trading experience, preferred instruments, deposit amount, and required features. Compare regulation, spreads, platforms, and customer support quality. Always test with demo accounts before committing real funds.`
        },
        {
          question: `Are these brokers regulated and safe?`,
          answer: `Yes, all brokers in our ${categoryConfig.title.toLowerCase()} comparison are regulated by major financial authorities such as CySEC, FCA, ASIC, or equivalent regulators, ensuring investor protection and operational compliance.`
        }
      );
    } else if (pageType === 'country') {
      const countryConfig = config as CountryConfig;
      faqs.push(
        {
          question: `Can I legally trade forex in ${countryConfig.name}?`,
          answer: `Yes, forex trading is legal in ${countryConfig.name}. However, you should choose regulated brokers and be aware of tax implications on trading profits. Consult local financial regulations for specific requirements.`
        },
        {
          question: `What's the minimum deposit for ${countryConfig.name} traders?`,
          answer: `Minimum deposits vary by broker, typically ranging from $10 to $500. Many brokers offer micro accounts with lower minimums specifically for ${countryConfig.name} traders to start with smaller amounts.`
        },
        {
          question: `Do these brokers support local payment methods in ${countryConfig.name}?`,
          answer: `Most international brokers support common payment methods including bank transfers, credit cards, and popular e-wallets. Check with individual brokers for specific payment options available in ${countryConfig.name}.`
        }
      );
    }

    return faqs;
  }

  private generateKeywordVariations(keywords: string[]): string[] {
    const variations: string[] = [];
    
    keywords.forEach(keyword => {
      variations.push(keyword);
      variations.push(keyword + 's');
      variations.push('best ' + keyword);
      variations.push('top ' + keyword);
      variations.push(keyword + ' comparison');
      variations.push(keyword + ' review');
    });

    return [...new Set(variations)];
  }

  private generateInternalLinks(pageType: string, keywords: string[]): InternalLink[] {
    const links: InternalLink[] = [];

    // Generate contextual internal links based on page type
    if (pageType === 'category') {
      links.push(
        {
          text: 'Best Forex Brokers Directory',
          url: '/best-brokers',
          context: 'main navigation',
          relevance: 0.9
        },
        {
          text: 'Broker Comparison Guide', 
          url: '/broker-comparison',
          context: 'related content',
          relevance: 0.8
        }
      );
    }

    return links;
  }

  private generateExternalLinks(keywords: string[]): ExternalLink[] {
    return [
      {
        text: 'Financial Conduct Authority',
        url: 'https://www.fca.org.uk/',
        context: 'regulation reference',
        rel: ''
      },
      {
        text: 'Cyprus Securities and Exchange Commission',
        url: 'https://www.cysec.gov.cy/',
        context: 'regulation reference', 
        rel: ''
      }
    ];
  }

  private generateCallsToAction(pageType: string): CallToAction[] {
    return [
      {
        text: 'Compare Brokers Now',
        type: 'primary',
        context: 'after comparison section',
        placement: 'section-end'
      },
      {
        text: 'Read Full Broker Reviews',
        type: 'secondary',
        context: 'in broker listings',
        placement: 'inline'
      },
      {
        text: 'Start Trading Today',
        type: 'primary',
        context: 'conclusion section',
        placement: 'content-end'
      }
    ];
  }

  /**
   * Content analysis and metrics calculation
   */
  private calculateWordCount(content: string): number {
    return content.trim().split(/\s+/).length;
  }

  private calculateKeywordDensity(content: string, keywords: string[]): Record<string, number> {
    const words = content.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    const density: Record<string, number> = {};

    keywords.forEach(keyword => {
      const keywordWords = keyword.toLowerCase().split(/\s+/);
      let count = 0;
      
      for (let i = 0; i <= words.length - keywordWords.length; i++) {
        const phrase = words.slice(i, i + keywordWords.length).join(' ');
        if (phrase === keyword.toLowerCase()) {
          count++;
        }
      }
      
      density[keyword] = (count / totalWords) * 100;
    });

    return density;
  }

  private calculateKeywordDensityForKeyword(content: string, keyword: string): number {
    const words = content.toLowerCase().split(/\s+/);
    const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length;
    return keywordCount / words.length;
  }

  private calculateReadabilityScore(content: string): number {
    // Simplified Flesch Reading Ease calculation
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.trim().split(/\s+/);
    const syllables = this.countSyllables(content);

    if (sentences.length === 0 || words.length === 0) return 0;

    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    
    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, score));
  }

  private countSyllables(text: string): number {
    // Simplified syllable counting
    const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    let syllableCount = 0;

    words.forEach(word => {
      if (word.length <= 3) {
        syllableCount += 1;
      } else {
        const vowelMatches = word.match(/[aeiouy]+/g);
        syllableCount += vowelMatches ? vowelMatches.length : 1;
      }
    });

    return syllableCount;
  }

  private calculateBrokerRating(broker: Broker): number {
    // Simple rating calculation based on available data
    let score = 3; // Base score
    
    if (broker.regulation?.regulators?.length > 0) score += 0.5;
    if (broker.accessibility?.minDeposit && broker.accessibility.minDeposit <= 100) score += 0.5;
    if (broker.tradingConditions?.spreads?.eurusd && broker.tradingConditions.spreads.eurusd < 1.0) score += 0.5;
    if (broker.platforms?.mt4 || broker.platforms?.mt5) score += 0.5;
    
    return Math.min(5, Math.max(1, Number(score.toFixed(1))));
  }

  private extractH3Headings(sections: ContentSection[]): string[] {
    const h3Headings: string[] = [];
    
    sections.forEach(section => {
      const matches = section.content.match(/^### (.*$)/gim);
      if (matches) {
        matches.forEach(match => {
          h3Headings.push(match.replace('### ', ''));
        });
      }
    });

    return h3Headings;
  }

  private calculateSEOScore(
    sections: ContentSection[],
    keywords: string[],
    seoContent: SEOContent
  ): number {
    let score = 0;
    
    // Content structure (40 points)
    if (seoContent.headings.h1) score += 10;
    if (seoContent.headings.h2.length >= 3) score += 15;
    if (seoContent.headings.h3.length >= 5) score += 15;
    
    // Keyword optimization (30 points)
    if (keywords.length >= 3) score += 15;
    if (seoContent.keywordVariations.length >= 10) score += 15;
    
    // Content depth (30 points)
    const totalWords = sections.reduce((sum, s) => sum + this.calculateWordCount(s.content), 0);
    if (totalWords >= 1500) score += 15;
    if (sections.length >= 5) score += 15;

    return Math.min(100, score);
  }

  private calculateKeywordOptimization(
    keywordDensity: Record<string, number>,
    keywords: string[]
  ): number {
    let score = 0;
    let totalKeywords = 0;

    Object.entries(keywordDensity).forEach(([keyword, density]) => {
      totalKeywords++;
      if (density >= this.config.keywordDensity.primary.min && 
          density <= this.config.keywordDensity.primary.max) {
        score += 20;
      } else if (density > 0) {
        score += 10;
      }
    });

    return totalKeywords > 0 ? Math.min(100, score / totalKeywords * 5) : 0;
  }

  private calculateContentDepth(sections: ContentSection[], wordCount: number): number {
    let score = 0;
    
    // Word count scoring
    if (wordCount >= 2000) score += 40;
    else if (wordCount >= 1500) score += 30;
    else if (wordCount >= 1000) score += 20;
    else score += 10;
    
    // Section variety scoring
    const sectionTypes = new Set(sections.map(s => s.type));
    score += sectionTypes.size * 10;

    return Math.min(100, score);
  }

  private initializeTemplateLibrary(): void {
    // Initialize content templates for different sections
    this.templateLibrary.set('hero', 'Looking for {topic}? Our comprehensive analysis...');
    this.templateLibrary.set('intro', 'Understanding {topic} requires...');
    this.templateLibrary.set('comparison', 'Here\'s our detailed comparison of...');
    // Add more templates as needed
  }

  /**
   * Clear content cache
   */
  async clearCache(pattern?: string): Promise<void> {
    if (pattern) {
      await programmaticCache.invalidate(`content:${pattern}`);
    } else {
      await programmaticCache.invalidate('content:*');
    }
    this.contentCache.clear();
  }

  /**
   * Get content generation statistics
   */
  getGenerationStats(): {
    cacheSize: number;
    totalGenerated: number;
    templateCount: number;
  } {
    return {
      cacheSize: this.contentCache.size,
      totalGenerated: this.contentCache.size,
      templateCount: this.templateLibrary.size
    };
  }
}

// Create singleton instance
export const contentGenerator = new ContentGeneratorService();

// React hook for content generation
export const useContentGenerator = () => {
  return {
    generateOptimizedContent: contentGenerator.generateOptimizedContent.bind(contentGenerator),
    clearCache: contentGenerator.clearCache.bind(contentGenerator),
    getGenerationStats: contentGenerator.getGenerationStats.bind(contentGenerator)
  };
};

export default contentGenerator;