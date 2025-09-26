import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Icons } from '../constants';
import { Button } from '../components/ui/button';
import { useTranslation } from '../hooks/useTranslation';
import { quizzes as quizData } from '../data/quizzes';

const QuizCard = ({ to, icon, title, description }: { to: string, icon: React.ReactNode, title: string, description: string }) => (
    <Card className="hover:border-primary-500/50 transition-colors h-full">
        <CardContent className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-input rounded-full text-primary-400 flex-shrink-0">
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-card-foreground">{title}</h3>
                </div>
            </div>
            <p className="text-sm text-card-foreground/70 flex-grow">{description}</p>
            <Link to={to} className="mt-4 block">
                <Button variant="secondary" className="w-full">
                    Start Quiz <Icons.chevronRight className="h-4 w-4 ml-2" />
                </Button>
            </Link>
        </CardContent>
    </Card>
);

const QuizCategorySection: React.FC<{ title: string; quizzes: typeof quizData }> = ({ title, quizzes }) => {
    const { t } = useTranslation();
    
    if (quizzes.length === 0) return null;

    return (
        <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz, index) => {
                    const quizProps = {
                        to: quiz.path,
                        icon: <quiz.icon className="h-6 w-6" />,
                        title: t(quiz.titleKey),
                        description: t(quiz.descriptionKey)
                    };
                    return (
                        <div key={quiz.path} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 50}ms`}}>
                            <QuizCard {...quizProps} />
                        </div>
                    );
                })}
            </div>
        </section>
    );
};


const QuizzesPage: React.FC = () => {
    const { t } = useTranslation();

    const beginnerQuizzes = quizData.filter(q => q.category === 'Beginner');
    const intermediateQuizzes = quizData.filter(q => q.category === 'Intermediate');
    const advancedQuizzes = quizData.filter(q => q.category === 'Advanced');

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">{t('education.quizzes.title')}</h1>
                <p className="mt-2 text-lg text-foreground/80 max-w-3xl mx-auto">{t('education.quizzes.subtitle')}</p>
            </div>

            <div className="space-y-12">
                <QuizCategorySection title="Beginner" quizzes={beginnerQuizzes} />
                <QuizCategorySection title="Intermediate" quizzes={intermediateQuizzes} />
                <QuizCategorySection title="Advanced" quizzes={advancedQuizzes} />
            </div>
        </div>
    );
};

export default QuizzesPage;