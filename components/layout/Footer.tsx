import React from 'react';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { getCategoriesByType, POPULAR_CATEGORIES } from '../../lib/constants/categories';
import { POPULAR_COUNTRIES } from '../../lib/constants/countries';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Get dynamic categories and countries
  const popularCategories = POPULAR_CATEGORIES.slice(0, 5);
  const popularCountries = POPULAR_COUNTRIES.slice(0, 8);

  // Essential navigation links organized smartly
  const mainNavigation = [
    {
      title: 'Trading',
      links: [
        { name: 'Best Brokers 2025', href: '/best-brokers' },
        { name: 'Compare Brokers', href: '/compare' },
        { name: 'Trading Tools', href: '/tools' },
        { name: 'Cost Calculator', href: '/cost-analyzer' },
        { name: 'Economic Calendar', href: '/tools/economic-calendar' }
      ]
    },
    {
      title: 'Learn',
      links: [
        { name: 'Trading Basics', href: '/education/basics' },
        { name: 'AI Trading Tutor', href: '/education/ai-tutor' },
        { name: 'Trading Blog', href: '/blog' },
        { name: 'Market News', href: '/market-news' },
        { name: 'FAQ', href: '/faq' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Methodology', href: '/methodology' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Data Sources', href: '/sources' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Section 1: Company Info + Essential Navigation */}
          <div className="space-y-8">
            {/* Company Brand & Info */}
            <div>
              <Link to="/" className="inline-block mb-6">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xl tracking-wide">
                  BROKERANALYSIS
                </div>
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                Your trusted source for independent forex broker reviews and trading education. 
                We help traders worldwide find the perfect broker with comprehensive analysis and expert insights.
              </p>
            </div>

            {/* Essential Navigation */}
            <div className="grid grid-cols-3 gap-8">
              {mainNavigation.map((section) => (
                <div key={section.title}>
                  <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Popular Categories + Countries + Newsletter */}
          <div className="space-y-8">
            
            {/* Popular Categories & Countries Grid */}
            <div className="grid grid-cols-2 gap-8">
              {/* Popular Categories */}
              <div>
                <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
                  Popular Categories
                </h4>
                <ul className="space-y-3">
                  {popularCategories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        to={`/best-brokers/${category.slug}`}
                        className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                      >
                        {category.shortName}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/best-brokers"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      View All →
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Popular Countries */}
              <div>
                <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
                  Top Countries
                </h4>
                <ul className="space-y-3">
                  {popularCountries.map((country) => (
                    <li key={country.slug}>
                      <Link
                        to={`/best-forex-brokers/${country.slug}`}
                        className="text-gray-400 hover:text-blue-400 text-sm transition-colors flex items-center"
                      >
                        <span className="mr-2 text-xs">{country.flag}</span>
                        {country.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/countries"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      All Countries →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="font-semibold text-white mb-2">Stay Updated</h4>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest broker reviews and trading insights delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium text-sm transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Section */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} BROKERANALYSIS. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/disclaimer" className="text-gray-400 hover:text-blue-400 transition-colors">
                Disclaimer
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-blue-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
          
          {/* Risk Warning */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-start">
              <ShieldCheckIcon className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="text-yellow-400 font-semibold text-sm mb-2">Important Risk Warning</h5>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Trading forex and CFDs carries a high level of risk and may not be suitable for all investors. 
                  You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. 
                  Past performance is not indicative of future results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
