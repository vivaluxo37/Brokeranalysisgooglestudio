import React, { createContext, useState, useEffect, useCallback } from 'react';
import { OnboardingContextType, OnboardingStep } from '../types';

export const OnboardingContext = createContext<OnboardingContextType | null>(null);

const TOUR_STEPS: OnboardingStep[] = [
    {
        targetSelector: '#filters-sidebar',
        title: 'Powerful Filters',
        content: 'Welcome! Use these filters to screen over 60 brokers by cost, platform, trading style, and more to find your perfect match.',
        position: 'right',
    },
    {
        targetSelector: '#ai-rec-button',
        title: 'AI Recommendations',
        content: 'After you filter the list, our AI can analyze your selection and give you its top picks based on your criteria.',
        position: 'bottom',
    },
    {
        targetSelector: '#broker-grid > div:first-child',
        title: 'Detailed Broker Cards',
        content: 'Each broker is scored based on our rigorous methodology, covering costs, safety, platforms, and support.',
        position: 'bottom',
    },
    {
        targetSelector: '#compare-button-tour-target',
        title: 'Side-by-Side Comparison',
        content: 'Click here to add brokers to your list. A comparison bar will appear at the bottom for a detailed analysis.',
        position: 'bottom',
    },
    {
        targetSelector: '#chatbot-toggle',
        title: 'AI Chat Assistant',
        content: "Have a quick question? Our AI BrokerBot is available on every page to help you 24/7.",
        position: 'top',
    },
];


export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const hasCompletedTour = typeof window !== 'undefined' && localStorage ? localStorage.getItem('onboardingComplete') : null;
        // We will trigger the tour on the AllBrokersPage for now.
        // A more complex implementation could use the route.
        const onBrokersPage = typeof window !== 'undefined' && window.location.hash.includes('/brokers');

        if (!hasCompletedTour && onBrokersPage) {
            // Delay start slightly to allow page to render
            setTimeout(() => setIsActive(true), 1500);
        }
    }, []);

    const startTour = useCallback(() => {
        setCurrentStep(0);
        setIsActive(true);
    }, []);

    const endTour = useCallback(() => {
        setIsActive(false);
        if (typeof window !== 'undefined' && localStorage) {
            localStorage.setItem('onboardingComplete', 'true');
        }
    }, []);
    
    const skipTour = useCallback(() => {
       endTour();
    }, [endTour]);

    const goToNextStep = useCallback(() => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            endTour();
        }
    }, [currentStep, endTour]);

    const goToPrevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const value = {
        isActive,
        currentStep,
        startTour,
        endTour,
        skipTour,
        goToNextStep,
        goToPrevStep,
        tourSteps: TOUR_STEPS,
    };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
};
