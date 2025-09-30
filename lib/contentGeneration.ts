import { createClient } from '@supabase/supabase-js';

// Content templates for 2025 optimization
export interface ContentTemplate {
  h1: string;
  intro: string;
  faqs: FAQ[];
  metaDescription: string;
  keywords: string[];
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
 * Content generation utility for SEO-optimized pages
 */
export class ContentGenerator {
  private supabase;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  /**
   * Generate category page content
   */
  async generateCategoryContent(
    categorySlug: string,
    brokers: BrokerSummary[]
  ): Promise<ContentTemplate> {
    
    // Get category info
    const categoryInfo = await this.getCategoryInfo(categorySlug);
    if (!categoryInfo) {
      throw new Error(`Category not found: ${categorySlug}`);
    }

    const categoryName = categoryInfo.name;
    const categoryDescription = categoryInfo.description;
    const brokerCount = brokers.length;

    // Generate H1
    const h1 = this.generateCategoryH1(categoryName, brokerCount);

    // Generate intro paragraph
    const intro = this.generateCategoryIntro(
      categoryName,
      categoryDescription,
      brokers.slice(0, 3), // Top 3 brokers
      brokerCount
    );

    // Generate FAQs
    const faqs = this.generateCategoryFAQs(categoryName, brokers);

    // Generate meta description
    const metaDescription = this.generateCategoryMetaDescription(
      categoryName,
      brokerCount,
      brokers[0] // Top broker
    );

    // Generate keywords
    const keywords = this.generateCategoryKeywords(categoryName, categorySlug);

    return {
      h1,
      intro,
      faqs,
      metaDescription,
      keywords
    };
  }

  /**
   * Generate country page content
   */
  async generateCountryContent(
    countrySlug: string,
    countryName: string,
    brokers: BrokerSummary[]
  ): Promise<ContentTemplate> {
    
    const brokerCount = brokers.length;

    // Generate H1
    const h1 = `Best Forex Brokers in ${countryName} 2025`;

    // Generate intro paragraph
    const intro = this.generateCountryIntro(
      countryName,
      brokers.slice(0, 3), // Top 3 brokers
      brokerCount
    );

    // Generate FAQs
    const faqs = this.generateCountryFAQs(countryName, brokers);

    // Generate meta description
    const metaDescription = this.generateCountryMetaDescription(
      countryName,
      brokerCount,
      brokers[0] // Top broker
    );

    // Generate keywords
    const keywords = this.generateCountryKeywords(countryName, countrySlug);

    return {
      h1,
      intro,
      faqs,
      metaDescription,
      keywords
    };
  }

  /**
   * Generate category H1 title
   */
  private generateCategoryH1(categoryName: string, brokerCount: number): string {
    const templates = [
      `Best ${categoryName} — Top ${Math.min(brokerCount, 10)} ${this.getShortCategoryName(categoryName)} 2025`,
      `${categoryName} — Compare Top ${Math.min(brokerCount, 10)} Brokers 2025`,
      `Top ${categoryName} for 2025 — ${brokerCount} Brokers Reviewed`
    ];

    return templates[0]; // Use the first template for consistency
  }

  /**
   * Generate category intro paragraph
   */
  private generateCategoryIntro(
    categoryName: string,
    description: string,
    topBrokers: BrokerSummary[],
    totalCount: number
  ): string {
    const topBrokerNames = topBrokers.map(b => b.name).join(', ');
    const avgRating = topBrokers.length > 0 
      ? (topBrokers.reduce((sum, b) => sum + b.rating, 0) / topBrokers.length).toFixed(1)
      : '8.0';

    return `Looking for the best ${categoryName.toLowerCase()} in 2025? ${description} Our comprehensive analysis of ${totalCount} top-rated brokers reveals that ${topBrokerNames} lead the market with an average rating of ${avgRating}/10. These brokers offer competitive spreads, strong regulation, and advanced trading platforms. Compare features, fees, and regulations to find the perfect ${categoryName.toLowerCase().replace('brokers', 'broker')} for your trading needs.`;
  }

  /**
   * Generate country intro paragraph
   */
  private generateCountryIntro(
    countryName: string,
    topBrokers: BrokerSummary[],
    totalCount: number
  ): string {
    const topBrokerNames = topBrokers.map(b => b.name).join(', ');
    const avgRating = topBrokers.length > 0 
      ? (topBrokers.reduce((sum, b) => sum + b.rating, 0) / topBrokers.length).toFixed(1)
      : '8.0';

    const countrySpecific = this.getCountrySpecificInfo(countryName);

    return `Trading forex in ${countryName}? We've verified ${totalCount} top forex brokers that accept traders from ${countryName} in 2025. ${topBrokerNames} are our top-rated choices with an average rating of ${avgRating}/10. ${countrySpecific} All featured brokers offer ${this.getCountryFeatures(countryName)}, ensuring a safe and compliant trading experience for ${countryName} residents.`;
  }

