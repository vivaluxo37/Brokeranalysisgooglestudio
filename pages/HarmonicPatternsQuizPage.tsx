import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const HarmonicPatternsQuizPage: React.FC = () => {
    const { harmonicPatternsQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.harmonicPatterns.title')}
            quizData={harmonicPatternsQuiz}
            quizKey="harmonic-patterns"
        />
    );
};

export default HarmonicPatternsQuizPage;
