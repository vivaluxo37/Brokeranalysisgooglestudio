import { Author } from '../types';

export const authors: Author[] = [
  {
    slug: 'darren-cole',
    name: 'Darren Cole',
    avatarUrl: 'https://i.pravatar.cc/150?u=darrencole',
    credentials: 'CMT, Senior Trading Strategist',
    bio: 'Darren Cole is a Chartered Market Technician (CMT) with over 15 years of experience trading forex and equity markets. He specializes in quantitative analysis and algorithmic trading strategies. As the lead researcher at Brokeranalysis, Darren is responsible for developing the core scoring models and ensuring data accuracy across all broker reviews.',
    socials: {
      twitter: 'https://twitter.com/example',
      linkedin: 'https://linkedin.com/in/example',
    },
  },
  {
    slug: 'jane-doe',
    name: 'Jane Doe',
    avatarUrl: 'https://i.pravatar.cc/150?u=janedoe',
    credentials: 'CFA, Financial Analyst',
    bio: 'Jane Doe is a Chartered Financial Analyst (CFA) specializing in regulatory compliance and broker due diligence. With a background in financial auditing, she focuses on ensuring the safety and transparency of the brokers reviewed on Brokeranalysis. Jane fact-checks all regulatory data and contributes to the methodology behind our Trust Score.',
    socials: {
      linkedin: 'https://linkedin.com/in/example',
    },
  },
];
