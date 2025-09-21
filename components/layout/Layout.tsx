
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from '../common/Breadcrumbs';
import TradingViewWidget from '../tools/tradingview/TradingViewWidget';

interface LayoutProps {
  children: React.ReactNode;
}

const MarketTickerWidget: React.FC = () => {
    return (
        <div className="bg-card border-b border-input">
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
                />
            </div>
        </div>
    )
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MarketTickerWidget />
      <Breadcrumbs />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;