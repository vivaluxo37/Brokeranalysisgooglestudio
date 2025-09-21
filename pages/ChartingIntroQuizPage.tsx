import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const ChartingIntroQuizPage: React.FC = () => {
    const { chartingIntroQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.charting.title')}
            quizData={chartingIntroQuiz}
        />
    );
};

export default ChartingIntroQuizPage;