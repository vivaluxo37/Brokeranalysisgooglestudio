import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import Card, { CardContent } from '../components/ui/Card';
import { Icons } from '../constants';
import Button from '../components/ui/Button';
import { useTranslation } from '../hooks/useTranslation';

const QuizCard = ({ to, icon, title, description }: { to: string, icon: React.ReactNode, title: string, description: string }) => (
    <Card className="hover:border-primary-500/50 transition-colors">
        <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="p-4 bg-input rounded-full text-primary-400 flex-shrink-0">
                    {icon}
                </div>
                <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-xl font-bold text-card-foreground">{title}</h3>
                    <p className="mt-2 text-card-foreground/70">{description}</p>
                </div>
                <ReactRouterDOM.Link to={to}>
                    <Button variant="primary" className="mt-4 sm:mt-0">
                        Start Quiz <Icons.chevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </ReactRouterDOM.Link>
            </div>
        </CardContent>
    </Card>
);

const QuizzesPage: React.FC = () => {
    const { t } = useTranslation();

    const quizzes = [
        {
            to: '/education/quizzes/forex-basics',
            icon: <Icons.bookOpen className="h-8 w-8" />,
            title: t('education.quizzes.basics.title'),
            description: t('education.quizzes.basics.description')
        },
        {
            to: '/education/quizzes/broker-fees',
            icon: <Icons.data className="h-8 w-8" />,
            title: t('education.quizzes.fees.title'),
            description: t('education.quizzes.fees.description')
        },
        {
            to: '/education/quizzes/charting-intro',
            icon: <Icons.layers className="h-8 w-8" />,
            title: t('education.quizzes.charting.title'),
            description: t('education.quizzes.charting.description')
        },
        {
            to: '/education/quizzes/risk-management',
            icon: <Icons.shieldCheck className="h-8 w-8" />,
            title: t('education.quizzes.risk.title'),
            description: t('education.quizzes.risk.description')
        },
        {
            to: '/education/quizzes/order-types',
            icon: <Icons.cpu className="h-8 w-8" />,
            title: t('education.quizzes.orders.title'),
            description: t('education.quizzes.orders.description')
        },
        {
            to: '/education/quizzes/technical-indicators',
            icon: <Icons.trendingUp className="h-8 w-8" />,
            title: t('education.quizzes.indicators.title'),
            description: t('education.quizzes.indicators.description')
        },
        {
            to: '/education/quizzes/candlestick-patterns',
            icon: <Icons.layers className="h-8 w-8" />,
            title: t('education.quizzes.candlesticks.title'),
            description: t('education.quizzes.candlesticks.description')
        },
        {
            to: '/education/quizzes/fundamental-analysis',
            icon: <Icons.globe className="h-8 w-8" />,
            title: t('education.quizzes.fundamental.title'),
            description: t('education.quizzes.fundamental.description')
        },
        {
            to: '/education/quizzes/trading-psychology',
            icon: <Icons.brainCircuit className="h-8 w-8" />,
            title: t('education.quizzes.psychology.title'),
            description: t('education.quizzes.psychology.description')
        },
        {
            to: '/education/quizzes/leverage-margin',
            icon: <Icons.trendingUp className="h-8 w-8" />,
            title: t('education.quizzes.leverage.title'),
            description: t('education.quizzes.leverage.description')
        },
        {
            to: '/education/quizzes/trading-platforms',
            icon: <Icons.cpu className="h-8 w-8" />,
            title: t('education.quizzes.platforms.title'),
            description: t('education.quizzes.platforms.description')
        },
        {
            to: '/education/quizzes/copy-trading',
            icon: <Icons.users className="h-8 w-8" />,
            title: t('education.quizzes.copy.title'),
            description: t('education.quizzes.copy.description')
        },
        {
            to: '/education/quizzes/pips-lots',
            icon: <Icons.calculator className="h-8 w-8" />,
            title: t('education.quizzes.pips.title'),
            description: t('education.quizzes.pips.description')
        },
        {
            to: '/education/quizzes/news-trading',
            icon: <Icons.newspaper className="h-8 w-8" />,
            title: t('education.quizzes.news.title'),
            description: t('education.quizzes.news.description')
        },
        {
            to: '/education/quizzes/chart-patterns',
            icon: <Icons.layers className="h-8 w-8" />,
            title: t('education.quizzes.patterns.title'),
            description: t('education.quizzes.patterns.description')
        }
    ];

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">{t('education.quizzes.title')}</h1>
                <p className="mt-2 text-lg text-foreground/80">{t('education.quizzes.subtitle')}</p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
                {quizzes.map((quiz, index) => (
                    <div key={quiz.to} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 100}ms`}}>
                        <QuizCard {...quiz} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizzesPage;