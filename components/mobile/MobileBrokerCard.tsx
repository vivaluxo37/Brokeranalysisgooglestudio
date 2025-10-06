import React from 'react';

interface MobileBrokerCardProps {
  children?: React.ReactNode;
}

const MobileBrokerCard: React.FC<MobileBrokerCardProps> = ({ children }) => {
  return <div className="mobile-broker-card">{children}</div>;
};

export default MobileBrokerCard;