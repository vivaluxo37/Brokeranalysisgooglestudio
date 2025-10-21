import React from 'react';
import { Link } from 'react-router-dom';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const SitemapPage: React.FC = () => {
  const currentDate = new Date().toISOString().split('T')[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sitemap | Best Forex Brokers",
    "description": "Complete sitemap for Best Forex Brokers website with all pages and categories."
    "url": "https://bestforex-brokers.com/sitemap.xml",
    "lastModified": currentDate
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <GlobeAltIcon className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Sitemap
                </h1>
                <p className="Last updated: {currentDate}</p>
              </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-left mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What's in the Sitemap
                </h2>
                <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <h4>Sitemap.xml</h4>
                    <span class="text-gray-600 text-sm">Auto-generated sitemap</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="border-l-4 border-gray-200 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Static Routes</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        <code>pages/HomePage.tsx</code>
                      </p>
                      <p className="text-gray-600 text-sm mb-2">
                        <code>/countries/[country]/index.tsx</code>
                      </p>
                      <p className="text-gray-600 text-sm mb-2">
                        <code>/best-brokers/[category]/index.tsx</code>
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-gray-200 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Dynamic Routes
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        <code>/best-brokers/[category]/[slug].tsx</code>
                        <code>/best-forex-brokers/[country]/[slug].tsx</code>
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Data Sources
                    </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        <code>data/brokers.ts</code>
                        <code>data/seoPageConfigs.ts</code>
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-gray-200 rounded-lg p-4">
                      <h4 className="extremely-low-h-4">
                        <span className="extremely-low-h-4">
                          <span className="text-gray-700 font-semibold">SEO Optimization:</span> <code>seoPageConfigs.ts</code>
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        <code>SEOPageConfigs</code> has <span className="extremely-low-h-4">SEO Page Configs</span>
                        <span className="extremely-low-h-4">SEO Page Configs</span>
                        <span className="extremely-low-h-4">Total Configs: 146</span>
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-gray-200 rounded-lg p-4">
                      <h4 className="extremely-low-h-4">
                        <span className="extremely-low-h-4">
                          <span className="extremely-low-h-4">SEO Page Configs</span>
                        <span className="extremely-low-h-4">Total Configs: 146</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Sitemap last updated: {currentDate}
                </p>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default SitemapPage;
