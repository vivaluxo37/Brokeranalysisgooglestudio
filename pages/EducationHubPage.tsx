
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Icons } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

const EducationCard = ({ to, icon, title, description, isFeatured = false }: { to: string, icon: React.ReactNode, title: string, description: string, isFeatured?: boolean }) => (
    <Link to={to} className="group block">
        <Card className={`h-full hover:-translate-y-1 transition-all ${isFeatured ? 'bg-primary-900/40 border-primary-600' : 'hover:border-primary-600'}`}>
            <CardContent className="flex flex-col items-center text-center p-8">
                <div className={`p-4 rounded-full text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors mb-4 ${isFeatured ? 'bg-primary-600/80 text-white' : 'bg-input'}`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-card-foreground">{title}</h3>
                <p className="mt-2 text-card-foreground/70">{description}</p>
            </CardContent>
        </Card>
    </Link>
);

const EducationHubPage: React.FC = () => {
    const { t } = useTranslation();

    const educationSections = [
        {
            to: '/education/ai-tutor',
            icon: <Icons.bot className="h-10 w-10" />,
            title: 'Interactive AI Tutor',
            description: 'Ask questions and get personalized explanations on any trading topic in a one-on-one chat session.',
            isFeatured: true
        },
        {
            to: '/education/quizzes',
            icon: <Icons.helpCircle className="h-10 w-10" />,
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {educationSections.map((section, index) => (
                    <div key={section.to} className={`opacity-0 animate-fade-in ${section.isFeatured ? 'md:col-span-2' : ''}`} style={{ animationDelay: `${index * 150}ms` }}>
                        <EducationCard {...section} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EducationHubPage;
