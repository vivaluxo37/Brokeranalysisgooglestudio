import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import Card, { CardContent } from '../components/ui/Card';
import { Icons } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

const EducationCard = ({ to, icon, title, description }: { to: string, icon: React.ReactNode, title: string, description: string }) => (
    <ReactRouterDOM.Link to={to} className="group block">
        <Card className="h-full hover:border-primary-600 hover:-translate-y-1 transition-all">
            <CardContent className="flex flex-col items-center text-center p-8">
                <div className="p-4 bg-input rounded-full text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors mb-4">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-card-foreground">{title}</h3>
                <p className="mt-2 text-card-foreground/70 flex-grow">{description}</p>
            </CardContent>
        </Card>
    </ReactRouterDOM.Link>
);

const EducationHubPage: React.FC = () => {
    const { t } = useTranslation();

    const educationSections = [
        {
            to: '/education/quizzes',
            icon: <Icons.bookOpen className="h-10 w-10" />,
            title: t('education.hub.quizzes.title'),
            description: t('education.hub.quizzes.description')
        },
        {
            to: '/education/webinars',
            icon: <Icons.video className="h-10 w-10" />,
            title: t('education.hub.webinars.title'),
            description: t('education.hub.webinars.description')
        },
        {
            to: '/education/simulators',
            icon: <Icons.cpu className="h-10 w-10" />,
            title: t('education.hub.simulators.title'),
            description: t('education.hub.simulators.description')
        }
    ];

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t('education.hub.title')}</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
                    {t('education.hub.subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {educationSections.map(section => (
                    <EducationCard key={section.to} {...section} />
                ))}
            </div>
        </div>
    );
};

export default EducationHubPage;
