import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDownIcon, Bars3Icon, XMarkIcon, UserIcon, StarIcon, GlobeAltIcon, ChartBarIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { getCategoriesByType, POPULAR_CATEGORIES } from '../../lib/constants/categories';
import { POPULAR_COUNTRIES } from '../../lib/constants/countries';
import { categoryPageGroups } from '../../pages/categoryPageData';

interface NavItem {
  label: string;
  href?: string;
  children?: Array<{
    label: string;
    href: string;
    description?: string;
  }>;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  // Get popular categories for mega menu
  const generalCategories = getCategoriesByType('general').slice(0, 6);
  const executionCategories = getCategoriesByType('execution').slice(0, 4);
  const strategyCategories = getCategoriesByType('strategy').slice(0, 4);
  const featureCategories = getCategoriesByType('features').slice(0, 4);
  
  const popularCountries = POPULAR_COUNTRIES.slice(0, 8);

  const navigation: NavItem[] = [
    {
      label: 'Best Brokers',
      href: '/best-brokers',
      children: [
        // Quick Links Section
        { label: '🏆 Best Brokers Directory', href: '/best-brokers', description: 'Complete directory of top-rated brokers' },
        { label: '📊 All Brokers List', href: '/brokers', description: 'Browse all forex brokers with detailed reviews' },
        { label: '🔍 Advanced Screening', href: '/brokers/advanced-screening', description: 'Filter brokers by specific criteria' },
        { label: '🎁 Latest Promotions', href: '/brokers/promotions', description: 'Current broker bonuses and offers' },
        { label: '---', href: '#', description: '' }, // Separator
        
        // Popular Categories
        ...generalCategories.map(cat => ({
          label: cat.name,
          href: `/best-brokers/${cat.slug}`,
          description: cat.description.slice(0, 60) + '...'
        }))
      ]
    },
    {
      label: 'Categories',
      children: [
        // Execution Types
        { label: '⚡ Execution Types', href: '#', description: 'Browse by execution model' },
        ...executionCategories.map(cat => ({
          label: cat.shortName,
          href: `/best-brokers/${cat.slug}`,
          description: cat.description.slice(0, 50) + '...'
        })),
        { label: '---', href: '#', description: '' }, // Separator
        
        // Trading Strategies
        { label: '📈 Trading Strategies', href: '#', description: 'Brokers by trading style' },
        ...strategyCategories.map(cat => ({
          label: cat.shortName,
          href: `/best-brokers/${cat.slug}`,
          description: cat.description.slice(0, 50) + '...'
        })),
        { label: '---', href: '#', description: '' }, // Separator
        
        // Platform Features
        { label: '⚙️ Platform Features', href: '#', description: 'Brokers by platform type' },
        ...featureCategories.map(cat => ({
          label: cat.shortName,
          href: `/best-brokers/${cat.slug}`,
          description: cat.description.slice(0, 50) + '...'
        }))
      ]
    },
    {
      label: 'Countries',
      children: [
        { label: '🌍 Browse by Country', href: '/countries', description: 'Find brokers available in your country' },
        { label: '---', href: '#', description: '' }, // Separator
        ...popularCountries.map(country => ({
          label: `${country.flag} ${country.name}`,
          href: `/best-forex-brokers/${country.slug}`,
          description: `Top brokers available in ${country.name}`
        }))
      ]
    },
    {
      label: 'Tools',
      children: [
        { label: 'Compare Brokers', href: '/compare', description: 'Side-by-side broker comparison tool' },
        { label: 'Cost Analyzer', href: '/cost-analyzer', description: 'Calculate your trading costs' },
        { label: 'Broker Matcher', href: '/broker-matcher', description: 'Find your perfect broker match' },
        { label: '---', href: '#', description: '' },
        { label: 'Economic Calendar', href: '/tools/economic-calendar', description: 'Track important economic events' },
        { label: 'Market Data', href: '/tools/market-data', description: 'Real-time market information' },
        { label: 'Trading Calculators', href: '/tools/calculators', description: 'Essential trading calculators' }
      ]
    },
    {
      label: 'Learn',
      children: [
        { label: 'Education Hub', href: '/education', description: 'Complete trading education center' },
        { label: 'AI Trading Tutor', href: '/education/ai-tutor', description: 'Personal AI trading assistant' },
        { label: 'Trading Quizzes', href: '/education/quizzes', description: 'Test your trading knowledge' },
        { label: 'Trading Simulators', href: '/education/simulators', description: 'Practice trading risk-free' },
        { label: '---', href: '#', description: '' },
        { label: 'Live Webinars', href: '/education/webinars', description: 'Join live trading sessions' },
        { label: 'Market News', href: '/market-news', description: 'Latest forex market updates' },
        { label: 'Trading Blog', href: '/blog', description: 'Expert insights and analysis' }
      ]
    }
  ];

