import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const RsiIndicatorQuizPage: React.FC = () => {
    const { rsiIndicatorQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.rsiIndicator.title')}
            quizData={rsiIndicatorQuiz}
            quizKey="rsi-indicator"
        />
    );
};

export default RsiIndicatorQuizPage;
