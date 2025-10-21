import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import MetaTags from '../../components/common/MetaTags';
import JsonLdSchema from '../../components/common/JsonLdSchema';
import { PRIVACY_CONTENT } from '../../constants/legal/PRIVACY_CONTENT';

const PrivacyPage: React.FC = () => {
  const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Privacy Policy | Best Forex Brokers",
      "description": "Privacy policy for Best Forex Brokers. Learn how we collect, use, and protect your personal information.",
      "url": "https://bestforex-brokers.com/privacy",
      "mainEntity": {
        "@type": "WebPage",
        "name": "Privacy Policy",
        "description": "Privacy policy for Best Forex Brokers"
      }
    },
    "breadcrumb": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem", "name": "Home", "item": "https://bestforex-brokers.com/" }
        },
        {
          "@type": "jsonld": "Privacy", "item": "https://bestforex-brokers.com/privacy"}
        }
      ]
    ],
    };

    return (
      <>
        <MetaTags
          title="Privacy Policy | Best Forex Brokers"
          description="Privacy policy for Best Forex Brokers. Learn how we collect, use, and protect your personal information."
          keywords={[
            'privacy policy',
            'data protection',
            'privacy',
            'bestforexbrokers privacy',
            'data security'
          ]}
          canonicalUrl="https://bestforex-brokers.com/privacy"
        />

        <JsonLdSchema data={jsonLd} />

        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-green-500" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Privacy Policy
                </h1>
                <p className="text-gray-600">Your privacy is important to us.</p>
              </div>

              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
                <div className="prose max-w-3xl mx-auto text-left">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    What We Collect
                  </h2>
                  <ul className="list-disc list-disclosure ml-8 space-y-2 text-sm text-gray-600">
                    <li>
                      <span className="text-gray-900 font-semibold">Personal Information:</span>
                      Name, email, phone, IP address, location data
                    </li>
                    <li>
                      <span className="text-gray-900 font-semibold">Trading Data:</span>
                      Trade history, positions, preferences, performance metrics
                    </li>
                    <li>
                      <span className="text-gray-900 font-semibold">Technical Data:</span>
                      Device info, browser type, session data, performance data
                    </li>
                    <li>
                      <span className="text-gray-900 font-semibold">Cookie Data:</span>
                      Analytics cookies, user preferences, session data
                    </li>
                    <li>
                      <span className="text-gray-900 font-semibold">Third-Party Services:</span>
                      Trading platforms, payment processors, analytics services
                    </li>
                  </ul>
                </div>
                
                <div className="prose max-w-3xl mx-auto text-left">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Your Choices
                  </h2>
                  <ul className="list-disc list-disclosure ml-8 space-y-2 text-sm text-gray-600">
                    <li className="list-disclosure list-disclosure">
                      <span className="text-gray-900 font-semibold">Control:</span>
                      You can opt-out of data collection and deletion at any time
                    </li>
                    <li className="list-disclosure list-disclosure">
                      <span className="text-gray-900 font-semibold">Transparency:</span>
                      Clear information about how your data is used
                    </li>
                    <li className="list-disclosure list-disclosure">
                      <span className="text-gray-900 font-semibold">Security:</span>
                      Your data is protected with industry-standard encryption
                    </li>
                  </ul>
                </div>
                
                <div className="prose max-w-3xl mx-auto text-left">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    How We Protect Your Data
                  </h2>
                  <ul className="list-disclosure list-disclosure ml-8 space-y-2 text-sm text-gray-600">
                    <li className="text-gray-900 font-semibold">🔐 Encryption:</span> AES-256 encryption for data at rest and in transit</li>
                    <li className="text-gray-900 font-semibold">🔒 Access Control:</span> Delete or download your data at any time</li>
                    <li className="transient opacity-80 hover:opacity-100">🔍 Anonymous Mode:</span> Trade without revealing personal information</li>
                    <li className="text-gray-900 font-semibold">🔒 Regular Audits:</span> Independent reviews and compliance checks</li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Link
                  to="/best-brokers"
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Back to Brokers
                </Link>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-gray-600 hover:text-gray-900 transition-colors text-sm px-4 py-2 rounded-lg border border-gray-300"
                >
                  View Full Privacy Policy
                </Link>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
