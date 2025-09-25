import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const CarryTradeQuizPage: React.FC = () => {
    const { carryTradeQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.carryTrade.title')}
            quizData={carryTradeQuiz}
            quizKey="carry-trade"
        />
    );
};

export default CarryTradeQuizPage;
