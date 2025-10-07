import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import BestBrokersCategoryPage from '../pages/CategoryPage';

// List of category slugs that should redirect to enhanced versions
const ENHANCED_CATEGORY_SLUGS = [
  // General Broker Types
  'top-online-trading-brokers',
  'top-cfd-brokers-platforms',
  'top-forex-brokers',

  // Execution Types
  'ecn-brokers',
  'dma-direct-market-access-brokers',
  'stp-brokers',
  'no-dealing-desk-brokers',
  'raw-spread-brokers',
  'instant-execution-brokers',
  'fixed-spread-brokers',
  'no-spread-brokers',

  // Strategy Types
  'pamm-brokers',
  'hft-brokers',
  'scalping-brokers',
  'swing-trading-brokers',
  'hedging-brokers',
  'brokers-for-beginners',
  'day-trading-brokers',
  'api-trading-brokers',

  // Feature Types
  'most-regulated-brokers',
  'micro-accounts-brokers',
  'high-leverage-brokers',
  'islamic-accounts-brokers',
  'no-deposit-brokers',
  'no-minimum-deposit-brokers',
  'mt4-brokers',
  'mt5-brokers',
  'tradingview-brokers',
  'crypto-cfd-brokers',
  'stock-cfd-brokers',
  'offshore-brokers',
  'corporate-account-brokers',
  'trailing-stop-loss-brokers'
];

const CategoryRedirect: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  // If this is an enhanced category, redirect to enhanced version
  if (categorySlug && ENHANCED_CATEGORY_SLUGS.includes(categorySlug)) {
    return <Navigate to={`/best-brokers/enhanced/${categorySlug}`} replace />;
  }

  // If not an enhanced category, show the original category page
  return <BestBrokersCategoryPage />;
};

export default CategoryRedirect;