  /**
   * Generate category-specific FAQs
   */
  private generateCategoryFAQs(categoryName: string, brokers: BrokerSummary[]): FAQ[] {
    const topBroker = brokers[0];
    const avgMinDeposit = brokers.length > 0 
      ? Math.round(brokers.reduce((sum, b) => sum + b.minDeposit, 0) / brokers.length)
      : 200;

    const faqs: FAQ[] = [
      {
        id: 'what-are',
        question: `What are ${categoryName}?`,
        answer: `${categoryName} are specialized trading platforms that ${this.getCategoryExplanation(categoryName)}. They typically offer ${this.getCategoryFeatures(categoryName)} to meet specific trading requirements.`
      },
      {
        id: 'best-broker',
        question: `Which is the best ${categoryName.toLowerCase().slice(0, -1)} in 2025?`,
        answer: topBroker 
          ? `${topBroker.name} is currently our top-rated ${categoryName.toLowerCase().slice(0, -1)} with a rating of ${topBroker.rating}/10. They offer ${topBroker.keyFeatures.join(', ')} and are regulated by ${topBroker.regulation}.`
          : `The best ${categoryName.toLowerCase()} depend on your specific trading needs, but our analysis shows brokers with strong regulation, competitive fees, and advanced platforms perform best.`
      },
      {
        id: 'how-to-choose',
        question: `How to choose the right ${categoryName.toLowerCase().slice(0, -1)}?`,
        answer: `When choosing ${categoryName.toLowerCase()}, consider: 1) Regulatory compliance and safety, 2) Trading costs (spreads and commissions), 3) Platform features and usability, 4) Minimum deposit requirements (average: $${avgMinDeposit}), 5) Customer support quality, and 6) Available trading instruments.`
      },
      {
        id: 'minimum-deposit',
        question: `What's the minimum deposit for ${categoryName.toLowerCase()}?`,
        answer: `Minimum deposits for ${categoryName.toLowerCase()} typically range from $${Math.min(...brokers.map(b => b.minDeposit))} to $${Math.max(...brokers.map(b => b.minDeposit))}, with an average of $${avgMinDeposit}. Some brokers offer no minimum deposit accounts for beginners.`
      }
    ];

    // Add category-specific FAQ
    const specificFAQ = this.getCategorySpecificFAQ(categoryName, brokers);
    if (specificFAQ) {
      faqs.push(specificFAQ);
    }

    return faqs;
  }

  /**
   * Generate country-specific FAQs
   */
  private generateCountryFAQs(countryName: string, brokers: BrokerSummary[]): FAQ[] {
    const topBroker = brokers[0];
    const regulations = [...new Set(brokers.map(b => b.regulation))].join(', ');

    return [
      {
        id: 'legal-status',
        question: `Is forex trading legal in ${countryName}?`,
        answer: `Yes, forex trading is legal in ${countryName}. ${this.getCountryLegalInfo(countryName)} Traders should choose regulated brokers that comply with local financial regulations.`
      },
      {
        id: 'best-broker-country',
        question: `Which is the best forex broker for ${countryName} traders?`,
        answer: topBroker 
          ? `${topBroker.name} is our top recommendation for ${countryName} traders, offering ${topBroker.keyFeatures.join(', ')} and regulation by ${topBroker.regulation}. They provide ${this.getCountrySpecificFeatures(countryName)}.`
          : `The best forex broker for ${countryName} traders depends on your trading style, but regulated brokers with local support and payment methods are recommended.`
      },
      {
        id: 'payment-methods',
        question: `What payment methods are available for ${countryName} traders?`,
        answer: `Forex brokers serving ${countryName} typically accept ${this.getCountryPaymentMethods(countryName)}. Processing times vary by method, with e-wallets usually offering the fastest deposits and withdrawals.`
      },
      {
        id: 'regulation',
        question: `What regulation should I look for as a ${countryName} trader?`,
        answer: `${countryName} traders should prioritize brokers regulated by ${regulations} or ${this.getPreferredRegulators(countryName)}. These regulators ensure client fund protection, fair trading practices, and dispute resolution mechanisms.`
      },
      {
        id: 'taxation',
        question: `How are forex trading profits taxed in ${countryName}?`,
        answer: `Forex trading taxation in ${countryName} ${this.getTaxationInfo(countryName)}. We recommend consulting with a local tax advisor for personalized advice on reporting trading income and capital gains.`
      }
    ];
  }

