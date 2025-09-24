import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const PipsAndLotsQuizPage: React.FC = () => {
    const { pipsAndLotsQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.pips.title')}
            quizData={pipsAndLotsQuiz}
        />
    );
};

export default PipsAndLotsQuizPage;