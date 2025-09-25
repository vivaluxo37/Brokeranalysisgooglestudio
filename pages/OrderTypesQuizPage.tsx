import React from 'react';
import { useQuizData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import QuizComponent from '../components/common/QuizComponent';

const OrderTypesQuizPage: React.FC = () => {
    const { orderTypesQuiz } = useQuizData();
    const { t } = useTranslation();

    return (
        <QuizComponent 
            quizTitle={t('education.quizzes.orders.title')}
            quizData={orderTypesQuiz}
            quizKey="order-types"
        />
    );
};

export default OrderTypesQuizPage;