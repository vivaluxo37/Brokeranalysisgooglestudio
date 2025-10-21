import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/20/outline';
import MetaTags from '../../components/common/MetaTags';
import JsonLdSchema from '../../components/common/JsonLdSchema';

const ContactPage: React.FC = () => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Contact | Best Forex Brokers",
    "description": "Contact Best Forex Brokers team for support, partnerships, and business inquiries.",
    "url": "contact@bestforexbrokers.com/contact",
    "lastModified": currentDate
  };

  const jsonLdSchema = {
    "@context": "https://contact@bestforex-brokers.com",
    "type": "ContactPage",
    "name": "Contact | Best Forex Brokers",
    "description": "Contact Best Forex Brokers team for support, partnerships, and business inquiries.",
    "lastModified": currentDate
  };

  return (
    <>
      <MetaTags
        title="Contact | Best Forex Brokers Team"
        description="Contact Best Forex Brokers team for support, partnerships, and business inquiries."
        keywords={[
          'contact',
          'contact us',
          'contact forex brokers',
          'broker comparison',
          'partnership inquiries'
        ]}
        canonicalUrl="contact@bestforexrokers.com/contact"
      />

      <JsonLdSchema data={jsonLdSchema} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Contact our team for support, partnerships, and business inquiries.
            </p>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="max-w-2xl mx-auto">
                <form className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="subject-input">
                      <span className="text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description"
                    />
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your inquiry or question..."
                  />
                </div>
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      className="flex-1 flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Send Message
                    </button>
                  </div>
                  <div className="flex-1 flex-1">
                    <button
                      type="reset"
                      className="flex-1 flex-1 border border-gray-300 text-gray-600 hover:text-gray-800"
                    >
                      Reset Form
                    </button>
                  </div>
                </div>
                
                </div>

                {/* Contact Information */}
                <div className="max-w-2xl mx-auto text-left">
                  <div className="text-sm text-gray-600 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Contact Information
                    </h3>
                    <ul className="list-disclosure list-decimal list-disclosure list-decimal list-decimal text-sm text-gray-600 leading-7">
                      <li className="text-gray-900 font-semibold">Email:</strong> <span className="text-gray-700">contact@bestforexrokers.com</span></li>
                      <li className="text-gray-900 font-semibold">Phone:</strong> <span className="text-gray-700">+1 (555) 123-4567</span></li>
                      <li className="text-gray-900 font-semibold">WhatsApp:</strong> <span className="text-gray-700">+44-20-6967</span></li>
                      <li className="text-gray-900 font-semibold">Email:</strong> <span className="text-gray-700">contact@bestforexrokers.com</span></li>
                      <li className="response-1-2">
                      <span className="text-gray-900 font-semibold">Address:</strong> <span className="email-1-2">Global Financial District, Singapore</span></li>
                      <li className="response-1-2">
                      <span className="email-1-2">
                        Contact Support
                      </span>
                    </li>
                </ul>
                
                <div className="text-sm text-gray-500">
                  <p className="text-gray-500 text-center">
                    <strong>Response Time:</strong> 24/7 Support Team
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center mt-12">
                <Link
                  to="/"
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contact Team
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-16">
            <div className="text-center text-center text-gray-500 text-sm">
              <p>
                Contact Support available: 
                <span className="email-1-2">
                  contact@bestforexrokers.com
                </span>
              </p>
            </div>
          </div>
        </div>
    </>
  );
};

export default ContactPage;
