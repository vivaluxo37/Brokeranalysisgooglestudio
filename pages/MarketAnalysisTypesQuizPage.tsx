import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const MarketAnalysisTypesQuizPage: React.FC = () => {
    const { analysisTypesQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.analysisTypes.title')}
            quizData={analysisTypesQuiz}
            quizKey="analysis-types"
        />
    );
};

export default MarketAnalysisTypesQuizPage;
