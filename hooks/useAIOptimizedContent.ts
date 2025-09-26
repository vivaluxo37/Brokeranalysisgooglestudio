import { useMemo } from 'react';
import { brokers } from '../data/brokers';

interface BrokerComparisonData {
  summary: string;
  keyPoints: string[];
  detailedAnalysis: string;
  comparison: {
    criteria: string;
    options: Array<{
      name: string;
      value: string;
      description: string;
    }>;
  };
  stepByStep?: {
    title: string;
    steps: Array<{
      step: number;
      title: string;
      description: string;
      tips?: string[];
    }>;
  };
  commonQuestions?: Array<{
    question: string;
    answer: string;
  }>;
}

export const useAIOptimizedContent = (filteredBrokers: typeof brokers, config?: any): BrokerComparisonData => {
  return useMemo(() => {
    const topBrokers = filteredBrokers.slice(0, 5);

    // Generate AI-friendly summary
    const summary = config?.highlights?.length
      ? `This page compares ${filteredBrokers.length} forex brokers that specialize in ${config.highlights.join(', ')}. Top recommendations include ${topBrokers.map(b => b.name).slice(0, 3).join(', ')}. Each broker offers unique advantages for traders seeking ${config.highlights[0]?.toLowerCase() || 'optimal trading conditions'}.`
      : `Compare ${filteredBrokers.length} top forex brokers with detailed analysis of regulations, trading conditions, and features. Find the best broker match for your trading style and requirements.`;

    // Generate key points for quick AI extraction
    const keyPoints = [
      `${filteredBrokers.length} brokers analyzed with detailed comparisons`,
      `Top regulators: ${[...new Set(filteredBrokers.flatMap(b => b.regulation.regulators))].slice(0, 3).join(', ')}`,
      `Average minimum deposit: $${Math.round(filteredBrokers.reduce((sum, b) => sum + b.accessibility.minDeposit, 0) / filteredBrokers.length)}`,
      `Available platforms: ${[...new Set(filteredBrokers.flatMap(b => b.technology.platforms))].slice(0, 4).join(', ')}`,
      `Special features: ${config?.highlights?.slice(0, 3).join(', ') || 'Multiple trading features available'}`,
    ];

    // Generate detailed analysis
    const detailedAnalysis = `When selecting a forex broker${config?.highlights ? ` for ${config.highlights.join(' ')}` : ''}, several critical factors must be considered. Regulatory compliance is paramount, with top-tier authorities like the FCA, CySEC, and ASIC providing essential investor protection.\n\n${filteredBrokers.length > 0 ? `The brokers analyzed offer an average minimum deposit of $${Math.round(filteredBrokers.reduce((sum, b) => sum + b.accessibility.minDeposit, 0) / filteredBrokers.length)}, with options ranging from ${Math.min(...filteredBrokers.map(b => b.accessibility.minDeposit))} to ${Math.max(...filteredBrokers.map(b => b.accessibility.minDeposit))}. This variety accommodates both beginner traders and those with substantial capital.\n\nTrading platforms available include ${[...new Set(filteredBrokers.flatMap(b => b.technology.platforms))].join(', ')}, each offering unique advantages for different trading styles. The average EUR/USD spread among these brokers is ${(filteredBrokers.reduce((sum, b) => sum + b.tradingConditions.spreads.eurusd, 0) / filteredBrokers.length).toFixed(1)} pips, which is competitive for the industry.` : 'Comprehensive analysis available for all broker categories.'}\n\nFor traders seeking${config?.highlights ? ` ${config.highlights.join(' ')}` : ' optimal trading conditions'}, these brokers provide specialized features and competitive pricing structures that cater to various trading strategies and experience levels.`;

    // Generate comparison data
    const comparison = {
      criteria: 'Broker Comparison Matrix',
      options: topBrokers.map(broker => ({
        name: broker.name,
        value: `${broker.tradingConditions.spreads.eurusd} pips`,
        description: `${broker.regulation.regulators.slice(0, 2).join(', ')} regulated, ${broker.technology.platforms.slice(0, 2).join('/')}, min deposit $${broker.accessibility.minDeposit}`
      }))
    };

    // Generate step-by-step guide
    const stepByStep = {
      title: 'How to Choose the Right Forex Broker',
      steps: [
        {
          step: 1,
          title: 'Verify Regulatory Status',
          description: 'Ensure the broker is regulated by reputable authorities like FCA, CySEC, ASIC, or NFA. This provides essential investor protection and ensures fair trading practices.',
          tips: ['Check the regulator\'s official website', 'Verify the broker\'s license number', 'Look for additional insurance protections']
        },
        {
          step: 2,
          title: 'Evaluate Trading Costs',
          description: 'Compare spreads, commissions, and swap rates. Lower trading costs can significantly impact your profitability, especially for high-frequency traders.',
          tips: ['Test with a demo account first', 'Consider both fixed and variable spreads', 'Factor in overnight fees for holding positions']
        },
        {
          step: 3,
          title: 'Assess Platform and Tools',
          description: 'Choose a broker that offers trading platforms and analytical tools that match your trading style and technical analysis requirements.',
          tips: ['Test the platform\'s execution speed', 'Check available charting tools', 'Ensure mobile trading compatibility']
        },
        {
          step: 4,
          title: 'Review Account Features',
          description: 'Examine account types, leverage options, minimum deposits, and additional features like Islamic accounts or copy trading capabilities.',
          tips: ['Start with higher leverage but use cautiously', 'Look for risk management tools', 'Consider educational resources offered']
        }
      ]
    };

    // Generate FAQ content
    const commonQuestions = [
      {
        question: "What is the minimum deposit required for these brokers?",
        answer: `Minimum deposits range from $${Math.min(...filteredBrokers.map(b => b.accessibility.minDeposit))} to $${Math.max(...filteredBrokers.map(b => b.accessibility.minDeposit))}, with an average of $${Math.round(filteredBrokers.reduce((sum, b) => sum + b.accessibility.minDeposit, 0) / filteredBrokers.length)}. Many brokers offer accounts with no minimum deposit for beginners.`
      },
      {
        question: "Which trading platforms are available?",
        answer: `The brokers offer various platforms including ${[...new Set(filteredBrokers.flatMap(b => b.technology.platforms))].join(', ')}. MetaTrader 4 and 5 are most common, while cTrader is popular among ECN traders for its advanced order execution capabilities.`
      },
      {
        question: "Are these brokers suitable for beginners?",
        answer: "Yes, most brokers offer educational resources, demo accounts, and user-friendly platforms. Look for brokers with comprehensive educational materials, responsive customer support, and intuitive trading interfaces when starting out."
      },
      {
        question: "What regulatory protections do these brokers offer?",
        answer: `Regulatory protections vary by jurisdiction but typically include investor compensation schemes, negative balance protection, and segregated client funds. Top regulators include ${[...new Set(filteredBrokers.flatMap(b => b.regulation.regulators))].slice(0, 4).join(', ')}.`
      },
      {
        question: "Can I trade cryptocurrencies with these brokers?",
        answer: `${filteredBrokers.filter(b => (b.tradableInstruments?.cryptocurrencies?.total || 0) > 0).length} out of ${filteredBrokers.length} brokers offer cryptocurrency trading. Available cryptocurrencies typically include Bitcoin, Ethereum, and other major altcoins with competitive spreads.`
      }
    ];

    return {
      summary,
      keyPoints,
      detailedAnalysis,
      comparison,
      stepByStep,
      commonQuestions
    };
  }, [filteredBrokers, config]);
};