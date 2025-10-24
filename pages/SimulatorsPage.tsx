import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Icons } from '../constants';
import { Button } from '../components/ui/Button';
import { useTranslation } from '../hooks/useTranslation';

const SimulatorsPage: React.FC = () => {
    const { t } = useTranslation();

    const simulators = [
        {
            to: '/education/simulators/order-execution',
            icon: <Icons.cpu className="h-8 w-8" />,
            title: t('education.simulators.execution.title'),
            description: t('education.simulators.execution.description'),
        },
        // More simulators can be added here
    ];

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">{t('education.simulators.title')}</h1>
                <p className="mt-2 text-lg text-foreground/80">{t('education.simulators.subtitle')}</p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
                {simulators.map(sim => (
                     <Card key={sim.to} className="hover:border-primary-500/50 transition-colors">
                        <CardContent>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="p-4 bg-input rounded-full text-primary-400 flex-shrink-0">
                                    {sim.icon}
                                </div>
                                <div className="flex-grow text-center sm:text-left">
                                    <h3 className="text-xl font-bold text-card-foreground">{sim.title}</h3>
                                    <p className="mt-2 text-card-foreground/70">{sim.description}</p>
                                </div>
                                <ReactRouterDOM.Link to={sim.to}>
                                    <Button variant="primary" className="mt-4 sm:mt-0">
                                        Launch Simulator <Icons.chevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </ReactRouterDOM.Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SimulatorsPage;
