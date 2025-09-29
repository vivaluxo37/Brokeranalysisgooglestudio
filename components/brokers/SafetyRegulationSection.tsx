import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Shield,
  Globe,
  Building,
  Award,
  AlertTriangle,
  CheckCircle,
  Info,
  MapPin,
  Calendar,
  TrendingUp,
  FileText,
  Users
} from 'lucide-react';

interface RegulatoryEntity {
  country: string;
  protectionAmount: string;
  regulator: string;
  legalEntity: string;
  notes?: string;
}

interface RegulatoryInfo {
  regulators: string[];
  entities: RegulatoryEntity[];
  listedOn: string;
  founded: number;
  publicCompany: boolean;
  negativeBalanceProtection: boolean;
  segregatedAccounts: boolean;
  investorCompensation: boolean;
}

const SafetyRegulationSection: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');

  const regulatoryInfo: RegulatoryInfo = {
    regulators: ['SEC', 'FCA', 'ASIC', 'CIRO', 'CBI', 'SFC', 'MAS', 'Kanto Local Finance Bureau'],
    entities: [
      {
        country: 'UK',
        protectionAmount: '£85,000',
        regulator: 'Financial Conduct Authority (FCA)',
        legalEntity: 'Interactive Brokers (U.K.) Limited',
        notes: 'CFDs, non-US stock index options and futures'
      },
      {
        country: 'USA',
        protectionAmount: '$500,000 ($250,000 cash limit)',
        regulator: 'FINRA & SEC',
        legalEntity: 'Interactive Brokers LLC',
        notes: 'Notes, stocks, bonds, mutual funds and investment company shares'
      },
      {
        country: 'EU',
        protectionAmount: '€20,000',
        regulator: 'Central Bank of Ireland (CBI)',
        legalEntity: 'Interactive Brokers Ireland Limited',
        notes: 'Stocks, bonds, funds and US stock index options'
      },
      {
        country: 'Canada',
        protectionAmount: 'CAD 1,000,000',
        regulator: 'Canadian Investment Regulatory Organization (CIRO)',
        legalEntity: 'Interactive Brokers Canada Inc.',
        notes: 'Full protection for Canadian clients'
      },
      {
        country: 'Australia',
        protectionAmount: 'No protection',
        regulator: 'Australian Securities & Investments Commission (ASIC)',
        legalEntity: 'Interactive Brokers Australia PTY LTD',
        notes: 'Professional clients only'
      },
      {
        country: 'India',
        protectionAmount: 'No protection',
        regulator: 'Securities and Exchange Board of India (BSE)',
        legalEntity: 'Interactive Brokers (India) PVT. LTD.',
        notes: 'Fund protection: INR 2.5 million'
      },
      {
        country: 'Japan',
        protectionAmount: 'No protection',
        regulator: 'Financial Services Agency (FSA)',
        legalEntity: 'Interactive Brokers Securities Japan Inc.',
        notes: 'Member of Japan Securities Dealers Association'
      },
      {
        country: 'Hong Kong',
        protectionAmount: 'HKD 500,000',
        regulator: 'Hong Kong Securities and Futures Commission',
        legalEntity: 'Interactive Brokers Hong Kong Limited',
        notes: 'Full regulatory protection'
      },
      {
        country: 'Singapore',
        protectionAmount: 'No protection',
        regulator: 'Monetary Authority of Singapore',
        legalEntity: 'Interactive Brokers Singapore Pte. Ltd.',
        notes: 'US investor protection applies to certain products'
      }
    ],
    listedOn: 'NASDAQ (IBKR)',
    founded: 1977,
    publicCompany: true,
    negativeBalanceProtection: true,
    segregatedAccounts: true,
    investorCompensation: true
  };

  const regions = [
    { id: 'all', label: 'All Regions' },
    { id: 'americas', label: 'Americas', countries: ['USA', 'Canada'] },
    { id: 'europe', label: 'Europe', countries: ['UK', 'EU'] },
    { id: 'asia-pacific', label: 'Asia Pacific', countries: ['Australia', 'Hong Kong', 'Singapore', 'Japan'] },
    { id: 'other', label: 'Other', countries: ['India'] }
  ];

  const filteredEntities = selectedRegion === 'all'
    ? regulatoryInfo.entities
    : regulatoryInfo.entities.filter(entity => {
        const region = regions.find(r => r.id === selectedRegion);
        return region?.countries.includes(entity.country);
      });

  const getProtectionColor = (amount: string) => {
    if (amount.includes('No')) return 'text-red-600 bg-red-100';
    if (amount.includes('500,000') || amount.includes('1,000,000')) return 'text-green-600 bg-green-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600 bg-green-100';
    if (score >= 8) return 'text-blue-600 bg-blue-100';
    if (score >= 7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Safety & Regulation
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Interactive Brokers is regulated by multiple top-tier financial authorities worldwide, ensuring maximum protection for traders' funds.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Trust Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Trust Score</span>
            </div>
            <div className="text-3xl font-bold text-green-900">9.8/10</div>
            <Badge className={`${getTrustScoreColor(9.8)} mt-1`}>
              Excellent
            </Badge>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Regulators</span>
            </div>
            <div className="text-3xl font-bold text-blue-900">{regulatoryInfo.regulators.length}</div>
            <div className="text-xs text-blue-700 mt-1">Top-tier authorities</div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Public Company</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{regulatoryInfo.listedOn}</div>
            <Badge variant="secondary" className="text-xs mt-1">
              Since {regulatoryInfo.founded}
            </Badge>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Experience</span>
            </div>
            <div className="text-3xl font-bold text-orange-900">
              {new Date().getFullYear() - regulatoryInfo.founded}
            </div>
            <div className="text-xs text-orange-700 mt-1">Years in business</div>
          </div>
        </div>

        {/* Safety Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <div className="font-medium">Segregated Accounts</div>
              <div className="text-sm text-muted-foreground">
                Client funds kept separate from company funds
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <div className="font-medium">Negative Balance Protection</div>
              <div className="text-sm text-muted-foreground">
                Protection against losses exceeding account balance
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <div className="font-medium">Investor Compensation</div>
              <div className="text-sm text-muted-foreground">
                Coverage up to $500,000 for eligible clients
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Information */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="regional">Regional Details</TabsTrigger>
            <TabsTrigger value="background">Company Background</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Regulatory Authorities */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Regulatory Authorities
              </h4>
              <div className="flex flex-wrap gap-2">
                {regulatoryInfo.regulators.map((regulator) => (
                  <Badge key={regulator} variant="default" className="text-sm">
                    {regulator}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Key Safety Points */}
            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Why Interactive Brokers is Safe:</h4>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>• Regulated by 8+ top-tier financial authorities worldwide</li>
                    <li>• Publicly traded company on NASDAQ since 2007</li>
                    <li>• Over 45 years of experience in the brokerage industry</li>
                    <li>• Strong financial position with billions in equity capital</li>
                    <li>• Advanced risk management and monitoring systems</li>
                    <li>• Regular audits and transparent financial reporting</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="regional" className="space-y-4">
            {/* Region Filter */}
            <div className="flex gap-2 flex-wrap">
              {regions.map((region) => (
                <Button
                  key={region.id}
                  variant={selectedRegion === region.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRegion(region.id)}
                >
                  {region.label}
                </Button>
              ))}
            </div>

            {/* Regional Entities */}
            <div className="space-y-4">
              {filteredEntities.map((entity) => (
                <div key={entity.country} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <h4 className="font-semibold">{entity.country}</h4>
                    </div>
                    <Badge className={getProtectionColor(entity.protectionAmount)}>
                      {entity.protectionAmount}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-medium text-muted-foreground">Regulator</div>
                      <div>{entity.regulator}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Legal Entity</div>
                      <div className="text-xs">{entity.legalEntity}</div>
                    </div>
                  </div>

                  {entity.notes && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <Info className="w-3 h-3 inline mr-1" />
                      {entity.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="background" className="space-y-4">
            {/* Company History */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Company Background
              </h4>
              <div className="space-y-3 text-sm">
                <p>
                  Interactive Brokers was founded in 1977 by Thomas Peterffy and has grown to become one of the largest
                  and most respected brokerage firms in the world. The company went public on NASDAQ in 2007 (ticker: IBKR)
                  and is included in the S&P 500 index.
                </p>
                <p>
                  With headquarters in Greenwich, Connecticut, Interactive Brokers serves clients in over 200 countries
                  and territories, offering access to more than 150 markets worldwide.
                </p>
              </div>
            </div>

            {/* Financial Strength */}
            <div className="p-4 bg-green-50/50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Financial Strength:</h4>
                  <ul className="text-green-700 space-y-1 text-sm">
                    <li>• Market capitalization: $60+ billion</li>
                    <li>• Equity capital: $10+ billion</li>
                    <li>• Consistent profitability for decades</li>
                    <li>• Advanced risk management systems</li>
                    <li>• Regular regulatory audits and compliance</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Developments */}
            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Recent Safety Enhancements:</h4>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>• Enhanced cybersecurity measures and two-factor authentication</li>
                    <li>• Expanded regulatory coverage in new jurisdictions</li>
                    <li>• Improved client asset protection protocols</li>
                    <li>• Advanced fraud detection and prevention systems</li>
                    <li>• Regular third-party security audits</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Important Notice */}
        <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-lg border border-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-amber-900 mb-1">Important Notice:</div>
            <p className="text-amber-700">
              Regulatory protection amounts and eligibility vary by jurisdiction and account type.
              Professional clients may have different protection levels. Always verify the specific
              protection applicable to your account type and region.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyRegulationSection;