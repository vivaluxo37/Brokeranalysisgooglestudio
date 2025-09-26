import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import JsonLdSchema, { createFAQSchema } from '../common/JsonLdSchema';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  faqs: FAQItem[];
  className?: string;
  showSchema?: boolean;
}

const FAQSection: React.FC<FAQSectionProps> = ({
  title = "Frequently Asked Questions",
  faqs,
  className = "",
  showSchema = true
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (question: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(question)) {
      newOpenItems.delete(question);
    } else {
      newOpenItems.add(question);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className={`faq-section ${className}`}>
      {showSchema && (
        <JsonLdSchema
          data={createFAQSchema(faqs)}
          type="faq"
          id="faq-schema"
        />
      )}

      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-blue-300"
            >
              <button
                onClick={() => toggleItem(faq.question)}
                className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200"
                aria-expanded={openItems.has(faq.question)}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openItems.has(faq.question) ? (
                  <ChevronDown className="h-5 w-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openItems.has(faq.question) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pre-built FAQ data templates
export const BrokerFAQs: FAQItem[] = [
  {
    question: "What makes a good forex broker?",
    answer: "A good forex broker should be regulated by top-tier authorities like the FCA, ASIC, or NFA, offer competitive spreads and commissions, provide reliable trading platforms, have excellent customer support, and maintain strong security measures for client funds."
  },
  {
    question: "How much money do I need to start forex trading?",
    answer: "The minimum deposit varies by broker, ranging from $0 to $1000. However, it's recommended to start with at least $500-$1000 to properly manage risk and have enough margin for realistic trading positions."
  },
  {
    question: "Are forex brokers safe?",
    answer: "Reputable forex brokers regulated by top-tier authorities are generally safe. Look for brokers that keep client funds in segregated accounts, offer negative balance protection, and have investor compensation schemes."
  },
  {
    question: "What is the difference between ECN and STP brokers?",
    answer: "ECN (Electronic Communication Network) brokers provide direct market access with ultra-tight spreads but charge commissions. STP (Straight Through Processing) brokers route orders to liquidity providers but typically have wider spreads with no commission."
  },
  {
    question: "Can I make money with forex trading?",
    answer: "While it's possible to make money forex trading, it's also very risky and requires significant education, practice, and risk management. Most retail traders lose money, especially when starting out."
  }
];

export const TradingEducationFAQs: FAQItem[] = [
  {
    question: "What is forex trading?",
    answer: "Forex (foreign exchange) trading involves buying and selling currencies to profit from changes in their exchange rates. It's the largest financial market in the world, with over $6 trillion traded daily."
  },
  {
    question: "What leverage should beginners use?",
    answer: "Beginners should start with low leverage (1:10 to 1:50 maximum). While higher leverage is available, it significantly increases risk and can lead to rapid account depletion."
  },
  {
    question: "How do I choose a trading strategy?",
    answer: "Choose a trading strategy that matches your personality, available time, and risk tolerance. Consider factors like time frame (scalping, day trading, swing trading), technical indicators, and fundamental analysis approach."
  },
  {
    question: "What are pips in forex trading?",
    answer: "A pip (percentage in point) is the smallest price move that a currency pair can make. For most pairs, it's 0.0001, or 1/100th of a cent. Pips are used to measure price movements and calculate profits/losses."
  },
  {
    question: "How important is risk management?",
    answer: "Risk management is crucial for long-term trading success. Key principles include never risking more than 1-2% of your account on a single trade, using stop-loss orders, and maintaining proper position sizing."
  }
];

export default FAQSection;