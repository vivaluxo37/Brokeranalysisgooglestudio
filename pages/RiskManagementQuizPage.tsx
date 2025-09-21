import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const RiskManagementQuizPage: React.FC = () => {
    const { riskManagementQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.risk.title')}
            quizData={riskManagementQuiz}
        />
    );
};

export default RiskManagementQuizPage;