  const isActiveLink = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg tracking-wide">
                BROKERANALYSIS
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8 flex-1 justify-center">
            {navigation.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.href ? (
                  <Link
                    to={item.href}
                    className={`flex items-center px-2 xl:px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                      isActiveLink(item.href)
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button className="flex items-center px-2 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
                    {item.label}
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </button>
                )}

                {/* Mega Menu Dropdown */}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-screen max-w-4xl bg-white rounded-lg shadow-xl border z-50">
                    <div className="p-6">
                      {/* Mega Menu for Categories */}
                      {item.label === 'Categories' ? (
                        <div className="grid grid-cols-3 gap-8">
                          {/* Execution Types */}
                          <div>
                            <div className="mb-4">
                              <h3 className="font-semibold text-gray-900">Execution Types</h3>
                            </div>
                            <div className="space-y-2">
                              {executionCategories.map((cat) => (
                                <Link
                                  key={cat.slug}
                                  to={`/best-brokers/${cat.slug}`}
                                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                                >
                                  <div className="font-medium">{cat.shortName}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {cat.description.slice(0, 45)}...
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                          
                          {/* Trading Strategies */}
                          <div>
                            <div className="mb-4">
                              <h3 className="font-semibold text-gray-900">Trading Strategies</h3>
                            </div>
                            <div className="space-y-2">
                              {strategyCategories.map((cat) => (
                                <Link
                                  key={cat.slug}
                                  to={`/best-brokers/${cat.slug}`}
                                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                                >
                                  <div className="font-medium">{cat.shortName}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {cat.description.slice(0, 45)}...
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                          
                          {/* Platform Features */}
                          <div>
                            <div className="mb-4">
                              <h3 className="font-semibold text-gray-900">Platform Features</h3>
                            </div>
                            <div className="space-y-2">
                              {featureCategories.map((cat) => (
                                <Link
                                  key={cat.slug}
                                  to={`/best-brokers/${cat.slug}`}
                                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                                >
                                  <div className="font-medium">{cat.shortName}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {cat.description.slice(0, 45)}...
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : item.label === 'Countries' ? (
                        /* Countries Mega Menu */
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">Popular Countries</h3>
                            </div>
                            <Link
                              to="/countries"
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              View All Countries →
                            </Link>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            {popularCountries.map((country) => (
                              <Link
                                key={country.slug}
                                to={`/best-forex-brokers/${country.slug}`}
                                className="flex items-center px-3 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                              >
                                <span className="text-2xl mr-3">{country.flag}</span>
                                <div>
                                  <div className="font-medium">{country.name}</div>
                                  <div className="text-xs text-gray-500">View Brokers</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* Standard Dropdown Menu */
                        <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                          {item.children.map((child) => (
                            child.label === '---' ? (
                              <div key={child.href} className="col-span-2 border-t border-gray-200 my-2"></div>
                            ) : (
                              <Link
                                key={child.href}
                                to={child.href}
                                className="block px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md transition-colors"
                              >
                                <div className="font-medium">{child.label}</div>
                                {child.description && (
                                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {child.description}
                                  </div>
                                )}
                              </Link>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Auth & CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 flex-shrink-0">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors whitespace-nowrap"
            >
              <span className="hidden xl:inline">Sign In</span>
              <span className="xl:hidden">Login</span>
            </Link>
            <Link
              to="/register"
              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              <span className="hidden xl:inline">Sign Up</span>
              <span className="xl:hidden">Join</span>
            </Link>
            <Link
              to="/broker-matcher"
              className="bg-blue-600 text-white px-3 xl:px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <span className="hidden xl:inline">Broker Matcher</span>
              <span className="xl:hidden">Matcher</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 max-h-96 overflow-y-auto">
              {navigation.map((item) => (
                <div key={item.label}>
                  {item.href ? (
                    <Link
                      to={item.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActiveLink(item.href)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <div className="px-3 py-2 text-base font-medium text-gray-900 border-b">
                        {item.label}
                      </div>
                      <div className="pl-6 space-y-1">
                        {item.children?.slice(0, 6).map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t">
                <Link
                  to="/best-brokers"
                  className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Best Brokers Directory
                </Link>
                <Link
                  to="/compare"
                  className="block w-full bg-gray-600 text-white text-center px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Compare Brokers
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
