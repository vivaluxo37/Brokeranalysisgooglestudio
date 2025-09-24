import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const TradingPlatformsQuizPage: React.FC = () => {
    const { tradingPlatformsQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.platforms.title')}
            quizData={tradingPlatformsQuiz}
        />
    );
};

export default TradingPlatformsQuizPage;