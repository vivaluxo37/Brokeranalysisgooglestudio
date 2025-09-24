import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const TechnicalIndicatorsQuizPage: React.FC = () => {
    const { technicalIndicatorsQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.indicators.title')}
            quizData={technicalIndicatorsQuiz}
        />
    );
};

export default TechnicalIndicatorsQuizPage;