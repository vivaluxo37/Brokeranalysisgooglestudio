/**
 * Related Pages Component
 * 
 * This component displays a grid of related pages with links to help users
 * discover more relevant content.
 */

import React from 'react';
import { Link } from 'react-router-dom';

interface RelatedPage {
  title: string;
  href: string;
}

interface RelatedPagesProps {
  pages: RelatedPage[];
  className?: string;
}

export const RelatedPages: React.FC<RelatedPagesProps> = ({ 
  pages, 
  className = '' 
}) => {
  if (!pages || pages.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {pages.map((page, index) => (
        <Link
          key={index}
          to={page.href}
          className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                {page.title}
              </h3>
              <p className="text-sm text-gray-500">
                Learn more about {page.title.toLowerCase()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedPages;