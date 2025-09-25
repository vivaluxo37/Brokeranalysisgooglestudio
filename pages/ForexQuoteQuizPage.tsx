import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const ForexQuoteQuizPage: React.FC = () => {
    const { forexQuoteQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.forexQuote.title')}
            quizData={forexQuoteQuiz}
            quizKey="forex-quote"
        />
    );
};

export default ForexQuoteQuizPage;
