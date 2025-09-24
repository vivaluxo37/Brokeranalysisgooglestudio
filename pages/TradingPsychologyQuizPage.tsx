import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const TradingPsychologyQuizPage: React.FC = () => {
    const { tradingPsychologyQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.psychology.title')}
            quizData={tradingPsychologyQuiz}
        />
    );
};

export default TradingPsychologyQuizPage;