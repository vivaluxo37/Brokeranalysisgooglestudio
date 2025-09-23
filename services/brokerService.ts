import { Broker, Signal, RiskProfile } from '../types';
import { brokers as allBrokers } from '../data/brokers';
import { fcaWarningList, asicActions, nfaEnforcementActions, RegulatoryFinding } from '../data/regulatoryData';

const REGULATOR_WARNING_WEIGHT = 40;

const checkBrokerAgainstList = (broker: Broker, list: RegulatoryFinding[], source: string): Signal | null => {
    const finding = list.find(item =>
        broker.name.toLowerCase().includes(item.name.toLowerCase()) ||
        (item.domain && broker.websiteUrl.toLowerCase().includes(item.domain.toLowerCase()))
    );
    if (finding) {
        return {
            type: 'REGULATOR_WARNING',
            source: source,
            description: finding.reason,
            scoreWeight: REGULATOR_WARNING_WEIGHT,
            evidenceUrl: finding.sourceUrl,
            timestamp: finding.date,
        };
    }
    return null;
};

const calculateRiskProfile = (signals: Signal[]): RiskProfile | undefined => {
    if (signals.length === 0) return undefined;

    const score = signals.reduce((acc, s) => acc + s.scoreWeight, 0);
    let level: 'Low' | 'Medium' | 'High' | 'Critical';

    if (score >= 80) level = 'Critical';
    else if (score >= 60) level = 'High';
    else if (score >= 30) level = 'Medium';
    else level = 'Low';

    return {
        score: Math.min(score, 100), // Cap score at 100
        level,
        signals,
    };
};


const enrichBrokerWithRisk = (broker: Broker): Broker => {
    const newSignals: Signal[] = [];

    const fcaSignal = checkBrokerAgainstList(broker, fcaWarningList, 'FCA Warning List');
    if (fcaSignal) newSignals.push(fcaSignal);

    const asicSignal = checkBrokerAgainstList(broker, asicActions, 'ASIC Enforcement Action');
    if (asicSignal) newSignals.push(asicSignal);

    const nfaSignal = checkBrokerAgainstList(broker, nfaEnforcementActions, 'NFA Enforcement Action');
    if (nfaSignal) newSignals.push(nfaSignal);
    
    // Combine new signals with any pre-existing signals (like the URL flag)
    const allSignals = [...(broker.riskProfile?.signals || []), ...newSignals];

    // Remove duplicates based on description and source
    const uniqueSignals = allSignals.filter((signal, index, self) =>
        index === self.findIndex((s) => (
            s.description === signal.description && s.source === signal.source
        ))
    );

    const newRiskProfile = calculateRiskProfile(uniqueSignals);

    return {
        ...broker,
        riskProfile: newRiskProfile,
    };
};

// Memoize the result to avoid recalculating on every call across the app
let enrichedBrokers: Broker[] | null = null;

export const getBrokers = (): Broker[] => {
    if (!enrichedBrokers) {
        enrichedBrokers = allBrokers.map(enrichBrokerWithRisk);
    }
    return enrichedBrokers;
};

export const getBrokerById = (id: string): Broker | undefined => {
    const brokers = getBrokers();
    return brokers.find(b => b.id === id);
};
