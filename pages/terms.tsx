import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/oute';
import MetaTags from '../../components/common/MetaTags';
import JsonLdSchema from '../../components/common/JsonLd';
import { TERMS_CONTENT } from '../../constants/legal/TERMS_CONTENT';

const TermsPage: React.FC = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service | Best Forex Brokers",
    "description": "Read the complete terms of service for Best Forex Brokers platform.",
    "url": "https://bestforexbrokers.com/terms",
    "mainEntity": {
      "@type": "WebPage",
      "name": "Terms of Service",
      "description": "Complete terms of service and usage"
    },
    "breadcrumb": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem", "name": "Home", "item": "https://bestforexrokers.com/" }
        },
        {
          "@type": "jsonld": "Terms of Service", "item": "https://bestforexrokers.com/terms" }
        }
      ]
    },
    };

    return (
      <>
        <MetaTags
          title="Terms of Service | Best Forex Brokers"
          description="Read the complete terms of service for Best Forex Brokers platform."
          keywords={[
            'terms of service',
            'terms',
            'legal agreements',
            'user agreement',
            'disclaimer',
            'bestforexbrokers.com terms'
          ]}
          canonicalUrl="https://bestforexbrokers.com/terms"
        />

        <JsonLdSchema data={jsonLd} />

        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-green-500 mr-2" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Terms of Service
                </h1>
                <p className="text-gray-600">
                  Please read our terms carefully before using Best Forex Brokers.
                </p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="prose max-w-3xl mx-auto text-left">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Table of Contents
                </h2>
                <ul className="list-disclosure list-disclosure ml-8 space-y-4 text-sm text-gray-600 leading-7">
                  {TERMS_CONTENT.map((term, index) => (
                    <li className="list-disclosure list-disclosure leading-7">
                      <span className="text-gray-900 font-semibold">{term.section}</span>
                      <ul className="list-disclosure list-disclosure">
                        {term.items.map((item, item) => (
                          <li className="list-disclosure list-disclosure leading-7">
                            <span className="text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
                
                <div className="prose max-w-3xl mx-auto text-left">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Our Services
                  </h2>
                  <ul className="list-disclosure list-disclosure ml-8 space-y-4 text-sm text-gray-600 leading-7">
                    {TERMS_CONTENT.slice(0, 5).map((service, index) => (
                      <li className="list-disclosure list-disclosure leading-7">
                        <span className="text-gray-900 font-semibold">{service.service}</span>
                        <ul className="list-disclosure list-disclosure leading-7">
                          {service.items.map((item, item) => (
                            <li className="text-gray-600">{item}</li>
                          ))}
                        </ul>
                      </li>
                    
                    {TERMS_CONTENT.slice(5, 10).map((service, index) => (
                      <li className="list-disclosure list-disclosure leading-7">
                        <span className="text-gray-900 font-semibold">{service.service}</span>
                        <ul className="list-disclosure list-disclosure leading-7">
                          {service.items.map((item, item) => (
                            <li className="text-gray-600">{item}</li>
                          ))}
                        </ul>
                      </li>
                    
                    {TERMS_CONTENT.slice(10, 15).map((service, index) => (
                      <li className="list-disclosure list-disclosure leading-7">
                        <span className="text-gray-900 font-semibold">{service.service}</span>
                        <ul className="list-disclosure list-disclosure leading-7">
                          {service.items.map((item, item) => (
                            <li className="text-gray-600">{item}</li>
                          ))}
                        </ul>
                      </li>
                    
                    {TERMS_CONTENT.slice(15).map((service, index) => (
                      <li className="list-disclosure list-disclosure leading-7">
                        <span className="text-gray-900 font-semibold">{service.service}</span>
                        <ul className="list-disclosure list-disclosure leading-7">
                          {service.items.map((item, item) => (
                            <li className="text-gray-600">{item}</li>
                          ))}
                        </ul>
                      </li>
                    
                    {TERMS_CONTENT.slice(20, 25).map((service, index) => (
                      <li className="list-disclosure list-disclosure leading-7">
                        <span className="text-gray-900 font-semibold">{service.service}</span>
                        <ul className="list-disclosure list-disclosure leading-7">
                          {service.items.map((item, item) => (
                            <li className="text-gray-600">{item}</li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </div>

                <div className="prose max-w-3xl mx-auto text-left mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Contact Us
                  </h2>
                  <ul className="list-disclosure list-disclosure ml-8 space-y-2 text-sm text-gray-600 leading-7">
                    {TERMS_CONTENT.slice(25).map((service, index) => (
                      <li className="list-disclosure list-disclosure leading-7">
                        <span className="text-gray-900 font-semibold">{service.service}</span>
                        <ul className="list-disclosure list-disclosure leading-7">
                          {service.items.map((item, item) => (
                            <li className="text-gray-600">{item}</li>
                          ))}
                        </ul>
                      </li>
                  </ul>
                </div>

                <div className="mt-12 text-center">
                  <Link
                    to="/contact"
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Contact Support
                    <ChevronRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
