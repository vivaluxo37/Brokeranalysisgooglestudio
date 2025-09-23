// This file simulates data that would be ingested from regulatory bodies.
// In a real application, this would come from a database populated by scrapers or APIs.

export interface RegulatoryFinding {
    name: string; // Broker name
    domain?: string; // Broker domain, if available
    reason: string;
    sourceUrl: string;
    date: string; // ISO 8601 date
}

export const fcaWarningList: RegulatoryFinding[] = [
    {
        name: 'Royal',
        reason: 'This firm is not authorised by us and is targeting people in the UK.',
        sourceUrl: 'https://www.fca.org.uk/news/warnings/royal',
        date: '2025-09-12T00:00:00Z',
    },
];

export const asicActions: RegulatoryFinding[] = [
    {
        name: 'VT Markets',
        reason: 'ASIC secures interim orders against VT Markets for offering unlicensed financial services.',
        sourceUrl: 'https://asic.gov.au/about-asic/news-centre/find-a-media-release/2025-releases/25-200-asic-acts-against-vt-markets/',
        date: '2025-08-22T00:00:00Z',
    },
];

export const nfaEnforcementActions: RegulatoryFinding[] = [
    {
        name: 'FXCM',
        reason: 'NFA bars Forex Capital Markets, LLC from membership, finding that the firm had a long history of misleading conduct.',
        sourceUrl: 'https://www.nfa.futures.org/news/newsmanagedoc.aspx?DocumentID=12345',
        date: '2025-07-30T00:00:00Z',
    }
];
