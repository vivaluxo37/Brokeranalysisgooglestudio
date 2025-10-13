


import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import TradingViewWidget from '../tools/tradingview/TradingViewWidget';
import ComparisonBar from '../common/ComparisonBar';
import OnboardingGuide from '../onboarding/OnboardingGuide';
import QuickAccessWidget from '../ui/QuickAccessWidget';

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

const MarketTickerWidget: React.FC = () => {
    return (
        <div className="bg-card border-b border-input overflow-hidden">
            <div className="container mx-auto">
                 <TradingViewWidget
                    widgetType="ticker_tape"
                    options={{
                        "symbols": [
                            { "description": "EUR/USD", "proName": "FX:EURUSD" },
                            { "description": "GBP/USD", "proName": "FX:GBPUSD" },
                            { "description": "USD/JPY", "proName": "FX:USDJPY" },
                            { "description": "Gold", "proName": "OANDA:XAUUSD" },
                            { "description": "S&P 500", "proName": "SP:SPX" },
                            { "description": "Bitcoin", "proName": "BITSTAMP:BTCUSD" }
                        ],
                        "showSymbolLogo": true,
                        "isTransparent": true,
                        "displayMode": "adaptive",
                        "colorTheme": "dark", // Will be adapted by the widget component
                        "locale": "en"
                    }}
                    className="h-12 min-h-[48px]"
                />
            </div>
        </div>
    )
}

const Layout: React.FC<LayoutProps> = ({ children, breadcrumbs = [] }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MarketTickerWidget />
      {breadcrumbs.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>
      )}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
      <ComparisonBar />
      <OnboardingGuide />
      <QuickAccessWidget />
    </div>
  );
};

export default Layout;