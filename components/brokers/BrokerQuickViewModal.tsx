import React from 'react';
import { Broker } from '../../types';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { Icons } from '../../constants';
import Button from '../ui/Button';
import Tag from '../ui/Tag';
import { Link } from 'react-router-dom';

interface BrokerQuickViewModalProps {
  broker: Broker | null;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex justify-between items-start py-3 border-b border-input/50 last:border-b-0">
        <span className="text-sm font-semibold text-card-foreground/80 pr-4">{label}</span>
        <div className="text-sm text-right text-card-foreground flex-shrink-0">{children}</div>
    </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-bold text-primary-400 mt-6 mb-2">{children}</h3>
);

const BrokerQuickViewModal: React.FC<BrokerQuickViewModalProps> = ({ broker, onClose }) => {
    if (!broker) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                <Card className="animate-fade-in">
                    <CardHeader className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img src={broker.logoUrl} alt={broker.name} className="h-10 bg-white p-1 rounded-md" />
                            <h2 className="text-2xl font-bold text-card-foreground">{broker.name}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 text-foreground/60 hover:text-foreground">
                            <Icons.close className="h-6 w-6" />
                        </button>
                    </CardHeader>
                    <CardContent className="max-h-[70vh] overflow-y-auto">
                        <SectionTitle>Key Fees</SectionTitle>
                        <div className="p-4 bg-input/50 rounded-lg">
                            <DetailItem label="Avg. EUR/USD Spread">
                                {broker.fees.trading.averageSpreads.find(s => s.pair === 'EUR/USD')?.spread || '-'}
                            </DetailItem>
                            <DetailItem label="Commission Structure">{broker.fees.trading.commissionStructure}</DetailItem>
                            <DetailItem label="Inactivity Fee">{broker.fees.nonTrading.inactivityFee}</DetailItem>
                            <DetailItem label="Withdrawal Fee">{broker.fees.nonTrading.withdrawalFee}</DetailItem>
                        </div>

                        <SectionTitle>Platforms</SectionTitle>
                        <div className="flex flex-wrap gap-2">
                            {broker.technology.platforms.map(platform => <Tag key={platform}>{platform}</Tag>)}
                        </div>

                        {broker.accountTypes && broker.accountTypes.length > 0 && (
                            <>
                                <SectionTitle>Account Types</SectionTitle>
                                <div className="space-y-4">
                                    {broker.accountTypes.map(account => (
                                        <div key={account.name} className="p-4 bg-input/50 rounded-lg">
                                            <h4 className="font-bold">{account.name} <span className="text-xs font-normal text-foreground/70">({account.type})</span></h4>
                                            <div className="mt-2 text-sm space-y-1">
                                                <p><strong>Min. Deposit:</strong> ${account.minDeposit}</p>
                                                <p><strong>Spreads:</strong> {account.spreads}</p>
                                                <p><strong>Commission:</strong> {account.commission}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                    <div className="p-4 border-t border-input flex justify-end gap-4">
                        <Link to={`/broker/${broker.id}`}>
                            <Button variant="secondary">View Full Details</Button>
                        </Link>
                        <a href={broker.websiteUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="primary">Visit Broker</Button>
                        </a>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default BrokerQuickViewModal;