import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  BookOpen,
  Video,
  GraduationCap,
  Code,
  Users,
  FileText,
  Download,
  ExternalLink,
  Clock,
  Star,
  CheckCircle,
  PlayCircle,
  Book,
  Monitor
} from 'lucide-react';

interface EducationalResource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'webinar' | 'course' | 'documentation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  rating?: number;
  category: string;
  externalLink?: string;
  tags: string[];
  icon: React.ReactNode;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  steps: string[];
  icon: React.ReactNode;
}

const EducationalResources: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const resources: EducationalResource[] = [
    {
      id: 'getting-started',
      title: 'Getting Started with Interactive Brokers',
      description: 'Complete guide to setting up your IBKR account and making your first trade',
      type: 'guide',
      difficulty: 'beginner',
      duration: '15 min read',
      rating: 4.8,
      category: 'getting-started',
      tags: ['account setup', 'first trade', 'platform basics'],
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 'tws-tutorial',
      title: 'Trader Workstation (TWS) Complete Tutorial',
      description: 'Master the powerful TWS platform with this comprehensive video tutorial',
      type: 'video',
      difficulty: 'intermediate',
      duration: '45 min',
      rating: 4.9,
      category: 'platforms',
      tags: ['TWS', 'platform', 'tutorial', 'advanced features'],
      icon: <Video className="w-5 h-5" />
    },
    {
      id: 'options-trading',
      title: 'Options Trading Strategies',
      description: 'Learn advanced options trading strategies and risk management techniques',
      type: 'course',
      difficulty: 'advanced',
      duration: '2 hours',
      rating: 4.7,
      category: 'trading-strategies',
      tags: ['options', 'strategies', 'risk management', 'advanced'],
      icon: <GraduationCap className="w-5 h-5" />
    },
    {
      id: 'api-documentation',
      title: 'IBKR API Documentation',
      description: 'Complete API reference and code examples for automated trading',
      type: 'documentation',
      difficulty: 'advanced',
      category: 'api',
      tags: ['API', 'automation', 'coding', 'algorithmic trading'],
      icon: <Code className="w-5 h-5" />
    },
    {
      id: 'risk-management',
      title: 'Risk Management Essentials',
      description: 'Learn how to manage risk effectively in your trading activities',
      type: 'webinar',
      difficulty: 'intermediate',
      duration: '1 hour',
      rating: 4.6,
      category: 'risk-management',
      tags: ['risk management', 'portfolio protection', 'trading psychology'],
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'market-analysis',
      title: 'Technical Analysis Fundamentals',
      description: 'Master technical analysis techniques and chart patterns',
      type: 'course',
      difficulty: 'intermediate',
      duration: '3 hours',
      rating: 4.5,
      category: 'analysis',
      tags: ['technical analysis', 'charts', 'patterns', 'indicators'],
      icon: <Monitor className="w-5 h-5" />
    }
  ];

  const learningPaths: LearningPath[] = [
    {
      id: 'beginner-path',
      title: 'Beginner Trader Path',
      description: 'Start your trading journey with Interactive Brokers',
      level: 'Beginner',
      duration: '2-3 weeks',
      steps: [
        'Account setup and verification',
        'Platform familiarization (GlobalTrader)',
        'Basic order types and execution',
        'Understanding market data',
        'Making your first trades',
        'Risk management basics'
      ],
      icon: <Book className="w-5 h-5" />
    },
    {
      id: 'advanced-path',
      title: 'Advanced Trader Path',
      description: 'Master advanced trading strategies and tools',
      level: 'Advanced',
      duration: '4-6 weeks',
      steps: [
        'Advanced TWS features',
        'Options and futures trading',
        'Algorithmic trading basics',
        'API integration',
        'Advanced risk management',
        'Portfolio optimization'
      ],
      icon: <GraduationCap className="w-5 h-5" />
    },
    {
      id: 'developer-path',
      title: 'Developer Integration Path',
      description: 'Build automated trading systems with IBKR API',
      level: 'Developer',
      duration: '3-4 weeks',
      steps: [
        'API authentication and setup',
        'Market data retrieval',
        'Order placement automation',
        'Portfolio management',
        'Strategy backtesting',
        'Production deployment'
      ],
      icon: <Code className="w-5 h-5" />
    }
  ];

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'platforms', label: 'Platforms' },
    { id: 'trading-strategies', label: 'Trading Strategies' },
    { id: 'api', label: 'API & Development' },
    { id: 'risk-management', label: 'Risk Management' }
  ];

  const filteredResources = selectedCategory === 'all'
    ? resources
    : resources.filter(resource => resource.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'webinar': return <Users className="w-4 h-4" />;
      case 'course': return <GraduationCap className="w-4 h-4" />;
      case 'documentation': return <FileText className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Educational Resources
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Comprehensive learning resources to help you master Interactive Brokers platforms and trading strategies.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Learning Paths */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-4">Recommended Learning Paths</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningPaths.map((path) => (
              <div key={path.id} className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {path.icon}
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">{path.title}</h5>
                    <p className="text-xs text-muted-foreground">{path.level} • {path.duration}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{path.description}</p>
                <div className="space-y-1">
                  {path.steps.slice(0, 3).map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      {step}
                    </div>
                  ))}
                  {path.steps.length > 3 && (
                    <div className="text-xs text-muted-foreground">+{path.steps.length - 3} more steps</div>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Start Path
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4">
            {/* Resource Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getTypeIcon(resource.type)}
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm">{resource.title}</h5>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
                            {resource.difficulty}
                          </Badge>
                          {resource.duration && (
                            <Badge variant="outline" className="text-xs">
                              {resource.duration}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {resource.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{resource.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Rating and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{resource.rating}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        {resource.type === 'video' ? <PlayCircle className="w-4 h-4 mr-1" /> : <Book className="w-4 h-4 mr-1" />}
                        {resource.type === 'video' ? 'Watch' : 'Read'}
                      </Button>
                      {resource.externalLink && (
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Start Resources */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-3">Quick Start Resources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="p-2 bg-green-100 rounded-lg">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-sm">IBKR Mobile App Guide</h5>
                <p className="text-xs text-muted-foreground">Get started with mobile trading</p>
              </div>
              <Button variant="outline" size="sm">
                Download PDF
              </Button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Video className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-sm">Platform Video Tutorials</h5>
                <p className="text-xs text-muted-foreground">Step-by-step video guides</p>
              </div>
              <Button variant="outline" size="sm">
                Watch Videos
              </Button>
            </div>
          </div>
        </div>

        {/* Upcoming Webinars */}
        <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-900 mb-2">Upcoming Live Webinars</h4>
              <div className="text-amber-700 space-y-1 text-sm">
                <p>• <strong>Options Trading Masterclass</strong> - Tomorrow, 2:00 PM EST</p>
                <p>• <strong>API Workshop for Developers</strong> - Thursday, 4:00 PM EST</p>
                <p>• <strong>Risk Management Strategies</strong> - Friday, 1:00 PM EST</p>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Register for Webinars
              </Button>
            </div>
          </div>
        </div>

        {/* Community Resources */}
        <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-200">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-purple-900 mb-2">Community & Support</h4>
              <div className="text-purple-700 space-y-1 text-sm">
                <p>• Join our trader community forums</p>
                <p>• Access 24/5 customer support</p>
                <p>• Connect with other IBKR traders</p>
                <p>• Get help from experienced traders</p>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationalResources;