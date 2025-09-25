import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const MovingAveragesQuizPage: React.FC = () => {
    const { movingAveragesQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.movingAverages.title')}
            quizData={movingAveragesQuiz}
            quizKey="moving-averages"
        />
    );
};

export default MovingAveragesQuizPage;
