import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const ForexCorrelationQuizPage: React.FC = () => {
    const { forexCorrelationQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.forexCorrelation.title')}
            quizData={forexCorrelationQuiz}
            quizKey="forex-correlation"
        />
    );
};

export default ForexCorrelationQuizPage;
