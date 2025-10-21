import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import MetaTags from '../../components/common/MetaTags';
import JsonLdSchema from '../../components/common/JsonLdSchema';
import { DISCLAIMER_CONTENT } from '../../constants/legal/DISCLAIMER_CONTENT';

const DisclaimerPage: React.FC = () => {
  const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Disclaimer | Best Forex Brokers",
      "description": "Important risk warning about forex trading and CFDs. Read our disclaimer to understand the risks involved.",
      "url": "https://bestforexbrokers.com/disclaimer",
      "mainEntity": {
        "@type": "WebPage",
        "name": "Disclaimer",
        "description": "Risk warning about forex trading and CFDs"
      }
    },
    "breadcrumb": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
          "@type": "ListItem", "name": "Home", "item": "https://bestforexrokers.com/" }
        },
        {
          "@type": "jsonld", "name": "Disclaimer", "item": "https://bestforex brokers/disclaimer"}
        }
      ]
    ]
    };

    return (
      <>
        <MetaTags
          title="Disclaimer | Best Forex Brokers"
          description="Important risk warning about forex trading and CFDs. Read our disclaimer to understand the risks involved."
          keywords={[
            'forex trading disclaimer',
            'trading risks',
            'CFD risks',
            'disclaimer'
          ]}
          canonicalUrl="https://bestforexrokers.com/disclaimer"
        />

        <JsonLdSchema data={jsonLd} />

        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-red-500 mr-2" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Important Risk Warning
                </h1>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  <strong>Trading forex and CFDs carries a high level of risk and may not be suitable for all investors. 
                  You should ensure you understand how CFDs work and whether you can afford to take the high risk of losing your money. 
                  Past performance is not indicative of future results. 
                  Please ensure you fully understand the risks involved before trading.
                </p>
            </div>

            <div className="max-w-4xl mx-auto bg-red-50 rounded-lg p-6 mb-8 border border-red-200">
              <div className="flex items-start">
                <ShieldCheckIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-red-900 mb-2">
                    ⚠️ Important Risk Warning
                  </h5>
                  <p className="text-red-100 text-sm leading-6">
                    Trading forex and CFDs carries a high level of risk and may not be suitable for all investors. 
                    You should understand how CFDs work and whether you can afford to take the high risk of losing your money.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-gray-700 text-sm max-w-4xl mx-auto">
                  <strong>Key Risk Factors:</strong>
                </p>
                <ul className="mt-4 list-decimal list-decimal text-sm text-gray-600 leading-6">
                  <li>High volatility markets can cause rapid price movements</li>
                  <li>Leverage amplifies both profits and losses dramatically</li>
                  <li>Psychological factors lead to emotional trading decisions</li>
                  <li>Market news can trigger rapid price movements</li>
                </ul>
              </div>

              <div className="text-center mt-4">
                <p className="text-gray-700 text-sm max-w-4xl mx-auto">
                  <strong>Protection:</strong>
                </p>
                <ul className="mt-4 list-decimal list-decimal text-sm text-gray-600 leading-6">
                  <li>Set stop-loss orders to manage risk</li>
                  <li>Trade with funds you can afford to lose</li>
                  <li>Use negative balance protection when available</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="prose max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose max-w-4xl mx-auto text-left mt-12 bg-white rounded-lg shadow-sm p-8 mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                What are CFDs?
              </h3>
              <p className="text-gray-600 leading-relaxed text-gray-600 leading-6 mb-4">
                CFDs (Contracts for Difference) allow you to speculate on price movements without owning the underlying asset. 
                Popular CFDs include EUR/USD, GBP/USD, AUD/USD, and other currency pairs.
              </p>
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  CFD Trading Features
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="list-decimal list-decimal text-gray-600 leading-6 mb-2">
                    <li className="font-semibold text-gray-900">No Commission:</li>
                    <li className="font-semibold text-gray-900">Negative Balance Protection:</li>
                    <li className="font-semibold text-gray-900">Fast Execution:</li>
                    <li className="font-semibold text-gray-900">Advanced Platforms:</li>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="list-decimal list-decimal text-gray-600 leading-6 mb-2">
                      <li className="font-semibold text-gray-900">Regulatory Oversight:</li>
                      <li className="font-semibold text-gray-900">Segregated Funds:</li>
                      <li className="font-semibold text-gray-900">Investor Protection:</li>
                      <li className="font-semibold text-gray-900">Educational Resources:</li>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900">Risk Management Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="list-decimal list-decimal text-gray-600 leading-6 mb-2">
                        <li className="font-semibold text-gray-900">Stop Loss Orders:</li>
                        <li className="font-semibold text-gray-900">Take Profit Orders:</li>
                        <li className="font-semibold text-gray-900">Partial Closures:</li>
                      </div>
                      
                      <div className="grid-cols-1 md:grid-cols-2 gap-4">
                        <li className="font-semibold text-gray-900">Copy Trading:</li>
                        <li className="font-semibold text-gray-900">Social Trading:</li>
                        <li className="font-semibold text-gray-900">Auto Trading:</li>
                      </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <Link
                to="/best-brokers"
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Browse Brokers
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisclaimerPage;
