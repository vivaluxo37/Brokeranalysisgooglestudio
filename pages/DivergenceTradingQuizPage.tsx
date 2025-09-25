import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const DivergenceTradingQuizPage: React.FC = () => {
    const { divergenceQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.divergence.title')}
            quizData={divergenceQuiz}
            quizKey="divergence-trading"
        />
    );
};

export default DivergenceTradingQuizPage;
