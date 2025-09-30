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
  
  // Get dynamic categories from constants
  const popularCategories = POPULAR_CATEGORIES.slice(0, 6);
  const executionCategories = getCategoriesByType('execution').slice(0, 4);
  const popularCountries = POPULAR_COUNTRIES.slice(0, 6);

  const tradingTools = [
    { name: 'Broker Comparison', href: '/compare' },
    { name: 'Cost Calculator', href: '/cost-analyzer' },
    { name: 'Economic Calendar', href: '/tools/economic-calendar' },
    { name: 'Market Data', href: '/tools/market-data' },
    { name: 'Pip Calculator', href: '/tools/pip-calculator' },
    { name: 'Risk Calculator', href: '/tools/risk-calculator' }
  ];

  const educationLinks = [
    { name: 'Trading Basics', href: '/education/basics' },
    { name: 'Technical Analysis', href: '/education/technical-analysis' },
    { name: 'Fundamental Analysis', href: '/education/fundamental-analysis' },
    { name: 'Risk Management', href: '/education/risk-management' },
    { name: 'Trading Psychology', href: '/education/psychology' },
    { name: 'AI Trading Tutor', href: '/education/ai-tutor' }
  ];

  const regionLinks = [
    { name: '🇺🇸 United States', href: '/region/usa' },
    { name: '🇬🇧 United Kingdom', href: '/region/uk' },
    { name: '🇦🇺 Australia', href: '/region/australia' },
    { name: '🇨🇦 Canada', href: '/region/canada' },
    { name: '🇪🇺 European Union', href: '/region/eu' },
    { name: '🇸🇬 Singapore', href: '/region/singapore' }
  ];

  const resourceLinks = [
    { name: 'Market News', href: '/market-news' },
    { name: 'Trading Blog', href: '/blog' },
    { name: 'Research Reports', href: '/research' },
    { name: 'Webinars', href: '/education/webinars' },
    { name: 'Trading Glossary', href: '/glossary' },
    { name: 'FAQ', href: '/faq' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link to="/" className="inline-block">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xl tracking-wide">
                  BROKERANALYSIS
                </div>
              </Link>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Your trusted source for independent forex broker reviews, comparisons, and trading education. 
              We help traders worldwide find the perfect broker for their trading needs with comprehensive 
              analysis and expert insights.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-2 mb-6 text-gray-300 text-sm">
              <div>
                <a href="mailto:info@brokeranalysis.com" className="hover:text-blue-400 transition-colors">
                  info@brokeranalysis.com
                </a>
              </div>
              <div>+1 (555) 123-4567</div>
              <div>Global Financial District</div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors" aria-label="Twitter">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors" aria-label="YouTube">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors" aria-label="Telegram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Best Brokers Directory */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-blue-400">
              Best Brokers
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/best-brokers"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors font-medium block hover:translate-x-1 transform duration-200"
                >
                  🏆 Directory 2025
                </Link>
              </li>
              {popularCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/best-brokers/${category.slug}`}
                    className="text-gray-300 hover:text-white text-sm transition-colors block hover:translate-x-1 transform duration-200"
                  >
                    {category.shortName}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/best-brokers"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors font-medium"
                >
                  View All Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Trading Tools */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-blue-400">
              Trading Tools
            </h3>
            <ul className="space-y-2">
              {tradingTools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    to={tool.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors block hover:translate-x-1 transform duration-200"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Education */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-blue-400">
              Education
            </h3>
            <ul className="space-y-2">
              {educationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors block hover:translate-x-1 transform duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Countries */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-blue-400">
              By Country
            </h3>
            <ul className="space-y-2">
              {popularCountries.map((country) => (
                <li key={country.slug}>
                  <Link
                    to={`/best-forex-brokers/${country.slug}`}
                    className="text-gray-300 hover:text-white text-sm transition-colors block hover:translate-x-1 transform duration-200"
                  >
                    {country.flag} {country.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/countries"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors font-medium"
                >
                  View All Countries →
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-blue-400">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/market-news"
                  className="text-gray-300 hover:text-white text-sm transition-colors block hover:translate-x-1 transform duration-200"
                >
                  Market News
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-300 hover:text-white text-sm transition-colors block hover:translate-x-1 transform duration-200"
                >
                  Trading Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/methodology"
                  className="text-gray-300 hover:text-white text-sm transition-colors block hover:translate-x-1 transform duration-200"
                >
                  Our Methodology
                </Link>
              </li>
              <li>
                <Link
                  to="/sources"
                  className="text-gray-300 hover:text-white text-sm transition-colors block hover:translate-x-1 transform duration-200"
                >
                  Data Sources
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white text-sm transition-colors block hover:translate-x-1 transform duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white text-sm transition-colors block hover:translate-x-1 transform duration-200"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl font-bold text-white mb-3">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-6">
              Get the latest broker reviews, market insights, and trading tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 flex items-center">
                <ShieldCheckIcon className="h-4 w-4 mr-2 text-blue-400" />
                Quick Links
              </h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
                <Link to="/methodology" className="text-gray-300 hover:text-white transition-colors">
                  Our Methodology
                </Link>
                <Link to="/team" className="text-gray-300 hover:text-white transition-colors">
                  Our Team
                </Link>
                <Link to="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
                <Link to="/press" className="text-gray-300 hover:text-white transition-colors">
                  Press Center
                </Link>
                <Link to="/partners" className="text-gray-300 hover:text-white transition-colors">
                  Partners
                </Link>
                <Link to="/advertise" className="text-gray-300 hover:text-white transition-colors">
                  Advertise
                </Link>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <div className="space-y-2 text-sm">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <Link to="/help" className="text-gray-300 hover:text-white transition-colors block">
                  Help Center
                </Link>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors block">
                  FAQ
                </Link>
                <Link to="/feedback" className="text-gray-300 hover:text-white transition-colors block">
                  Feedback
                </Link>
                <Link to="/report-issue" className="text-gray-300 hover:text-white transition-colors block">
                  Report Issue
                </Link>
                <Link to="/broker-submit" className="text-gray-300 hover:text-white transition-colors block">
                  Submit Broker
                </Link>
                <Link to="/data-correction" className="text-gray-300 hover:text-white transition-colors block">
                  Data Correction
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div className="text-gray-300 text-sm mb-4 lg:mb-0">
              © {currentYear} BROKERANALYSIS. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-300 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link to="/disclaimer" className="text-gray-300 hover:text-white transition-colors">
                Disclaimer
              </Link>
              <Link to="/sitemap" className="text-gray-300 hover:text-white transition-colors">
                Sitemap
              </Link>
              <Link to="/accessibility" className="text-gray-300 hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
          
          {/* Risk Warning */}
          <div className="bg-gradient-to-r from-yellow-900/20 to-red-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <ShieldCheckIcon className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="text-yellow-400 font-semibold text-sm mb-2">Important Risk Warning</h5>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Trading forex and CFDs carries a high level of risk and may not be suitable for all investors. 
                  You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. 
                  Past performance is not indicative of future results. Please ensure you fully understand the risks involved before trading.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Disclaimers */}
          <div className="text-gray-400 text-xs leading-relaxed space-y-2">
            <p>
              <strong>Disclaimer:</strong> BROKERANALYSIS is an independent comparison website. We may receive compensation 
              from brokers when users sign up through our links. This does not affect our reviews or rankings, which are based 
              on objective analysis and user feedback.
            </p>
            <p>
              The information on this website is general in nature and does not take into account your personal financial situation. 
              You should consider seeking independent financial advice and ensure you fully understand the risks involved before trading.
            </p>
            <p>
              Regulated brokers are licensed by financial authorities in their respective jurisdictions. Always verify a broker's 
              regulatory status before opening an account.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
