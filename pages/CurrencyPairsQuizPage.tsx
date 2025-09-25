import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const CurrencyPairsQuizPage: React.FC = () => {
    const { currencyPairsQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.currencyPairs.title')}
            quizData={currencyPairsQuiz}
            quizKey="currency-pairs"
        />
    );
};

export default CurrencyPairsQuizPage;
