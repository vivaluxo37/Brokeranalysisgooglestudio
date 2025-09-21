import { useTranslation } from '../hooks/useTranslation';

const createQuiz = (t: any, key: string) => {
    return Array.from({ length: 5 }, (_, i) => {
        const qKey = `education.quizzes.${key}.q${i + 1}`;
        return {
            question: t(`${qKey}.question`),
            options: t(`${qKey}.options`),
            correctAnswer: t(`${qKey}.correctAnswer`),
            explanation: t(`${qKey}.explanation`),
        };
    });
};

export const useQuizData = () => {
    const { t } = useTranslation();

    const brokerFeesQuiz = createQuiz(t, 'fees');
    const forexBasicsQuiz = createQuiz(t, 'basics');
    const chartingIntroQuiz = createQuiz(t, 'charting');
    const riskManagementQuiz = createQuiz(t, 'risk');
    const orderTypesQuiz = createQuiz(t, 'orders');

    return { 
        brokerFeesQuiz,
        forexBasicsQuiz,
        chartingIntroQuiz,
        riskManagementQuiz,
        orderTypesQuiz,
     };
};


export const useWebinarData = () => {
    const { t } = useTranslation();

    const webinars = {
        upcoming: [
            {
                title: t('education.webinars.upcoming.0.title'),
                speaker: t('education.webinars.upcoming.0.speaker'),
                date: t('education.webinars.upcoming.0.date'),
                description: t('education.webinars.upcoming.0.description'),
            },
            {
                title: t('education.webinars.upcoming.1.title'),
                speaker: t('education.webinars.upcoming.1.speaker'),
                date: t('education.webinars.upcoming.1.date'),
                description: t('education.webinars.upcoming.1.description'),
            },
        ],
        past: [
            {
                title: t('education.webinars.past.0.title'),
                speaker: t('education.webinars.past.0.speaker'),
                date: t('education.webinars.past.0.date'),
                description: t('education.webinars.past.0.description'),
            },
            {
                title: t('education.webinars.past.1.title'),
                speaker: t('education.webinars.past.1.speaker'),
                date: t('education.webinars.past.1.date'),
                description: t('education.webinars.past.1.description'),
            },
        ]
    };
    
    return { webinars };
};