import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  User,
  FileText,
  CreditCard,
  Smartphone,
  CheckCircle,
  Clock,
  AlertCircle,
  Info,
  Upload,
  Shield,
  Globe,
  Calendar,
  DollarSign,
  Settings
} from 'lucide-react';

interface AccountStep {
  id: number;
  title: string;
  description: string;
  duration: string;
  required: boolean;
  documents?: string[];
  tips?: string[];
  icon: React.ReactNode;
}

interface TimelineEvent {
  day: number;
  event: string;
  description: string;
  status: 'completed' | 'pending' | 'processing';
}

const AccountOpeningGuide: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [accountType, setAccountType] = useState<'individual' | 'institutional'>('individual');

  const accountSteps: AccountStep[] = [
    {
      id: 1,
      title: 'Online Application',
      description: 'Complete the digital application form with personal and financial information',
      duration: '15-30 minutes',
      required: true,
      tips: [
        'Have your personal identification ready',
        'Prepare financial information for income verification',
        'Choose your account type and base currency wisely',
        'Double-check all information before submission'
      ],
      icon: <User className="w-5 h-5" />
    },
    {
      id: 2,
      title: 'Identity Verification',
      description: 'Submit required documents for identity and address verification',
      duration: '1-2 hours',
      required: true,
      documents: [
        'Government-issued ID (Passport/Driver License)',
        'Proof of address (Utility bill/Bank statement)',
        'Tax identification number',
        'Income verification (Recent pay stubs/tax returns)'
      ],
      tips: [
        'Documents must be clear and unexpired',
        'Upload high-quality scans or photos',
        'Address proof must be recent (within 3 months)',
        'Ensure all corners of documents are visible'
      ],
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 3,
      title: 'Financial Profile',
      description: 'Complete trading experience questionnaire and risk assessment',
      duration: '20-40 minutes',
      required: true,
      tips: [
        'Be honest about your trading experience',
        'Understand your risk tolerance',
        'Declare your investment objectives clearly',
        'Provide accurate financial information'
      ],
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 4,
      title: 'Account Configuration',
      description: 'Set up trading permissions, account features, and security settings',
      duration: '10-15 minutes',
      required: true,
      tips: [
        'Choose appropriate trading permissions',
        'Set up two-factor authentication',
        'Configure trading platform preferences',
        'Set up security questions and alerts'
      ],
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 5,
      title: 'Funding',
      description: 'Deposit initial funds to activate your trading account',
      duration: '1-3 days',
      required: true,
      tips: [
        'Minimum deposit varies by account type',
        'Bank transfers are the safest method',
        'Consider funding in your base currency',
        'Keep transaction receipts for records'
      ],
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      id: 6,
      title: 'Platform Setup',
      description: 'Download and configure your preferred trading platform',
      duration: '30-60 minutes',
      required: false,
      tips: [
        'Choose platform based on your experience level',
        'Complete platform tutorials',
        'Set up watchlists and alerts',
        'Practice with paper trading first'
      ],
      icon: <Smartphone className="w-5 h-5" />
    }
  ];

  const timelineEvents: TimelineEvent[] = [
    {
      day: 0,
      event: 'Application Submitted',
      description: 'Your online application is received and entered into the system',
      status: 'pending'
    },
    {
      day: 1,
      event: 'Document Verification',
      description: 'KYC team reviews your submitted documents and information',
      status: 'pending'
    },
    {
      day: 2,
      event: 'Compliance Review',
      description: 'Final compliance checks and risk assessment',
      status: 'pending'
    },
    {
      day: 3,
      event: 'Account Approval',
      description: 'Account is approved and trading permissions are granted',
      status: 'pending'
    },
    {
      day: 4,
      event: 'Platform Access',
      description: 'Receive login credentials and access to trading platforms',
      status: 'pending'
    }
  ];

  const accountTypes = [
    {
      type: 'individual',
      name: 'Individual Account',
      description: 'Standard account for personal trading',
      minDeposit: 0,
      processingTime: '1-3 business days',
      features: ['Full market access', 'Margin trading', 'API access', 'Mobile trading']
    },
    {
      type: 'institutional',
      name: 'Institutional Account',
      description: 'For businesses, trusts, and organizations',
      minDeposit: 10000,
      processingTime: '3-5 business days',
      features: ['Multi-user access', 'Advanced reporting', 'Dedicated support', 'Custom solutions']
    }
  ];

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'current': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'current':
        return <Clock className="w-4 h-4" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Account Opening Guide
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          A comprehensive guide to opening your Interactive Brokers account. The process typically takes 1-3 business days.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Account Type Selection */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-3">Choose Account Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accountTypes.map((accType) => (
              <div
                key={accType.type}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  accountType === accType.type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setAccountType(accType.type as 'individual' | 'institutional')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold">{accType.name}</h5>
                  {accountType === accType.type && (
                    <Badge variant="default">Selected</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{accType.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Min Deposit:</span>
                    <span className="font-medium">${accType.minDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing:</span>
                    <span className="font-medium">{accType.processingTime}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {accType.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="steps" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="steps">Step-by-Step</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="tips">Tips & Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="steps" className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Application Progress</span>
                <span>Step {currentStep + 1} of {accountSteps.length}</span>
              </div>
              <Progress value={((currentStep + 1) / accountSteps.length) * 100} className="h-2" />
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {accountSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 border rounded-lg transition-all ${
                    getStepStatus(index) === 'current' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${getStatusColor(getStepStatus(index))}`}>
                      {getStatusIcon(getStepStatus(index))}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{step.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {step.duration}
                        </Badge>
                        {step.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

                      {step.documents && (
                        <div className="mb-3">
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            Required Documents:
                          </h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {step.documents.map((doc) => (
                              <li key={doc} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.tips && (
                        <div>
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                            <Info className="w-4 h-4" />
                            Pro Tips:
                          </h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {step.tips.map((tip) => (
                              <li key={tip} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {index === currentStep && (
                        <Button
                          onClick={() => setCurrentStep(index + 1)}
                          className="mt-4"
                          size="sm"
                        >
                          Continue to Next Step
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div className="space-y-4">
              {timelineEvents.map((event, index) => (
                <div key={event.day} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(event.status)}`}>
                      <span className="text-sm font-medium">{event.day}</span>
                    </div>
                    {index < timelineEvents.length - 1 && (
                      <div className="w-px h-16 bg-gray-300 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 p-4 border rounded-lg">
                    <h4 className="font-semibold mb-1">{event.event}</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <Badge variant="outline" className="text-xs mt-2">
                      Day {event.day}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Processing Time:</h4>
                  <p className="text-blue-700 text-sm">
                    Most accounts are approved within 1-3 business days. Institutional accounts may take 3-5 business days.
                    Processing times may vary based on application complexity and document verification.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            {/* Requirements */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                General Requirements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Personal Information</h5>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Valid government-issued ID</li>
                    <li>• Proof of address</li>
                    <li>• Tax identification number</li>
                    <li>• Contact information</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Financial Information</h5>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Income verification</li>
                    <li>• Net worth declaration</li>
                    <li>• Investment experience</li>
                    <li>• Risk tolerance assessment</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tips for Success */}
            <div className="p-4 bg-green-50/50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Tips for Faster Approval:</h4>
                  <ul className="text-green-700 space-y-1 text-sm">
                    <li>• Submit clear, readable documents</li>
                    <li>• Ensure all information is accurate and consistent</li>
                    <li>• Use documents issued within the last 3 months</li>
                    <li>• Respond promptly to any verification requests</li>
                    <li>• Check your email regularly for updates</li>
                    <li>• Consider using the GlobalTrader app for faster processing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-900 mb-2">Common Issues to Avoid:</h4>
                  <ul className="text-amber-700 space-y-1 text-sm">
                    <li>• Uploading expired or unclear documents</li>
                    <li>• Providing inconsistent personal information</li>
                    <li>• Missing signatures or required fields</li>
                    <li>• Using unsupported document formats</li>
                    <li>• Not meeting minimum age requirements (18+)</li>
                    <li>• Applying from restricted countries</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Ready to Open Your Account?</h4>
              <p className="text-blue-700 text-sm">
                Start your application process with Interactive Brokers today
              </p>
            </div>
            <Button
              onClick={() => window.open('https://www.interactivebrokers.com/en/index.php?f=14099', '_blank')}
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Start Application
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountOpeningGuide;