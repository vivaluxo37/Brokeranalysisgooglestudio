import React, { useState, useEffect } from 'react';
import Card, { CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Icons } from '../../constants';
import { useEducation } from '../../hooks/useEducation';

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

interface QuizComponentProps {
    quizTitle: string;
    quizData: QuizQuestion[];
    quizKey: string;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quizTitle, quizData, quizKey }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const { saveQuizResult } = useEducation();

    const currentQuestion = quizData[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const handleAnswerSelect = (answer: string) => {
        if (showResult) return;
        setSelectedAnswer(answer);
    };

    const handleSubmit = () => {
        setShowResult(true);
        if (selectedAnswer === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        setShowResult(false);
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    useEffect(() => {
        if (isFinished) {
            saveQuizResult(quizKey, score, quizData.length);
        }
    }, [isFinished, quizKey, score, quizData.length, saveQuizResult]);
    
    const handleReset = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsFinished(false);
    };

    if (isFinished) {
        return (
            <div className="max-w-2xl mx-auto text-center">
                <Card>
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
                        <p className="text-lg text-foreground/80 mb-6">Your final score is:</p>
                        <p className="text-5xl font-bold text-primary-400 mb-8">
                            {score} / {quizData.length}
                        </p>
                        <Button onClick={handleReset} size="lg">Retake Quiz</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const progressPercentage = ((currentQuestionIndex + 1) / quizData.length) * 100;

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">{quizTitle}</h1>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-semibold text-foreground/80">Question {currentQuestionIndex + 1} of {quizData.length}</p>
                        </div>
                        <div className="w-full bg-input rounded-full h-2.5">
                            <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-card-foreground mb-6">{currentQuestion.question}</h2>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedAnswer === option;
                            let buttonClass = 'border-input hover:bg-input';
                            if (showResult) {
                                if (option === currentQuestion.correctAnswer) {
                                    buttonClass = 'border-green-500 bg-green-900/30 text-green-300';
                                } else if (isSelected) {
                                    buttonClass = 'border-red-500 bg-red-900/30 text-red-300';
                                }
                            } else if (isSelected) {
                                buttonClass = 'border-primary-500 bg-primary-900/30';
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(option)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${buttonClass}`}
                                    disabled={showResult}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                    
                    {showResult && (
                        <div className={`mt-6 p-4 rounded-lg animate-fade-in ${isCorrect ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                            <h3 className={`font-bold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                            </h3>
                            <p className="text-sm text-card-foreground/80 mt-1">{currentQuestion.explanation}</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end p-4">
                    {showResult ? (
                         <Button onClick={handleNext} size="lg">
                            {currentQuestionIndex < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            <Icons.chevronRight className="h-5 w-5 ml-2"/>
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={!selectedAnswer} size="lg">
                            Submit Answer
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default QuizComponent;