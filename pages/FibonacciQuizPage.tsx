import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const FibonacciQuizPage: React.FC = () => {
    const { fibonacciQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.fibonacci.title')}
            quizData={fibonacciQuiz}
            quizKey="fibonacci-retracement"
        />
    );
};

export default FibonacciQuizPage;
