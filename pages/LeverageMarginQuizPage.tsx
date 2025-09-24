import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const LeverageMarginQuizPage: React.FC = () => {
    const { leverageMarginQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.leverage.title')}
            quizData={leverageMarginQuiz}
        />
    );
};

export default LeverageMarginQuizPage;