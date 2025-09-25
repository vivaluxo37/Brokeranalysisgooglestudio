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
    const currencyPairsQuiz = createQuiz(t, 'currencyPairs');
    const pipsQuiz = createQuiz(t, 'pips');
    const lotSizesQuiz = createQuiz(t, 'lotSizes');
    const forexQuoteQuiz = createQuiz(t, 'forexQuote');
    const analysisTypesQuiz = createQuiz(t, 'analysisTypes');
    const candlestickPatternsQuiz = createQuiz(t, 'candlestickPatterns');
    const supportResistanceQuiz = createQuiz(t, 'supportResistance');
    const movingAveragesQuiz = createQuiz(t, 'movingAverages');
    const chartPatternsQuiz = createQuiz(t, 'chartPatterns');
    const rsiIndicatorQuiz = createQuiz(t, 'rsiIndicator');
    const economicIndicatorsQuiz = createQuiz(t, 'economicIndicators');
    const tradingPsychologyQuiz = createQuiz(t, 'tradingPsychology');
    const centralBanksQuiz = createQuiz(t, 'centralBanks');
    const leverageMarginQuiz = createQuiz(t, 'leverageMargin');
    const fibonacciQuiz = createQuiz(t, 'fibonacci');
    const elliottWaveQuiz = createQuiz(t, 'elliottWave');
    const divergenceQuiz = createQuiz(t, 'divergence');
    const harmonicPatternsQuiz = createQuiz(t, 'harmonicPatterns');
    const carryTradeQuiz = createQuiz(t, 'carryTrade');
    const forexCorrelationQuiz = createQuiz(t, 'forexCorrelation');

    return { 
        brokerFeesQuiz,
        forexBasicsQuiz,
        chartingIntroQuiz,
        riskManagementQuiz,
        orderTypesQuiz,
        currencyPairsQuiz,
        pipsQuiz,
        lotSizesQuiz,
        forexQuoteQuiz,
        analysisTypesQuiz,
        candlestickPatternsQuiz,
        supportResistanceQuiz,
        movingAveragesQuiz,
        chartPatternsQuiz,
        rsiIndicatorQuiz,
        economicIndicatorsQuiz,
        tradingPsychologyQuiz,
        centralBanksQuiz,
        leverageMarginQuiz,
        fibonacciQuiz,
        elliottWaveQuiz,
        divergenceQuiz,
        harmonicPatternsQuiz,
        carryTradeQuiz,
        forexCorrelationQuiz,
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
