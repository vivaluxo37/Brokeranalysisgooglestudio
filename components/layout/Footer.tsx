
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card/50 border-t border-input mt-12">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <div className="flex justify-center gap-4 text-sm mb-2">
            <Link to="/methodology" className="hover:text-primary-400 transition-colors">Methodology</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Brokeranalysis. All rights reserved.</p>
        <p className="text-sm mt-1">Discover your perfect forex broker with the power of AI.</p>
      </div>
    </footer>
  );
};

export default Footer;