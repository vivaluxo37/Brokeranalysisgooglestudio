import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const LotSizesQuizPage: React.FC = () => {
    const { lotSizesQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.lotSizes.title')}
            quizData={lotSizesQuiz}
            quizKey="lot-sizes"
        />
    );
};

export default LotSizesQuizPage;
