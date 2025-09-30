import React from 'react';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQBlockProps {
  faqs: FAQ[];
  title?: string;
  className?: string;
}

const FAQBlock: React.FC<FAQBlockProps> = ({ 
  faqs, 
  title = "Frequently Asked Questions",
  className = ""
}) => {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white ${className}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {title}
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                {faq.question}
              </h3>
              <div 
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQBlock;