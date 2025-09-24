import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const FundamentalAnalysisQuizPage: React.FC = () => {
    const { fundamentalAnalysisQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.fundamental.title')}
            quizData={fundamentalAnalysisQuiz}
        />
    );
};

export default FundamentalAnalysisQuizPage;