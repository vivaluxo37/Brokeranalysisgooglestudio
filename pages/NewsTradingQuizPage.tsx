import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const NewsTradingQuizPage: React.FC = () => {
    const { newsTradingQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.news.title')}
            quizData={newsTradingQuiz}
        />
    );
};

export default NewsTradingQuizPage;