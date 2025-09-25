import React from 'react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWebinarData } from '../data/education';
import { useTranslation } from '../hooks/useTranslation';
import { useEducation } from '../hooks/useEducation';

interface Webinar {
    title: string;
    speaker: string;
    date: string;
    description: string;
}

const WebinarCard: React.FC<{ webinar: Webinar, isUpcoming?: boolean, onWatch?: () => void }> = ({ webinar, isUpcoming = false, onWatch }) => {
    const { t } = useTranslation();
    return (
        <Card>
            <CardContent>
                <p className="text-sm font-semibold text-primary-400 mb-1">{webinar.date}</p>
                <h3 className="text-xl font-bold text-card-foreground">{webinar.title}</h3>
                <p className="text-sm text-card-foreground/70 my-2">By {webinar.speaker}</p>
                <p className="text-card-foreground/80 text-sm mb-4">{webinar.description}</p>
                <Button 
                    variant={isUpcoming ? 'primary' : 'secondary'} 
                    className="w-full"
                    onClick={!isUpcoming ? onWatch : undefined}
                >
                    {isUpcoming ? t('education.webinars.register') : t('education.webinars.watch')}
                </Button>
            </CardContent>
        </Card>
    );
};

const WebinarsPage: React.FC = () => {
    const { webinars } = useWebinarData();
    const { t } = useTranslation();
    const { markWebinarAsViewed } = useEducation();

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">{t('education.webinars.title')}</h1>
                <p className="mt-2 text-lg text-foreground/80">{t('education.webinars.subtitle')}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-6">{t('education.webinars.upcomingTitle')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {webinars.upcoming.map((webinar, index) => (
                            <WebinarCard key={index} webinar={webinar} isUpcoming />
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-6">{t('education.webinars.pastTitle')}</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {webinars.past.map((webinar, index) => (
                            <WebinarCard 
                                key={index} 
                                webinar={webinar} 
                                onWatch={() => markWebinarAsViewed(webinar.title)}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default WebinarsPage;