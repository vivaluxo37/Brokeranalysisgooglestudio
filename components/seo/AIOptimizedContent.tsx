import React from 'react';
import FAQSection, { BrokerFAQs } from './FAQSection';

interface FAQItem {
  question: string;
  answer: string;
}
import AIStructuredData from './AIStructuredData';
import { useAIStructuredData } from '../../hooks/useAIStructuredData';

interface AIOptimizedContentProps {
  title: string;
  description: string;
  content: {
    summary: string;
    keyPoints: string[];
    detailedAnalysis: string;
    comparison?: {
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
    commonQuestions?: FAQItem[];
  };
  structuredData?: any;
  brokers?: any[];
  config?: any;
}

const AIOptimizedContent: React.FC<AIOptimizedContentProps> = ({
  title,
  description,
  content,
  structuredData,
  brokers = [],
  config
}) => {
  // Generate AI-specific structured data for enhanced LLM understanding
  const aiStructuredData = useAIStructuredData(brokers, config);
  return (
    <article className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Structured Data for AI understanding */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* AI-Specific Structured Data */}
      {brokers.length > 0 && (
        <AIStructuredData content={aiStructuredData} />
      )}

      {/* Header with clear semantic structure */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </header>

      {/* AI-Optimized Summary Section */}
      <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900 dark:text-blue-100">
          Summary
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-800 dark:text-gray-200">
            {content.summary}
          </p>
        </div>
      </section>

      {/* Key Points for Quick AI Extraction */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Key Points
        </h2>
        <ul className="space-y-3">
          {content.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                ✓
              </span>
              <span className="text-gray-700 dark:text-gray-300">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Detailed Analysis */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Detailed Analysis
        </h2>
        <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
          {content.detailedAnalysis.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Comparison Table for AI-Friendly Data */}
      {content.comparison && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            {content.comparison.criteria}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Option
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {content.comparison.options.map((option, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {option.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {option.value}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {option.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Step-by-Step Guide */}
      {content.stepByStep && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            {content.stepByStep.title}
          </h2>
          <div className="space-y-6">
            {content.stepByStep.steps.map((step) => (
              <div key={step.step} className="flex space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {step.description}
                  </p>
                  {step.tips && step.tips.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                        Pro Tips:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section for AI Q&A */}
      {content.commonQuestions && content.commonQuestions.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {content.commonQuestions.map((faq, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI-Ready Metadata */}
      <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>This content is optimized for AI search engines and large language models.</p>
          <p>Last updated: {new Date().toISOString().split('T')[0]}</p>
        </div>
      </footer>
    </article>
  );
};

export default AIOptimizedContent;