import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { BookOpen, Lightbulb, Target, TrendingUp } from 'lucide-react';
import JsonLdSchema, { createFAQSchema, createHowToSchema } from '../common/JsonLdSchema';

interface GenerativeEngineSEOProps {
  title: string;
  description: string;
  content: string;
  keyTakeaways: string[];
  faqs: Array<{ question: string; answer: string }>;
  howToSteps?: Array<{ name: string; text: string; url?: string }>;
  internalLinks: Array<{ text: string; url: string }>;
  citations: Array<{ text: string; url: string; author?: string; date?: string }>;
  canonicalUrl: string;
}

const GenerativeEngineSEO: React.FC<GenerativeEngineSEOProps> = ({
  title,
  description,
  content,
  keyTakeaways,
  faqs,
  howToSteps,
  internalLinks,
  citations,
  canonicalUrl
}) => {
  // Generate structured data for AI understanding
  const structuredData = [
    createFAQSchema(faqs),
    ...(howToSteps ? [createHowToSchema({
      name: title,
      description,
      steps: howToSteps
    })] : [])
  ];

  return (
    <>
      {/* Structured Data for AI */}
      {structuredData.map((schema, index) => (
        <JsonLdSchema
          key={index}
          data={schema}
          type="faq"
          id={`generative-seo-${index}`}
        />
      ))}

      {/* Key Takeaways Section - AI Optimized */}
      {keyTakeaways.length > 0 && (
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Lightbulb className="h-5 w-5" />
              Key Takeaways
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {keyTakeaways.map((takeaway, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100"
                >
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 mt-0.5">
                    {index + 1}
                  </Badge>
                  <p className="text-sm text-gray-700 leading-relaxed">{takeaway}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Section - AI Optimized */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-l-4 border-blue-500 pl-4 py-2"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <h3
                  className="font-semibold text-lg mb-2 text-gray-900"
                  itemProp="name"
                >
                  {faq.question}
                </h3>
                <div
                  className="text-gray-700 leading-relaxed"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <p itemProp="text">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How-To Section */}
      {howToSteps && howToSteps.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Step-by-Step Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {howToSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                  itemScope
                  itemProp="step"
                  itemType="https://schema.org/HowToStep"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <h4
                      className="font-semibold text-gray-900 mb-1"
                      itemProp="name"
                    >
                      {step.name}
                    </h4>
                    <p
                      className="text-gray-700"
                      itemProp="text"
                    >
                      {step.text}
                    </p>
                    {step.url && (
                      <a
                        href={step.url}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                        itemProp="url"
                      >
                        Learn more →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Internal Links Section */}
      {internalLinks.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Related Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {internalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  <p className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    {link.text}
                  </p>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Citations Section */}
      {citations.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Sources & Citations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {citations.map((citation, index) => (
                <div key={index} className="border-l-4 border-gray-300 pl-4">
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    {citation.text}
                  </a>
                  {(citation.author || citation.date) && (
                    <p className="text-gray-600 text-xs mt-1">
                      {citation.author && `By ${citation.author}`}
                      {citation.author && citation.date && ' • '}
                      {citation.date}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default GenerativeEngineSEO;