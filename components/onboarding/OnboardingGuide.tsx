import React, { useState, useEffect, useRef } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { Button } from '../ui/button';
import { Icons } from '../../constants';
import { useLocation } from 'react-router-dom';

interface ElementRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

const OnboardingGuide: React.FC = () => {
    const { isActive, currentStep, tourSteps, goToNextStep, goToPrevStep, skipTour } = useOnboarding();
    const [targetRect, setTargetRect] = useState<ElementRect | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const currentStepConfig = tourSteps[currentStep];

    useEffect(() => {
        if (!isActive || !currentStepConfig) {
            setTargetRect(null);
            return;
        }

        const findTarget = () => {
            if (!currentStepConfig?.targetSelector) {
                setTargetRect(null);
                return;
            }

            const targetElement = document.querySelector(currentStepConfig.targetSelector);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

                setTimeout(() => {
                    const rect = targetElement.getBoundingClientRect();
                    setTargetRect({
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                    });
                }, 300); // Delay for scroll animation
            } else {
                setTargetRect(null);
            }
        };

        const timer = setTimeout(findTarget, 100);
        
        window.addEventListener('resize', findTarget);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', findTarget);
        }

    }, [isActive, currentStep, currentStepConfig, location.pathname]); // Re-run if path changes
    
    if (!isActive || !targetRect || !currentStepConfig) {
        return null;
    }
    
    const tooltipPosition: React.CSSProperties = {};
    const position = currentStepConfig.position || 'bottom';
    
    switch (position) {
        case 'top':
            tooltipPosition.top = targetRect.top - 10;
            tooltipPosition.left = targetRect.left + targetRect.width / 2;
            tooltipPosition.transform = 'translateX(-50%) translateY(-100%)';
            break;
        case 'bottom':
            tooltipPosition.top = targetRect.top + targetRect.height + 10;
            tooltipPosition.left = targetRect.left + targetRect.width / 2;
            tooltipPosition.transform = 'translateX(-50%)';
            break;
        case 'left':
            tooltipPosition.top = targetRect.top + targetRect.height / 2;
            tooltipPosition.left = targetRect.left - 10;
            tooltipPosition.transform = 'translateX(-100%) translateY(-50%)';
            break;
        case 'right':
            tooltipPosition.top = targetRect.top + targetRect.height / 2;
            tooltipPosition.left = targetRect.left + targetRect.width + 10;
            tooltipPosition.transform = 'translateY(-50%)';
            break;
    }


    return (
        <div className="fixed inset-0 z-[100]" aria-live="polite">
            <div 
                className="fixed inset-0" 
                style={{
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
                    clipPath: `path('M 0 0 L 0 9999 L 9999 9999 L 9999 0 L 0 0 Z M ${targetRect.left - 4} ${targetRect.top - 4} L ${targetRect.left + targetRect.width + 4} ${targetRect.top - 4} L ${targetRect.left + targetRect.width + 4} ${targetRect.top + targetRect.height + 4} L ${targetRect.left - 4} ${targetRect.top + targetRect.height + 4} Z')`
                }}
            />
            <div 
                className="absolute bg-transparent rounded-lg transition-all duration-300 pointer-events-none border-2 border-primary-500 border-dashed"
                style={{ 
                    top: `${targetRect.top - 4}px`, 
                    left: `${targetRect.left - 4}px`, 
                    width: `${targetRect.width + 8}px`, 
                    height: `${targetRect.height + 8}px`,
                }}
            />

            <div
                ref={tooltipRef}
                className={`absolute w-80 bg-card rounded-lg shadow-2xl p-4 animate-fade-in transition-all duration-300`}
                style={tooltipPosition}
                role="dialog"
                aria-labelledby="onboarding-title"
            >
                <div className="flex justify-between items-center mb-2">
                    <h3 id="onboarding-title" className="font-bold text-lg text-primary-400">{currentStepConfig.title}</h3>
                    <span className="text-sm text-foreground/60">{currentStep + 1} / {tourSteps.length}</span>
                </div>
                <p className="text-sm text-card-foreground/80 mb-4">
                    {currentStepConfig.content}
                </p>
                <div className="flex justify-between items-center">
                    <Button variant="ghost" size="sm" onClick={skipTour}>Skip</Button>
                    <div className="flex items-center gap-2">
                         {currentStep > 0 && <Button variant="secondary" size="sm" onClick={goToPrevStep}>Back</Button>}
                        <Button variant="primary" size="sm" onClick={goToNextStep}>
                            {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingGuide;
