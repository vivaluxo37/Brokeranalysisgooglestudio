import { EnhancedCategory } from '../data/enhancedCategoryMappings';
import { Broker } from '../types';

// Enhanced content templates for 2025 optimization
export interface EnhancedContentTemplate {
  h1: string;
  intro: string;
  localContext: {
    advantages: string;
    disadvantages: string;
    bestFor: string;
  };
  comparisonHighlights: string[];
  faqs: FAQ[];
  metaDescription: string;
  metaTitle: string;
  keywords: string[];
  structuredData: any;
}

export interface FAQ {
  question: string;
  answer: string;
  id: string;
}

export interface BrokerSummary {
  name: string;
  rating: number;
  minDeposit: number;
  regulation: string;
  keyFeatures: string[];
}

/**
 * Enhanced content generation utility for SEO-optimized category pages
 */
export class EnhancedContentGenerator {

  /**
   * Generate comprehensive category page content
   */
  async generateEnhancedCategoryContent(
    category: EnhancedCategory,
    brokers: BrokerSummary[]
  ): Promise<EnhancedContentTemplate> {

    const categoryName = category.name;
    const brokerCount = brokers.length;
    const topBrokers = brokers.slice(0, 3);
    const topBroker = brokers[0];

    // Generate H1
    const h1 = this.generateEnhancedH1(category, brokerCount);

    // Generate comprehensive intro
    const intro = this.generateEnhancedIntro(category, topBrokers, brokerCount);

    // Generate local context section
    const localContext = this.generateLocalContext(category);

    // Generate comparison highlights
    const comparisonHighlights = this.generateComparisonHighlights(category, topBrokers);

    // Generate comprehensive FAQs
    const faqs = this.generateEnhancedFAQs(category, brokers);

    // Generate SEO metadata
    const { metaTitle, metaDescription } = this.generateSEOMetadata(category, brokerCount, topBroker);

    // Generate keywords
    const keywords = this.generateEnhancedKeywords(category);

    // Generate structured data
    const structuredData = this.generateStructuredData(category, brokers, metaTitle, metaDescription);

    return {
      h1,
      intro,
      localContext,
      comparisonHighlights,
      faqs,
      metaDescription,
      metaTitle,
      keywords,
      structuredData
    };
  }

  /**
   * Generate enhanced H1 title
   */
  private generateEnhancedH1(category: EnhancedCategory, brokerCount: number): string {
    const templates = [
      `Best ${category.name} 2025 | Top ${Math.min(brokerCount, 10)} Platforms Compared`,
      `${category.name} — Complete Guide & Top ${Math.min(brokerCount, 10)} Brokers 2025`,
      `Top ${category.name} for 2025 | Expert Reviews & ${brokerCount} Platform Analysis`
    ];

    return templates[0];
  }

  /**
   * Generate comprehensive intro paragraph
   */
  private generateEnhancedIntro(
    category: EnhancedCategory,
    topBrokers: BrokerSummary[],
    totalCount: number
  ): string {
    const topBrokerNames = topBrokers.map(b => b.name).join(', ');
    const avgRating = topBrokers.length > 0
      ? (topBrokers.reduce((sum, b) => sum + b.rating, 0) / topBrokers.length).toFixed(1)
      : '8.0';

    const categorySpecificIntro = this.getCategorySpecificIntro(category.id);

    return `${categorySpecificIntro} Our comprehensive analysis of ${totalCount} top-rated platforms reveals that ${topBrokerNames} lead the market with an average rating of ${avgRating}/10. ${category.description} These brokers provide ${category.localContext.keyFeatures.join(', ')}, making them ideal choices for traders seeking ${category.name.toLowerCase()}. Compare fees, regulation, and features to find the perfect platform for your trading strategy in 2025.`;
  }

  /**
   * Generate local context section
   */
  private generateLocalContext(category: EnhancedCategory): {
    advantages: string;
    disadvantages: string;
    bestFor: string;
  } {
    return {
      advantages: category.localContext.advantages.map(adv => `• ${adv}`).join('\n'),
      disadvantages: category.localContext.disadvantages.map(dis => `• ${dis}`).join('\n'),
      bestFor: category.localContext.bestFor.join(', ')
    };
  }

