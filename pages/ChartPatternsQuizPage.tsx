import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const ChartPatternsQuizPage: React.FC = () => {
    const { chartPatternsQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.chartPatterns.title')}
            quizData={chartPatternsQuiz}
            quizKey="chart-patterns"
        />
    );
};

export default ChartPatternsQuizPage;
