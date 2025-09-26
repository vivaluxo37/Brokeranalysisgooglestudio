import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Icons } from '../../constants';
import { useEducation } from '../../hooks/useEducation';
import { useTranslation } from '../../hooks/useTranslation';
import { quizzes as allQuizzes } from '../../data/quizzes';
import { Button } from '../ui/button';

const EducationProgress: React.FC = () => {
    const { progress } = useEducation();
    const { t } = useTranslation();

    const completedQuizzes = Object.keys(progress.quizzes);
    const totalQuizzes = allQuizzes.length;
    const progressPercentage = totalQuizzes > 0 ? (completedQuizzes.length / totalQuizzes) * 100 : 0;
    
    const nextQuiz = allQuizzes.find(q => !completedQuizzes.includes(q.key));

    return (
        <Card>
            <CardHeader>
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                    <Icons.bookOpen className="h-6 w-6 text-primary-400" />
                    My Progress
                </h2>
            </CardHeader>
            <CardContent>
                {completedQuizzes.length === 0 && !nextQuiz ? (
                    <div className="text-center py-8">
                        <p className="text-card-foreground/70">Start learning by taking your first quiz!</p>
                        <Link to="/education/quizzes">
                            <Button variant="secondary" className="mt-4">Explore Quizzes</Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-semibold text-card-foreground">Quiz Completion</h3>
                                <span className="text-sm font-bold text-primary-400">{completedQuizzes.length} / {totalQuizzes}</span>
                            </div>
                            <div className="w-full bg-input rounded-full h-2.5">
                                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                        </div>

                        {completedQuizzes.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-sm text-card-foreground/80 mb-2">Completed:</h4>
                                <div className="space-y-2">
                                    {completedQuizzes.map(key => {
                                        const quizInfo = allQuizzes.find(q => q.key === key);
                                        const result = progress.quizzes[key];
                                        if (!quizInfo || !result) return null;
                                        return (
                                            <div key={key} className="flex justify-between items-center p-2 bg-input/50 rounded-md text-sm">
                                                <Link to={quizInfo.path} className="text-primary-400 hover:underline">{t(quizInfo.titleKey)}</Link>
                                                <span className="font-semibold">{result.score}/{result.total}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                        
                        {nextQuiz && (
                            <div className="mt-6 pt-6 border-t border-input">
                                 <h4 className="font-semibold text-sm text-card-foreground/80 mb-3 text-center">Ready for your next challenge?</h4>
                                 <Link to={nextQuiz.path} className="group block">
                                    <div className="bg-input/50 p-4 rounded-lg hover:bg-input transition-colors">
                                        <h3 className="font-bold text-card-foreground group-hover:text-primary-400">{t(nextQuiz.titleKey)}</h3>
                                        <p className="text-xs text-card-foreground/70 mt-1">{t(nextQuiz.descriptionKey)}</p>
                                    </div>
                                 </Link>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default EducationProgress;
