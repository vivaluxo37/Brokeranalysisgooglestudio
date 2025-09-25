import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const EconomicIndicatorsQuizPage: React.FC = () => {
    const { economicIndicatorsQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.economicIndicators.title')}
            quizData={economicIndicatorsQuiz}
            quizKey="economic-indicators"
        />
    );
};

export default EconomicIndicatorsQuizPage;
