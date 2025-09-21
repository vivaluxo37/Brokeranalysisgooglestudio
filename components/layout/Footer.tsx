


import React from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { categoryPageGroups } from '../../pages/categoryPageData';

const Footer: React.FC = () => {
  const mainLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Brokers', path: '/brokers' },
    { name: 'Compare Brokers', path: '/compare' },
    { name: 'Cost Analyzer', path: '/cost-analyzer' },
    { name: 'Broker Matcher', path: '/broker-matcher' },
    { name: 'Market News', path: '/market-news' },
    { name: 'Methodology', path: '/methodology' },
    { name: 'Sources', path: '/sources' },
  ];

  return (
    <footer className="bg-card/50 border-t border-input mt-24 transition-colors duration-300">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 text-foreground/70">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Main Links */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
             <h3 className="text-2xl font-bold text-primary-500 mb-2">Brokeranalysis</h3>
             <p className="text-sm">Discover your perfect forex broker with the power of AI.</p>
          </div>
          
          {/* By Country */}
          <div>
            <h4 className="font-semibold text-card-foreground mb-4">By Country</h4>
            <ul className="space-y-2 text-sm">
              {categoryPageGroups.country.map(link => (
                <li key={link.name}><ReactRouterDOM.Link to={link.path} className="hover:text-primary-400 transition-colors">{link.name}</ReactRouterDOM.Link></li>
              ))}
            </ul>
          </div>
          
          {/* Platforms & Types */}
          <div>
            <h4 className="font-semibold text-card-foreground mb-4">Platforms & Types</h4>
            <ul className="space-y-2 text-sm">
               {categoryPageGroups.platform.map(link => (
                <li key={link.name}><ReactRouterDOM.Link to={link.path} className="hover:text-primary-400 transition-colors">{link.name}</ReactRouterDOM.Link></li>
              ))}
            </ul>
          </div>

           {/* Resources */}
          <div>
            <h4 className="font-semibold text-card-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
               {mainLinks.map(link => (
                <li key={link.name}><ReactRouterDOM.Link to={link.path} className="hover:text-primary-400 transition-colors">{link.name}</ReactRouterDOM.Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center mt-12 border-t border-input pt-8">
          <p>&copy; {new Date().getFullYear()} Brokeranalysis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;