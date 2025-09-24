import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const CopyTradingQuizPage: React.FC = () => {
    const { copyTradingQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.copy.title')}
            quizData={copyTradingQuiz}
        />
    );
};

export default CopyTradingQuizPage;