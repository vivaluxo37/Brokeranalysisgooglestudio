import React, { createContext, useState, useEffect } from 'react';
import { EducationContextType, EducationProgress } from '../types';
import { useAuth } from '../hooks/useAuth';

export const EducationContext = createContext<EducationContextType | null>(null);

const initialProgress: EducationProgress = {
    quizzes: {},
    webinars: {}
};

export const EducationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [progress, setProgress] = useState<EducationProgress>(initialProgress);

    useEffect(() => {
        if (user) {
            try {
                const savedProgress = typeof window !== 'undefined' && localStorage ? localStorage.getItem(`educationProgress_${user.id}`) : null;
                setProgress(savedProgress ? JSON.parse(savedProgress) : initialProgress);
            } catch (e) {
                console.error("Failed to load education progress", e);
                setProgress(initialProgress);
            }
        } else {
            setProgress(initialProgress); // Reset on logout
        }
    }, [user]);

    useEffect(() => {
        if (user && typeof window !== 'undefined' && localStorage) {
            localStorage.setItem(`educationProgress_${user.id}`, JSON.stringify(progress));
        }
    }, [progress, user]);

    const saveQuizResult = (quizKey: string, score: number, total: number) => {
        setProgress(prev => ({
            ...prev,
            quizzes: {
                ...prev.quizzes,
                [quizKey]: {
                    score,
                    total,
                    date: new Date().toISOString()
                }
            }
        }));
    };

    const markWebinarAsViewed = (webinarTitle: string) => {
        setProgress(prev => ({
            ...prev,
            webinars: {
                ...prev.webinars,
                [webinarTitle]: {
                    viewed: true,
                    date: new Date().toISOString()
                }
            }
        }));
    };

    return (
        <EducationContext.Provider value={{ progress, saveQuizResult, markWebinarAsViewed }}>
            {children}
        </EducationContext.Provider>
    );
};
