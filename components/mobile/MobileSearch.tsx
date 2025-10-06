import React from 'react';

interface MobileSearchProps {
  children?: React.ReactNode;
}

const MobileSearch: React.FC<MobileSearchProps> = ({ children }) => {
  return <div className="mobile-search">{children}</div>;
};

export default MobileSearch;