  /**
   * Generate comparison highlights
   */
  private generateComparisonHighlights(
    category: EnhancedCategory,
    topBrokers: BrokerSummary[]
  ): string[] {
    const highlights: string[] = [];

    if (topBrokers.length >= 1) {
      highlights.push(`**${topBrokers[0].name}:** ${topBrokers[0].keyFeatures[0]} with ${topBrokers[0].rating}/10 rating and regulation by ${topBrokers[0].regulation}`);
    }

    if (topBrokers.length >= 2) {
      highlights.push(`**${topBrokers[1].name}:** ${topBrokers[1].keyFeatures[1]} with ${topBrokers[1].rating}/10 rating and minimum deposit of $${topBrokers[1].minDeposit}`);
    }

    if (topBrokers.length >= 3) {
      highlights.push(`**${topBrokers[2].name}:** ${topBrokers[2].keyFeatures[2]} with ${topBrokers[2].rating}/10 rating and ${topBrokers[2].regulation} regulation`);
    }

    return highlights;
  }

  /**
   * Generate enhanced FAQs
   */
  private generateEnhancedFAQs(
    category: EnhancedCategory,
    brokers: BrokerSummary[]
  ): FAQ[] {
    const topBroker = brokers[0];
    const avgMinDeposit = brokers.length > 0
      ? Math.round(brokers.reduce((sum, b) => sum + b.minDeposit, 0) / brokers.length)
      : 200;

    const baseFAQs: FAQ[] = [
      {
        id: 'what-are',
        question: `What are ${category.name}?`,
        answer: `${category.name} are ${this.getCategoryExplanation(category.id)} ${category.description} These platforms typically offer ${category.localContext.keyFeatures.join(', ')} to meet specific trading requirements.`
      },
      {
        id: 'best-broker',
        question: `Which is the best ${category.name.toLowerCase().replace('brokers', 'broker')} in 2025?`,
        answer: topBroker
          ? `${topBroker.name} is currently our top-rated choice with a ${topBroker.rating}/10 rating. They excel in ${topBroker.keyFeatures.join(', ')} and are regulated by ${topBroker.regulation}, making them ideal for ${category.localContext.bestFor.join(', ')}.`
          : `The best ${category.name.toLowerCase()} depend on your specific trading needs, but our analysis shows platforms with strong regulation, competitive fees, and ${category.localContext.keyFeatures[0]} perform best.`
      },
      {
        id: 'how-to-choose',
        question: `How to choose the right ${category.name.toLowerCase().replace('brokers', 'broker')}?`,
        answer: `When selecting ${category.name.toLowerCase()}, consider these key factors: 1) Regulatory compliance and investor protection, 2) Trading costs including spreads and commissions, 3) Platform features and trading tools, 4) Minimum deposit requirements (average: $${avgMinDeposit}), 5) ${category.localContext.keyFeatures[0]}, and 6) Customer support quality and availability.`
      }
    ];

    // Add category-specific FAQs
    const specificFAQs = this.getCategorySpecificFAQs(category.id, brokers);
    baseFAQs.push(...specificFAQs);

    return baseFAQs;
  }

  /**
   * Generate SEO metadata
   */
  private generateSEOMetadata(
    category: EnhancedCategory,
    brokerCount: number,
    topBroker?: BrokerSummary
  ): { metaTitle: string; metaDescription: string } {
    const metaTitle = category.seoTitle;

    const metaDescription = category.metaDescription.length > 160
      ? category.metaDescription.substring(0, 157) + '...'
      : category.metaDescription;

    return { metaTitle, metaDescription };
  }

  /**
   * Generate enhanced keywords
   */
  private generateEnhancedKeywords(category: EnhancedCategory): string[] {
    const baseKeywords = [
      `best ${category.name.toLowerCase()}`,
      `${category.name.toLowerCase()} 2025`,
      `top ${category.name.toLowerCase()}`,
      category.slug.replace(/-/g, ' ')
    ];

    const categorySpecificKeywords = this.getCategorySpecificKeywords(category.id);

    return [...baseKeywords, ...categorySpecificKeywords];
  }

