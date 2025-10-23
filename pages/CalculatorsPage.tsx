import React, { useState } from 'react';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent } from '../components/ui/Card';
import PipCalculator from '../components/tools/calculators/PipCalculator';
import PositionSizeCalculator from '../components/tools/calculators/PositionSizeCalculator';
import MarginCalculator from '../components/tools/calculators/MarginCalculator';

type CalculatorTab = 'pip' | 'position' | 'margin';

const CalculatorsPage: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<CalculatorTab>('position');

    const positionSizeHowTo = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Calculate Forex Position Size",
        "description": "Calculate the optimal position size for your trade to manage risk effectively.",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Enter Account Details",
                "text": "Input your account currency and current account balance."
            },
            {
                "@type": "HowToStep",
                "name": "Define Your Risk",
                "text": "Set the percentage of your account you are willing to risk on this single trade (e.g., 1% or 2%)."
            },
            {
                "@type": "HowToStep",
                "name": "Set Your Stop Loss",
                "text": "Determine your stop loss in pips for the currency pair you are trading."
            },
            {
                "@type": "HowToStep",
                "name": "Calculate",
                "text": "The calculator will provide the recommended position size in standard lots and units."
            }
        ]
    };

    return (
        <div>
            <MetaTags
                title={`${t('tools.calculators.title')} | Brokeranalysis`}
                description={t('tools.calculators.subtitle')}
                canonicalUrl="https://brokeranalysis.com/#/tools/calculators"
            />
            {activeTab === 'position' && <JsonLdSchema data={positionSizeHowTo} />}
            
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold">{t('tools.calculators.title')}</h1>
                <p className="text-lg text-foreground/80 mt-2 max-w-3xl mx-auto">{t('tools.calculators.subtitle')}</p>
            </div>

            <Card className="max-w-xl mx-auto">
                <div className="flex border-b border-input">
                    <button 
                        onClick={() => setActiveTab('pip')}
                        className={`flex-1 p-4 font-semibold transition-colors ${activeTab === 'pip' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-foreground/60 hover:bg-input/50'}`}
                    >
                        {t('tools.calculators.pipValue.title')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('position')}
                        className={`flex-1 p-4 font-semibold transition-colors ${activeTab === 'position' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-foreground/60 hover:bg-input/50'}`}
                    >
                        {t('tools.calculators.positionSize.title')}
                    </button>
                     <button 
                        onClick={() => setActiveTab('margin')}
                        className={`flex-1 p-4 font-semibold transition-colors ${activeTab === 'margin' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-foreground/60 hover:bg-input/50'}`}
                    >
                        {t('tools.calculators.margin.title')}
                    </button>
                </div>
                <CardContent className="p-6">
                    {activeTab === 'pip' && <PipCalculator />}
                    {activeTab === 'position' && <PositionSizeCalculator />}
                    {activeTab === 'margin' && <MarginCalculator />}
                </CardContent>
            </Card>

        </div>
    );
};

export default CalculatorsPage;