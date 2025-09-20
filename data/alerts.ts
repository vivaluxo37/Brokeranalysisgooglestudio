import { Alert } from '../types';

export const mockAlerts: Alert[] = [
  {
    id: 'alert1',
    brokerId: 'pepperstone',
    title: 'FCA Issues Minor Warning',
    description: 'Pepperstone received a minor warning from the FCA regarding marketing materials. The issue has been resolved.',
    date: '2025-09-10T14:00:00Z',
    severity: 'Medium',
    read: false,
  },
  {
    id: 'alert2',
    brokerId: 'ic-markets',
    title: 'CySEC License Updated',
    description: 'IC Markets has successfully updated its CySEC license, enhancing client fund protection measures.',
    date: '2025-09-08T09:30:00Z',
    severity: 'Low',
    read: false,
  },
  {
    id: 'alert3',
    brokerId: 'xtb',
    title: 'New Educational Webinars',
    description: 'XTB announces a new series of free educational webinars on risk management for all clients.',
    date: '2025-09-05T11:00:00Z',
    severity: 'Low',
    read: true,
  },
  {
    id: 'alert4',
    brokerId: 'forex-com',
    title: 'NFA Conducts Routine Audit',
    description: 'Forex.com is undergoing a routine audit by the NFA. No issues have been reported.',
    date: '2025-08-28T16:20:00Z',
    severity: 'Low',
    read: false,
  },
  {
    id: 'alert5',
    brokerId: 'pepperstone',
    title: 'New Server Maintenance Scheduled',
    description: 'Scheduled maintenance for MT5 servers on Sunday. Expect brief downtime.',
    date: '2025-09-12T10:00:00Z',
    severity: 'Low',
    read: false,
  },
  {
    id: 'alert6',
    brokerId: 'etoro',
    title: 'Regulatory Fine Issued by ASIC',
    description: 'eToro has been fined by ASIC for misleading statements regarding CFD product risks. The company has paid the fine and updated its disclosures.',
    date: '2025-09-01T08:00:00Z',
    severity: 'High',
    read: false,
  }
];
