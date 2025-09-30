import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  StarIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface QuickLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const QuickAccessWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickLinks: QuickLink[] = [
    {
      name: 'Best Brokers',
      href: '/best-brokers',
      icon: <StarIcon className="h-5 w-5 text-blue-600" />,
      description: 'Directory 2025',
      color: 'bg-white border border-blue-200 hover:border-blue-300 hover:shadow-lg text-gray-900'
    },
    {
      name: 'Broker Matcher',
      href: '/broker-matcher',
      icon: <MagnifyingGlassIcon className="h-5 w-5 text-blue-600" />,
      description: 'Find Perfect Match',
      color: 'bg-white border border-blue-200 hover:border-blue-300 hover:shadow-lg text-gray-900'
    },
    {
      name: 'Compare',
      href: '/compare',
      icon: <ChartBarIcon className="h-5 w-5 text-blue-600" />,
      description: 'Side by Side',
      color: 'bg-white border border-blue-200 hover:border-blue-300 hover:shadow-lg text-gray-900'
    },
    {
      name: 'Countries',
      href: '/countries',
      icon: <GlobeAltIcon className="h-5 w-5 text-blue-600" />,
      description: 'By Location',
      color: 'bg-white border border-blue-200 hover:border-blue-300 hover:shadow-lg text-gray-900'
    }
  ];

  return (
    <div className="fixed right-6 bottom-6 z-40 flex flex-col items-end">
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="mb-3 space-y-2 animate-in slide-in-from-bottom duration-200">
          {quickLinks.map((link, index) => (
            <Link
              key={link.href}
              to={link.href}
              className={`
                flex items-center p-3 rounded-lg shadow-lg transition-all transform hover:scale-105
                ${link.color} min-w-[200px] group
                animate-in slide-in-from-bottom duration-200
              `}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setIsExpanded(false)}
            >
              <div className="mr-3 flex-shrink-0">
                {link.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{link.name}</div>
                <div className="text-xs opacity-90">{link.description}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all transform
          ${isExpanded 
            ? 'bg-gray-600 hover:bg-gray-700 rotate-0' 
            : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'
          }
          text-white group
        `}
        aria-label={isExpanded ? 'Close quick access menu' : 'Open quick access menu'}
      >
        {isExpanded ? (
          <ChevronDownIcon className="h-6 w-6 transition-transform group-hover:scale-110" />
        ) : (
          <ChevronUpIcon className="h-6 w-6 transition-transform group-hover:scale-110" />
        )}
      </button>

      {/* Tooltip for collapsed state */}
      {!isExpanded && (
        <div className="absolute right-16 bottom-4 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Quick Access Menu
          <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default QuickAccessWidget;