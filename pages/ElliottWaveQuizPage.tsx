import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const ElliottWaveQuizPage: React.FC = () => {
    const { elliottWaveQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.elliottWave.title')}
            quizData={elliottWaveQuiz}
            quizKey="elliott-wave"
        />
    );
};

export default ElliottWaveQuizPage;