  /**
   * Generate structured data
   */
  private generateStructuredData(
    category: EnhancedCategory,
    brokers: BrokerSummary[],
    metaTitle: string,
    metaDescription: string
  ): any {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": metaTitle,
      "description": metaDescription,
      "url": `${window.location.origin}/best-brokers/${category.slug}`,
      "mainEntity": {
        "@type": "ItemList",
        "name": category.name,
        "description": category.description,
        "numberOfItems": brokers.length,
        "itemListElement": brokers.slice(0, 10).map((broker, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "FinancialProduct",
            "name": broker.name,
            "description": broker.keyFeatures.join(', '),
            "provider": {
              "@type": "Organization",
              "name": broker.name
            },
            "aggregateRating": broker.rating ? {
              "@type": "AggregateRating",
              "ratingValue": broker.rating,
              "bestRating": 10,
              "worstRating": 1
            } : undefined
          }
        }))
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": window.location.origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Best Brokers",
            "item": `${window.location.origin}/best-brokers`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": category.name
          }
        ]
      }
    };
  }

  /**
   * Get category-specific introduction
   */
  private getCategorySpecificIntro(categoryId: string): string {
    const intros: { [key: string]: string } = {
      'ecn-brokers': 'Looking for true ECN brokers with direct market access and institutional-grade trading conditions?',
      'mt4-brokers': 'Searching for the best MetaTrader 4 brokers with expert advisor support and automated trading?',
      'islamic-accounts-brokers': 'Need Sharia-compliant Islamic accounts with swap-free trading conditions?',
      'scalping-brokers': 'Looking for brokers that welcome scalping strategies with ultra-tight spreads and instant execution?',
      'high-leverage-brokers': 'Seeking high leverage options to amplify your trading power with smaller capital?',
      'beginners-brokers': 'New to trading and need beginner-friendly platforms with educational resources?',
      'no-minimum-deposit-brokers': 'Want to start trading without committing to a large minimum deposit?'
    };

    return intros[categoryId] || `Looking for the best ${categoryId} in 2025?`;
  }

  /**
   * Get category explanation
   */
  private getCategoryExplanation(categoryId: string): string {
    const explanations: { [key: string]: string } = {
      'ecn-brokers': 'specialized trading platforms that provide direct access to the interbank market through Electronic Communication Networks, offering raw spreads from 0.0 pips and transparent pricing.',
      'mt4-brokers': 'platforms that support the MetaTrader 4 trading software, enabling automated trading through Expert Advisors, custom indicators, and advanced technical analysis tools.',
      'islamic-accounts-brokers': 'financial platforms that offer Sharia-compliant trading accounts without overnight swap charges, allowing Muslim traders to participate in forex trading while adhering to religious principles.',
      'scalping-brokers': 'trading platforms specifically designed to support high-frequency trading strategies with tight spreads, fast execution, and no restrictions on short-term trading.',
      'high-leverage-brokers': 'brokers that provide amplified trading power through high leverage ratios, allowing traders to control larger positions with smaller capital amounts.',
      'beginners-brokers': 'user-friendly trading platforms designed for new traders with educational resources, demo accounts, and simple interfaces.',
      'no-minimum-deposit-brokers': 'accessible trading platforms that allow traders to start with any amount they can afford, removing financial barriers to entry.'
    };

    return explanations[categoryId] || 'specialized trading platforms designed for specific trading styles and requirements.';
  }

  /**
   * Get category-specific FAQs
   */
  private getCategorySpecificFAQs(categoryId: string, brokers: BrokerSummary[]): FAQ[] {
    const faqMap: { [key: string]: FAQ[] } = {
      'ecn-brokers': [
        {
          id: 'ecn-costs',
          question: 'Are ECN brokers more expensive than standard brokers?',
          answer: 'ECN brokers typically charge a commission (usually $3-7 per round turn lot) but offer raw spreads from 0.0 pips. While the commission adds cost, the tighter spreads often result in lower overall trading costs, especially for active traders and scalpers.'
        },
        {
          id: 'ecn-vs-stp',
          question: 'What\'s the difference between ECN and STP execution?',
          answer: 'ECN brokers provide direct market access with order book visibility and anonymous trading, while STP brokers route orders to liquidity providers without displaying market depth. ECN generally offers better pricing but may have higher minimum deposits.'
        }
      ],
      'mt4-brokers': [
        {
          id: 'mt4-eas',
          question: 'Can I use Expert Advisors on all MT4 brokers?',
          answer: 'Most MT4 brokers support Expert Advisors, but some may restrict EAs during high volatility or require specific account types. Always check the broker\'s policy on automated trading and any potential restrictions on EA usage.'
        },
        {
          id: 'mt4-customization',
          question: 'Can I customize MT4 with these brokers?',
          answer: 'Yes, MT4 brokers typically allow full customization including custom indicators, scripts, and templates. However, some brokers may offer their own custom-built indicators or EAs that integrate with their specific trading conditions.'
        }
      ],
      'islamic-accounts-brokers': [
        {
          id: 'islamic-fees',
          question: 'Do Islamic accounts have higher fees?',
          answer: 'Islamic accounts may have slightly wider spreads or administrative fees to compensate for the eliminated overnight swap charges. However, many brokers offer competitive Islamic accounts with minimal additional costs.'
        },
        {
          id: 'islamic-instruments',
          question: 'Are all trading instruments available on Islamic accounts?',
          answer: 'Most brokers offer their full range of instruments on Islamic accounts, but some may restrict certain assets with high swap costs. Always check the specific terms and conditions for Islamic trading with your chosen broker.'
        }
      ],
      'scalping-brokers': [
        {
          id: 'scalping-restrictions',
          question: 'Do these brokers have any scalping restrictions?',
          answer: 'Brokers listed as scalper-friendly typically have no restrictions on scalping strategies, including minimum trade duration limits or limits on trades per day. However, always verify the specific terms as policies can vary.'
        },
        {
          id: 'scalping-requirements',
          question: 'What do I need for successful scalping?',
          answer: 'For successful scalping, you need: ultra-low spreads, instant execution, reliable platform with one-click trading, VPS for reduced latency, and sufficient capital to handle high-frequency trading with proper risk management.'
        }
      ],
      'high-leverage-brokers': [
        {
          id: 'leverage-risks',
          question: 'Is high leverage safe for beginners?',
          answer: 'High leverage significantly increases both potential profits and risks. While it allows larger position sizes with smaller capital, it also amplifies losses and can lead to rapid account depletion. Beginners should start with low leverage and gradually increase as they gain experience.'
        },
        {
          id: 'leverage-regulation',
          question: 'Are high leverage brokers regulated?',
          answer: 'Many high leverage brokers are regulated, but often by offshore or less stringent regulators. While some maintain multiple licenses including top-tier regulators, others operate primarily under international supervision. Always verify regulatory status and understand the protection level.'
        }
      ]
    };

    return faqMap[categoryId] || [];
  }

  /**
   * Get category-specific keywords
   */
  private getCategorySpecificKeywords(categoryId: string): string[] {
    const keywordMap: { [key: string]: string[] } = {
      'ecn-brokers': ['electronic communication network', 'ecn forex', 'direct market access', 'institutional trading', 'raw spreads', 'no dealing desk'],
      'mt4-brokers': ['metatrader 4', 'mt4 platform', 'expert advisors', 'automated trading', 'mt4 eas', 'custom indicators'],
      'islamic-accounts-brokers': ['swap free', 'sharia compliant', 'halal trading', 'islamic forex', 'swap-free accounts', 'muslim traders'],
      'scalping-brokers': ['scalping allowed', 'tight spreads', 'fast execution', 'high frequency trading', 'scalper friendly', 'no restrictions'],
      'high-leverage-brokers': ['high leverage forex', '1:500 leverage', 'amplified trading', 'leverage trading', 'high risk trading', 'professional leverage'],
      'beginners-brokers': ['forex for beginners', 'new trader brokers', 'educational brokers', 'demo accounts', 'learning platforms', 'starter brokers'],
      'no-minimum-deposit-brokers': ['no minimum deposit', '$1 deposit brokers', 'micro accounts', 'small capital trading', 'budget forex', 'low entry brokers']
    };

    return keywordMap[categoryId] || [];
  }
}

// Export singleton instance
let enhancedContentGenerator: EnhancedContentGenerator | null = null;

export function getEnhancedContentGenerator(): EnhancedContentGenerator {
  if (!enhancedContentGenerator) {
    enhancedContentGenerator = new EnhancedContentGenerator();
  }
  return enhancedContentGenerator;
}