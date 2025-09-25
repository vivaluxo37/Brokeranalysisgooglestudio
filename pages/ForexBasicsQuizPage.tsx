import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const ForexBasicsQuizPage: React.FC = () => {
    const { forexBasicsQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.basics.title')}
            quizData={forexBasicsQuiz}
            quizKey="forex-basics"
        />
    );
};

export default ForexBasicsQuizPage;