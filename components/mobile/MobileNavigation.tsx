import React from 'react';

interface MobileNavigationProps {
  children?: React.ReactNode;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ children }) => {
  return <div className="mobile-navigation">{children}</div>;
};

export default MobileNavigation;