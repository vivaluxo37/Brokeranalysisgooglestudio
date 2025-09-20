
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card/50 border-t border-input mt-12">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Brokeranalysis. All rights reserved.</p>
        <p className="text-sm mt-1">Discover your perfect forex broker with the power of AI.</p>
      </div>
    </footer>
  );
};

export default Footer;
