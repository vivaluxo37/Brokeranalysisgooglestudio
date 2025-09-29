import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  BarChart3,
  Globe,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Info,
  Zap,
  DollarSign,
  Shield,
  Database
} from 'lucide-react';

interface ProductCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  available: boolean;
  details: string;
  count?: number;
  features?: string[];
}

interface BrokerProducts {
  stocks: ProductCategory;
  etfs: ProductCategory;
  forex: ProductCategory;
  options: ProductCategory;
  futures: ProductCategory;
  cfds: ProductCategory;
  crypto: ProductCategory;
  bonds: ProductCategory;
  funds: ProductCategory;
}

const ProductSelectionEnhanced: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('stocks');

  const products: BrokerProducts = {
    stocks: {
      id: 'stocks',
      name: 'Stocks',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Access to global equity markets',
      available: true,
      details: 'Trade stocks from 150+ global exchanges including NASDAQ, NYSE, LSE, and more',
      count: 9000,
      features: ['Fractional shares', 'Extended hours trading', 'Short selling', 'Dividend reinvestment']
    },
    etfs: {
      id: 'etfs',
      name: 'ETFs',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Exchange Traded Funds',
      available: true,
      details: '13,000+ ETFs covering all major market sectors and investment strategies',
      count: 13000,
      features: ['Commission-free ETFs', 'Sector ETFs', 'International ETFs', 'Bond ETFs']
    },
    forex: {
      id: 'forex',
      name: 'Forex',
      icon: <Globe className="w-5 h-5" />,
      description: 'Currency trading',
      available: true,
      details: '100+ currency pairs with competitive spreads and 24/5 trading',
      count: 100,
      features: ['Major pairs', 'Minor pairs', 'Exotic pairs', 'Currency options']
    },
    options: {
      id: 'options',
      name: 'Options',
      icon: <Zap className="w-5 h-5" />,
      description: 'Options trading',
      available: true,
      details: 'Access to 30+ options exchanges worldwide with advanced tools',
      count: 30,
      features: ['Stock options', 'Index options', 'Futures options', 'Options strategies']
    },
    futures: {
      id: 'futures',
      name: 'Futures',
      icon: <Clock className="w-5 h-5" />,
      description: 'Futures contracts',
      available: true,
      details: '30+ futures markets including commodities, indices, and currencies',
      count: 30,
      features: ['Commodity futures', 'Index futures', 'Currency futures', 'Interest rate futures']
    },
    cfds: {
      id: 'cfds',
      name: 'CFDs',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Contracts for Difference',
      available: true,
      details: 'Stock and index CFDs with leverage and hedging capabilities',
      count: 13,
      features: ['Stock CFDs', 'Index CFDs', 'Commodity CFDs', 'Negative balance protection']
    },
    crypto: {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: <Database className="w-5 h-5" />,
      description: 'Digital assets',
      available: true,
      details: 'Spot crypto trading through Paxos and Zero Hash partnerships',
      count: 10,
      features: ['Bitcoin', 'Ethereum', 'Litecoin', 'Ripple', 'Cardano', 'Solana']
    },
    bonds: {
      id: 'bonds',
      name: 'Bonds',
      icon: <Shield className="w-5 h-5" />,
      description: 'Fixed income securities',
      available: true,
      details: '33,000+ bonds including government, corporate, and municipal bonds',
      count: 33000,
      features: ['Government bonds', 'Corporate bonds', 'Municipal bonds', 'Treasury bonds']
    },
    funds: {
      id: 'funds',
      name: 'Mutual Funds',
      icon: <Database className="w-5 h-5" />,
      description: 'Professional fund management',
      available: true,
      details: 'Access to 500+ fund providers including BlackRock and Vanguard',
      count: 500,
      features: ['No-transaction-fee funds', 'Index funds', 'Active funds', 'Sector funds']
    }
  };

  const marketAccess = [
    { region: 'North America', exchanges: 15, markets: ['NASDAQ', 'NYSE', 'TSX', 'CBOE'], description: 'US and Canadian exchanges' },
    { region: 'Europe', exchanges: 25, markets: ['LSE', 'Euronext', 'Xetra', 'SIX'], description: 'Major European exchanges' },
    { region: 'Asia Pacific', exchanges: 20, markets: ['TSE', 'HKEX', 'ASX', 'SGX'], description: 'Asian and Pacific exchanges' },
    { region: 'Emerging Markets', exchanges: 15, markets: ['BSE', 'JSE', 'BOVESPA', 'BMV'], description: 'Growth markets worldwide' }
  ];

  const tradingHours = [
    { market: 'US Stocks', hours: '9:30 AM - 4:00 PM EST', extended: '4:00 AM - 8:00 PM EST', overnight: 'Available' },
    { market: 'European Stocks', hours: '8:00 AM - 4:30 PM GMT', extended: '7:00 AM - 6:00 PM GMT', overnight: 'Limited' },
    { market: 'Asian Stocks', hours: '9:00 AM - 3:00 PM JST', extended: '8:00 AM - 5:00 PM JST', overnight: 'Limited' },
    { market: 'Forex', hours: '24/5', extended: '24/5', overnight: '24/5' },
    { market: 'Cryptocurrency', hours: '24/7', extended: '24/7', overnight: '24/7' }
  ];

  const selectedProduct = products[selectedCategory as keyof BrokerProducts];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Product Selection & Market Access
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Interactive Brokers offers unparalleled access to global markets with 150+ exchanges and 1M+ instruments worldwide.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Product Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="stocks" className="flex flex-col gap-1 p-3">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs">Stocks</span>
            </TabsTrigger>
            <TabsTrigger value="forex" className="flex flex-col gap-1 p-3">
              <Globe className="w-4 h-4" />
              <span className="text-xs">Forex</span>
            </TabsTrigger>
            <TabsTrigger value="options" className="flex flex-col gap-1 p-3">
              <Zap className="w-4 h-4" />
              <span className="text-xs">Options</span>
            </TabsTrigger>
            <TabsTrigger value="futures" className="flex flex-col gap-1 p-3">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Futures</span>
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex flex-col gap-1 p-3">
              <Database className="w-4 h-4" />
              <span className="text-xs">Crypto</span>
            </TabsTrigger>
          </TabsList>

          {Object.entries(products).map(([key, product]) => (
            <TabsContent key={key} value={product.id} className="space-y-6">
              {/* Product Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    {product.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={product.available ? 'default' : 'secondary'}>
                        {product.available ? 'Available' : 'Not Available'}
                      </Badge>
                      {product.count && (
                        <Badge variant="outline">
                          {formatNumber(product.count)}+ instruments
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Product Details</h4>
                  <p className="text-sm text-muted-foreground mb-4">{product.details}</p>

                  {product.features && (
                    <div>
                      <h5 className="font-medium text-sm mb-2">Key Features:</h5>
                      <div className="space-y-2">
                        {product.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-3">Trading Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Commission</span>
                      <span className="font-medium">
                        {product.id === 'stocks' || product.id === 'etfs' ? 'From $0.005/share' :
                         product.id === 'forex' ? 'From $2.00/lot' :
                         product.id === 'options' ? 'From $0.65/contract' :
                         product.id === 'futures' ? 'From $0.25/contract' :
                         product.id === 'crypto' ? '0.12-0.18%' :
                         'Varies by instrument'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Leverage</span>
                      <span className="font-medium">
                        {product.id === 'forex' || product.id === 'cfds' ? 'Up to 1:50' :
                         product.id === 'futures' || product.id === 'options' ? 'Varies' :
                         'Up to 1:5'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Minimum Size</span>
                      <span className="font-medium">
                        {product.id === 'stocks' || product.id === 'etfs' ? '1 share' :
                         product.id === 'forex' ? '0.01 lot' :
                         product.id === 'options' ? '1 contract' :
                         'Varies'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trading Hours</span>
                      <span className="font-medium">
                        {product.id === 'forex' || product.id === 'crypto' ? '24/7' : 'Market hours'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Market Access Overview */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Global Market Access
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketAccess.map((region) => (
              <div key={region.region} className="p-3 bg-white rounded-lg border">
                <h5 className="font-medium text-sm">{region.region}</h5>
                <p className="text-xs text-muted-foreground mb-2">{region.description}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Exchanges:</span>
                    <span className="font-medium">{region.exchanges}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Examples:</span>
                    <span className="font-medium">{region.markets.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Hours */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Trading Hours
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Market</th>
                  <th className="text-center p-2">Regular Hours</th>
                  <th className="text-center p-2">Extended Hours</th>
                  <th className="text-center p-2">Overnight</th>
                </tr>
              </thead>
              <tbody>
                {tradingHours.map((schedule) => (
                  <tr key={schedule.market} className="border-b">
                    <td className="p-2 font-medium">{schedule.market}</td>
                    <td className="p-2 text-center">{schedule.hours}</td>
                    <td className="p-2 text-center">{schedule.extended}</td>
                    <td className="p-2 text-center">
                      <Badge variant={schedule.overnight === 'Available' ? 'default' : 'secondary'} className="text-xs">
                        {schedule.overnight}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-green-900">150+ Global Exchanges</div>
              <div className="text-sm text-green-700">Access to markets worldwide</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Star className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-blue-900">1M+ Instruments</div>
              <div className="text-sm text-blue-700">Extensive product selection</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <Zap className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-purple-900">Extended Hours</div>
              <div className="text-sm text-purple-700">Trade when markets are closed</div>
            </div>
          </div>
        </div>

        {/* Special Features */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Special Features:</h4>
              <div className="text-blue-700 space-y-1 text-sm">
                <p>• <strong>Fractional Shares:</strong> Invest small amounts in expensive stocks</p>
                <p>• <strong>Overnight Trading:</strong> Trade US stocks 22 hours a day</p>
                <p>• <strong>Extended Hours:</strong> Pre-market and after-hours trading available</p>
                <p>• <strong>Global Access:</strong> Single account for worldwide markets</p>
                <p>• <strong>Professional Tools:</strong> Advanced research and analysis tools</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSelectionEnhanced;