
import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';

const Footer: React.FC = () => {
  const footerLinks = [...NAV_LINKS, { name: 'Methodology', path: '/methodology' }];

  return (
    <footer className="bg-card/50 border-t border-input mt-24">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-gray-400">
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm mb-4">
            {footerLinks.map(link => (
              <Link key={link.name} to={link.path} className="hover:text-primary-400 transition-colors">
                {link.name}
              </Link>
            ))}
        </div>
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} Brokeranalysis. All rights reserved.</p>
          <p className="text-sm mt-1">Discover your perfect forex broker with the power of AI.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
