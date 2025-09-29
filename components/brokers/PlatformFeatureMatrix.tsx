import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Monitor,
  Smartphone,
  Globe,
  Settings,
  BarChart3,
  Shield,
  Zap,
  Users,
  Database,
  Code,
  Star,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

interface PlatformFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface Platform {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'web';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetUsers: string[];
  features: string[];
  uniqueFeatures: string[];
  limitations: string[];
  languages: string[];
  downloadUrl?: string;
  webUrl?: string;
}

const PlatformFeatureMatrix: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('globaltrader');

  const features: PlatformFeature[] = [
    {
      id: 'charting',
      name: 'Advanced Charting',
      description: 'Professional charting tools with technical indicators',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'order-types',
      name: 'Order Types',
      description: 'Variety of order types for different trading strategies',
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 'research',
      name: 'Research Tools',
      description: 'Market research and analysis tools',
      icon: <Database className="w-5 h-5" />
    },
    {
      id: 'automation',
      name: 'Automation',
      description: 'Automated trading and API access',
      icon: <Code className="w-5 h-5" />
    },
    {
      id: 'alerts',
      name: 'Price Alerts',
      description: 'Customizable price alerts and notifications',
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      id: 'backtesting',
      name: 'Backtesting',
      description: 'Strategy backtesting capabilities',
      icon: <Zap className="w-5 h-5" />
    }
  ];

  const platforms: Platform[] = [
    {
      id: 'globaltrader',
      name: 'IBKR GlobalTrader',
      type: 'mobile',
      difficulty: 'beginner',
      targetUsers: ['Beginners', 'Casual Investors', 'Mobile Traders'],
      features: ['charting', 'order-types', 'research', 'alerts'],
      uniqueFeatures: ['Fractional shares trading', 'User-friendly interface', 'Biometric login'],
      limitations: ['Limited order types', 'No advanced charting', 'No automation'],
      languages: ['English', 'German', 'Dutch', 'French', 'Italian', 'Japanese', 'Portuguese', 'Russian', 'Spanish', 'Turkish', 'Chinese', 'Arabic', 'Hebrew'],
      downloadUrl: 'https://www.interactivebrokers.com/en/index.php?f=14099'
    },
    {
      id: 'mobile',
      name: 'IBKR Mobile',
      type: 'mobile',
      difficulty: 'intermediate',
      targetUsers: ['Active Traders', 'Advanced Investors', 'Mobile Professionals'],
      features: ['charting', 'order-types', 'research', 'alerts', 'automation'],
      uniqueFeatures: ['Full market access', 'Advanced order types', 'Real-time streaming', 'Watchlist synchronization'],
      limitations: ['Complex interface', 'Steep learning curve', 'Higher battery usage'],
      languages: ['English', 'German', 'Dutch', 'French', 'Italian', 'Japanese', 'Portuguese', 'Russian', 'Spanish', 'Turkish', 'Chinese', 'Arabic', 'Hebrew'],
      downloadUrl: 'https://www.interactivebrokers.com/en/index.php?f=14099'
    },
    {
      id: 'tws',
      name: 'Trader Workstation (TWS)',
      type: 'desktop',
      difficulty: 'advanced',
      targetUsers: ['Professional Traders', 'Institutions', 'Algorithmic Traders'],
      features: ['charting', 'order-types', 'research', 'automation', 'backtesting'],
      uniqueFeatures: ['Market scanner', 'Options analysis', 'Algorithmic trading', 'Advanced order routing', 'Multi-monitor support'],
      limitations: ['Very complex', 'High resource usage', 'Steep learning curve', 'Overwhelming for beginners'],
      languages: ['English', 'German', 'Dutch', 'French', 'Italian', 'Japanese', 'Portuguese', 'Russian', 'Spanish', 'Turkish', 'Chinese'],
      downloadUrl: 'https://www.interactivebrokers.com/en/index.php?f=14099'
    },
    {
      id: 'client-portal',
      name: 'Client Portal',
      type: 'web',
      difficulty: 'beginner',
      targetUsers: ['All Users', 'Account Management', 'Basic Trading'],
      features: ['order-types', 'research', 'alerts'],
      uniqueFeatures: ['Account management', 'Performance reporting', 'Tax documents', 'No installation required'],
      limitations: ['Limited trading features', 'Basic charting', 'No advanced tools'],
      languages: ['English', 'German', 'Dutch', 'French', 'Italian', 'Japanese', 'Portuguese', 'Russian', 'Spanish', 'Turkish', 'Chinese'],
      webUrl: 'https://www.interactivebrokers.com/sso'
    }
  ];

  const currentPlatform = platforms.find(p => p.id === selectedPlatform);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPlatformIcon = (type: string) => {
    switch (type) {
      case 'desktop': return <Monitor className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'web': return <Globe className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Trading Platforms Comparison
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Interactive Brokers offers multiple trading platforms tailored to different experience levels and trading needs.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Platform Selection */}
        <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {platforms.map((platform) => (
              <TabsTrigger key={platform.id} value={platform.id} className="flex flex-col gap-1 p-3">
                <div className="flex items-center gap-2">
                  {getPlatformIcon(platform.type)}
                  <span className="text-sm font-medium">{platform.name}</span>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs ${getDifficultyColor(platform.difficulty)}`}
                >
                  {platform.difficulty}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {platforms.map((platform) => (
            <TabsContent key={platform.id} value={platform.id} className="space-y-6">
              {/* Platform Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    {getPlatformIcon(platform.type)}
                    {platform.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {platform.type === 'desktop' && 'Desktop application for professional trading'}
                    {platform.type === 'mobile' && 'Mobile trading application for on-the-go access'}
                    {platform.type === 'web' && 'Web-based platform for account management and basic trading'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getDifficultyColor(platform.difficulty)}>
                      {platform.difficulty.charAt(0).toUpperCase() + platform.difficulty.slice(1)}
                    </Badge>
                    <Badge variant="outline">{platform.type}</Badge>
                  </div>
                </div>
                <Button
                  onClick={() => window.open(platform.downloadUrl || platform.webUrl, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Get Started
                </Button>
              </div>

              {/* Target Users */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Ideal For
                </h4>
                <div className="flex flex-wrap gap-2">
                  {platform.targetUsers.map((user) => (
                    <Badge key={user} variant="secondary">
                      {user}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Features Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Available Features</h4>
                  <div className="space-y-2">
                    {features.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-center gap-3 p-3 rounded-lg border"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{feature.name}</div>
                          <div className="text-xs text-muted-foreground">{feature.description}</div>
                        </div>
                        <div className="flex items-center justify-center w-6 h-6">
                          {platform.features.includes(feature.id) ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Unique Features
                    </h4>
                    <div className="space-y-2">
                      {platform.uniqueFeatures.map((feature) => (
                        <div key={feature} className="flex items-start gap-2 p-2 bg-green-50 rounded-md">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Limitations
                    </h4>
                    <div className="space-y-2">
                      {platform.limitations.map((limitation) => (
                        <div key={limitation} className="flex items-start gap-2 p-2 bg-red-50 rounded-md">
                          <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Language Support */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-3">Available Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {platform.languages.map((language) => (
                    <Badge key={language} variant="outline" className="text-xs">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Platform Recommendation */}
        <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Platform Recommendations:</h4>
              <div className="text-blue-700 space-y-1 text-sm">
                <p><strong>Beginners:</strong> Start with IBKR GlobalTrader for its user-friendly interface</p>
                <p><strong>Active Traders:</strong> Use IBKR Mobile for full market access on-the-go</p>
                <p><strong>Professionals:</strong> Trader Workstation offers the most advanced features</p>
                <p><strong>Account Management:</strong> Client Portal is perfect for administrative tasks</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformFeatureMatrix;