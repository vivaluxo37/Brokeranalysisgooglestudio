import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const CandlestickPatternsQuizPage: React.FC = () => {
    const { candlestickPatternsQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.candlestickPatterns.title')}
            quizData={candlestickPatternsQuiz}
            quizKey="candlestick-patterns"
        />
    );
};

export default CandlestickPatternsQuizPage;
