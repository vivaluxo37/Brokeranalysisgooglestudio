import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const PipQuizPage: React.FC = () => {
    const { pipsQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.pips.title')}
            quizData={pipsQuiz}
            quizKey="pips"
        />
    );
};

export default PipQuizPage;
