import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { brokerDatabaseService } from '../services/brokerDatabaseService';
import NotFoundPage from './NotFoundPage';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import Spinner from '../components/ui/Spinner';
import {
  TrendingUp,
  Shield,
  Globe,
  Monitor,
  CheckCircle,
  Star,
  BarChart3,
  ExternalLink,
  DollarSign,
  Users,
  Zap,
  Code,
  Heart
} from 'lucide-react';

// Template-based broker detail page
// Uses database service to fetch broker data dynamically
const BrokerDetailPageTemplate: React.FC = () => {
  const { brokerId } = useParams<{ brokerId: string }>();
  const [broker, setBroker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrokerData = async () => {
      if (!brokerId) return;

      try {
        setLoading(true);
        setError(null);
        
        // Use cached data for better performance
        const brokerData = await brokerDatabaseService.getCachedBrokerData(brokerId);
        
        if (brokerData) {
          setBroker(brokerData);
        } else {
          setError('Broker not found');
        }
      } catch (err) {
        console.error('Error fetching broker data:', err);
        setError('Failed to load broker data');
      } finally {
        setLoading(false);
      }
    };

    fetchBrokerData();
  }, [brokerId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-lg font-medium">Loading broker information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !broker) {
    return <NotFoundPage />;
  }

  const overallRating = broker.ratings?.overallRating || 
    ((broker.ratings?.regulationRating + broker.ratings?.costsRating + 
      broker.ratings?.platformsRating + broker.ratings?.supportRating) / 4) || 4.5;

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Broker Header */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center justify-center p-3">
                      <img
                        src={broker.logoUrl}
                        alt={`${broker.name} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/broker-logos/default-broker.svg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl lg:text-4xl font-bold tracking-tight">
                        {broker.name}
                      </h1>
                      {broker.regulations && broker.regulations.length > 0 && (
                        <Badge className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                          <Shield className="w-3 h-3" />
                          Regulated
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-lg mb-4 text-muted-foreground">
                      Professional Review & Analysis {new Date().getFullYear()}
                    </p>
                    
                    {/* Rating and Score */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.round(overallRating) 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-foreground">
                          {overallRating.toFixed(1)}/5.0
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-primary">
                          {broker.score?.toFixed(1) || '8.5'}/10
                        </span>
                        <span className="text-sm text-muted-foreground">Overall Score</span>
                      </div>
                    </div>
                    
                    {/* Key Highlights from Pros */}
                    <div className="flex flex-wrap gap-2">
                      {broker.prosAndCons?.pros?.slice(0, 3).map((pro: string, index: number) => (
                        <Badge 
                          key={index} 
                          variant="outline"
                          className="text-sm font-medium border-primary/30 text-primary bg-primary/5"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {pro.length > 50 ? `${pro.substring(0, 47)}...` : pro}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 lg:flex-col lg:w-48">
                  <Button
                    className="flex-1 lg:w-full"
                    onClick={() => window.open(broker.websiteUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Broker
                  </Button>
                  
                  <div className="flex gap-2 lg:w-full">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {broker.foundingYear}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Founded
                  </div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {broker.instruments?.reduce((total: number, inst: any) => total + (inst.totalCount || 0), 0) || 100}+
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Markets
                  </div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    ${broker.accountTypes?.[0]?.minDeposit || 100}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Min Deposit
                  </div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {broker.support?.supportHours || '24/5'}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Support
                  </div>
                </div>
              </div>
              
              {/* Broker Summary */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-base leading-relaxed text-foreground">
                  {broker.summary || broker.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 gap-1 h-auto p-1">
              <TabsTrigger value="overview" className="text-xs md:text-sm py-2 px-1 md:px-3">
                Overview
              </TabsTrigger>
              <TabsTrigger value="fees" className="text-xs md:text-sm py-2 px-1 md:px-3">
                Fees
              </TabsTrigger>
              <TabsTrigger value="platforms" className="text-xs md:text-sm py-2 px-1 md:px-3">
                Platforms
              </TabsTrigger>
              <TabsTrigger value="safety" className="text-xs md:text-sm py-2 px-1 md:px-3">
                Safety
              </TabsTrigger>
              <TabsTrigger value="account" className="text-xs md:text-sm py-2 px-1 md:px-3">
                Account
              </TabsTrigger>
              <TabsTrigger value="conditions" className="text-xs md:text-sm py-2 px-1 md:px-3">
                Conditions
              </TabsTrigger>
              <TabsTrigger value="products" className="text-xs md:text-sm py-2 px-1 md:px-3">
                Products
              </TabsTrigger>
              <TabsTrigger value="support" className="text-xs md:text-sm py-2 px-1 md:px-3">
                Support
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Why Choose {broker.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3">Key Advantages</h3>
                      <ul className="space-y-2 text-sm">
                        {broker.prosAndCons?.pros?.map((pro: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-700 dark:text-red-300 mb-3">Considerations</h3>
                      <ul className="space-y-2 text-sm">
                        {broker.prosAndCons?.cons?.map((con: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                              <div className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400"></div>
                            </div>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fees Tab */}
            <TabsContent value="fees" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trading Fees & Costs</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive fee breakdown for {broker.name}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Trading Fees</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Spread Type:</span>
                          <span className="font-medium">{broker.fees?.spreadType || 'Variable'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>EUR/USD Spread:</span>
                          <span className="font-medium">{broker.fees?.eurUsdSpread || '1.0'} pips</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Commission:</span>
                          <span className="font-medium">{broker.fees?.commissionStructure || 'No commission'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Account Fees</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Inactivity Fee:</span>
                          <span className="font-medium">{broker.fees?.inactivityFee || 'None'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Withdrawal Fee:</span>
                          <span className="font-medium">{broker.fees?.withdrawalFee || 'None'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deposit Fee:</span>
                          <span className="font-medium">{broker.fees?.depositFee || 'None'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs would follow similar pattern... */}
            {/* For brevity, I'll show the structure for the remaining tabs */}

            <TabsContent value="platforms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trading Platforms</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Available trading platforms from {broker.name}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {broker.platforms?.map((platform: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          <Monitor className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">{platform.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {platform.type} platform with advanced features
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {platform.apiAccess && (
                            <Badge variant="secondary" className="text-xs">API Access</Badge>
                          )}
                          {platform.eaSupport && (
                            <Badge variant="secondary" className="text-xs">EA Support</Badge>
                          )}
                          {platform.indicatorsCount && (
                            <Badge variant="secondary" className="text-xs">{platform.indicatorsCount}+ Indicators</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Add other tab contents following similar pattern */}
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => window.open(broker.websiteUrl, '_blank')}>
                Visit Website
              </Button>
            </CardContent>
          </Card>

          {/* Regulation Info */}
          <Card>
            <CardHeader>
              <CardTitle>Regulation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {broker.regulations?.map((regulation: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <div>
                      <span className="text-sm font-medium">{regulation.regulator}</span>
                      <div className="text-xs text-muted-foreground">
                        License: {regulation.licenseNumber}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="font-medium">Headquarters</div>
                  <div className="text-muted-foreground">{broker.headquarters}</div>
                </div>
                <div>
                  <div className="font-medium">Founded</div>
                  <div className="text-muted-foreground">{broker.foundingYear}</div>
                </div>
                <div>
                  <div className="font-medium">Support</div>
                  <div className="text-muted-foreground">{broker.support?.supportHours || '24/5'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BrokerDetailPageTemplate;