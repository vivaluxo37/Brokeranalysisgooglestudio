import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm">
        {/* Home */}
        <li>
          <Link
            to="/"
            className="text-gray-500 hover:text-blue-600 transition-colors flex items-center"
          >
            <HomeIcon className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-1" />
            {item.href && index < items.length - 1 ? (
              <Link
                to={item.href}
                className="text-gray-500 hover:text-blue-600 transition-colors truncate max-w-32 sm:max-w-none"
                title={item.label}
              >
                {item.label}
              </Link>
            ) : (
              <span 
                className="text-gray-900 font-medium truncate max-w-32 sm:max-w-none"
                title={item.label}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}