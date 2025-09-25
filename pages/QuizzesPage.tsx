import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import Card, { CardContent } from '../components/ui/Card';
import { Icons } from '../constants';
import Button from '../components/ui/Button';
import { useTranslation } from '../hooks/useTranslation';
import { quizzes as quizData } from '../data/quizzes';

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

    const quizzes = quizData.map(q => ({
        to: q.path,
        icon: <q.icon className="h-8 w-8" />,
        title: t(q.titleKey),
        description: t(q.descriptionKey)
    }));

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