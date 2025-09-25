import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const SupportResistanceQuizPage: React.FC = () => {
    const { supportResistanceQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.supportResistance.title')}
            quizData={supportResistanceQuiz}
            quizKey="support-resistance"
        />
    );
};

export default SupportResistanceQuizPage;