  /**
   * Generate category meta description
   */
  private generateCategoryMetaDescription(
    categoryName: string,
    brokerCount: number,
    topBroker?: BrokerSummary
  ): string {
    const topBrokerText = topBroker 
      ? `${topBroker.name} leads with ${topBroker.rating}/10 rating. ` 
      : '';

    return `Best ${categoryName} 2025: Compare ${brokerCount} top-rated brokers. ${topBrokerText}Expert analysis of fees, regulation & platforms. Updated daily.`.substring(0, 160);
  }

  /**
   * Generate country meta description
   */
  private generateCountryMetaDescription(
    countryName: string,
    brokerCount: number,
    topBroker?: BrokerSummary
  ): string {
    const topBrokerText = topBroker 
      ? `${topBroker.name} rated ${topBroker.rating}/10. ` 
      : '';

    return `Best forex brokers in ${countryName} 2025: ${brokerCount} verified brokers accepting ${countryName} traders. ${topBrokerText}Compare regulation, fees & features.`.substring(0, 160);
  }

  /**
   * Generate category keywords
   */
  private generateCategoryKeywords(categoryName: string, categorySlug: string): string[] {
    const base = [
      `best ${categoryName.toLowerCase()}`,
      `${categoryName.toLowerCase()} 2025`,
      `top ${categoryName.toLowerCase()}`,
      categorySlug.replace(/-/g, ' ')
    ];

    // Add category-specific keywords
    const specific = this.getCategorySpecificKeywords(categoryName);
    
    return [...base, ...specific];
  }

  /**
   * Generate country keywords
   */
  private generateCountryKeywords(countryName: string, countrySlug: string): string[] {
    return [
      `best forex brokers ${countryName.toLowerCase()}`,
      `forex brokers ${countryName.toLowerCase()} 2025`,
      `${countryName.toLowerCase()} forex trading`,
      `forex trading ${countryName.toLowerCase()}`,
      `regulated brokers ${countryName.toLowerCase()}`,
      countrySlug.replace(/-2025/g, '').replace(/-/g, ' ')
    ];
  }

  // Helper methods
  private async getCategoryInfo(categorySlug: string): Promise<any> {
    if (!this.supabase) return null;
    
    const { data, error } = await this.supabase
      .from('broker_categories')
      .select('*')
      .eq('slug', categorySlug)
      .single();
    
    return error ? null : data;
  }

  private getShortCategoryName(categoryName: string): string {
    return categoryName
      .replace('Top 10 ', '')
      .replace('Best ', '')
      .replace(' Brokers', '')
      .replace('Forex Brokers', 'FX Brokers');
  }

  private getCategoryExplanation(categoryName: string): string {
    const explanations: { [key: string]: string } = {
      'ECN Brokers': 'provide direct market access through electronic communication networks with transparent pricing',
      'STP Forex Brokers': 'use straight-through processing to route orders directly to liquidity providers',
      'MT4 Brokers': 'offer the MetaTrader 4 platform with expert advisors and automated trading capabilities',
      'MT5 Brokers': 'provide the advanced MetaTrader 5 platform with multi-asset trading and enhanced features',
      'Islamic Accounts': 'offer Sharia-compliant trading without swap interest charges',
      'Scalping Brokers': 'allow high-frequency trading strategies with tight spreads and fast execution'
    };

    return explanations[categoryName] || 'specialize in specific trading conditions and features';
  }

  private getCategoryFeatures(categoryName: string): string {
    const features: { [key: string]: string } = {
      'ECN Brokers': 'transparent pricing, deep liquidity, and institutional-grade execution',
      'MT4 Brokers': 'expert advisors, custom indicators, and automated trading tools',
      'Islamic Accounts': 'swap-free trading, Sharia compliance, and halal investment options',
      'Scalping Brokers': 'ultra-tight spreads, instant execution, and no scalping restrictions'
    };

    return features[categoryName] || 'competitive spreads, reliable platforms, and professional tools';
  }

