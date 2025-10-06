import React from 'react';

interface MobileFiltersProps {
  children?: React.ReactNode;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ children }) => {
  return <div className="mobile-filters">{children}</div>;
};

export default MobileFilters;