  private getCategorySpecificFAQ(categoryName: string, brokers: BrokerSummary[]): FAQ | null {
    if (categoryName.includes('Islamic')) {
      return {
        id: 'swap-free',
        question: 'Do Islamic accounts have any trading restrictions?',
        answer: 'Islamic accounts are swap-free but may have slightly wider spreads to compensate for the eliminated overnight charges. Most brokers offer the same trading conditions otherwise, including access to all major currency pairs and trading platforms.'
      };
    }

    if (categoryName.includes('ECN')) {
      return {
        id: 'ecn-vs-stp',
        question: 'What\'s the difference between ECN and STP brokers?',
        answer: 'ECN brokers provide direct market access with order book visibility and potential price improvement, while STP brokers route orders to liquidity providers without requotes. ECN typically offers tighter spreads but may charge commissions.'
      };
    }

    return null;
  }

  private getCategorySpecificKeywords(categoryName: string): string[] {
    const keywords: { [key: string]: string[] } = {
      'ECN Brokers': ['electronic communication network', 'ecn forex', 'direct market access', 'institutional trading'],
      'MT4 Brokers': ['metatrader 4', 'mt4 platform', 'expert advisors', 'automated trading'],
      'Islamic Accounts': ['swap free', 'sharia compliant', 'halal trading', 'islamic forex'],
      'Scalping Brokers': ['scalping allowed', 'tight spreads', 'fast execution', 'high frequency trading']
    };

    return keywords[categoryName] || [];
  }

  // Country-specific helper methods
  private getCountrySpecificInfo(countryName: string): string {
    const info: { [key: string]: string } = {
      'United Kingdom': 'With FCA regulation ensuring the highest standards,',
      'United States': 'Under strict CFTC and NFA oversight,',
      'Australia': 'Protected by ASIC regulation,',
      'Germany': 'Regulated by BaFin for maximum security,',
      'Singapore': 'Under MAS supervision for institutional-grade protection,',
      'Japan': 'With JFSA regulation ensuring compliance,'
    };

    return info[countryName] || 'With proper regulatory oversight,';
  }

  private getCountryFeatures(countryName: string): string {
    return 'local payment methods, native language support, and compliance with local financial regulations';
  }

  private getCountryLegalInfo(countryName: string): string {
    const info: { [key: string]: string } = {
      'United Kingdom': 'The FCA regulates forex trading, ensuring robust consumer protection.',
      'United States': 'The CFTC and NFA strictly regulate retail forex, with specific leverage limits.',
      'Australia': 'ASIC oversees forex brokers, providing strong investor protections.',
      'Singapore': 'MAS regulates forex trading for both retail and accredited investors.'
    };

    return info[countryName] || 'Local financial authorities oversee forex trading activities.';
  }

  private getCountrySpecificFeatures(countryName: string): string {
    return 'local customer support, familiar payment methods, and regulatory compliance';
  }

  private getCountryPaymentMethods(countryName: string): string {
    const methods: { [key: string]: string } = {
      'United Kingdom': 'bank transfers, debit/credit cards, PayPal, Skrill, and Neteller',
      'United States': 'ACH transfers, wire transfers, and major credit/debit cards',
      'Australia': 'bank transfers, POLi, credit cards, and PayPal',
      'Germany': 'SEPA transfers, Sofort, credit cards, and various e-wallets'
    };

    return methods[countryName] || 'bank transfers, credit/debit cards, and popular e-wallets';
  }

  private getPreferredRegulators(countryName: string): string {
    const regulators: { [key: string]: string } = {
      'United Kingdom': 'FCA (UK)',
      'United States': 'CFTC and NFA (US)',
      'Australia': 'ASIC (Australia)',
      'Germany': 'BaFin (Germany)',
      'Singapore': 'MAS (Singapore)'
    };

    return regulators[countryName] || 'reputable international regulators like FCA, ASIC, or CySEC';
  }

  private getTaxationInfo(countryName: string): string {
    const taxation: { [key: string]: string } = {
      'United Kingdom': 'may be subject to capital gains tax, with annual exemptions available.',
      'United States': 'are generally taxed as ordinary income or capital gains depending on holding period.',
      'Australia': 'may be taxed as capital gains or ordinary income based on trading frequency.',
      'Germany': 'are subject to capital gains tax with potential exemptions after 12 months.'
    };

    return taxation[countryName] || 'varies by jurisdiction and individual circumstances.';
  }
}

// Export singleton instance
let contentGenerator: ContentGenerator | null = null;

export function getContentGenerator(): ContentGenerator {
  if (!contentGenerator) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    contentGenerator = new ContentGenerator(supabaseUrl, supabaseKey);
  }
  return contentGenerator;
}