
import React from 'react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';

const SourcesPage: React.FC = () => {
  const sources = [
    { name: "Financial Conduct Authority (FCA), UK", url: "https://www.fca.org.uk/" },
    { name: "Australian Securities & Investments Commission (ASIC)", url: "https://asic.gov.au/" },
    { name: "Cyprus Securities and Exchange Commission (CySEC)", url: "https://www.cysec.gov.cy/" },
    { name: "Swiss Financial Market Supervisory Authority (FINMA)", url: "https://www.finma.ch/" },
    { name: "U.S. National Futures Association (NFA)", url: "https://www.nfa.futures.org/" },
    { name: "Reuters", url: "https://www.reuters.com/markets/" },
    { name: "Bloomberg", url: "https://www.bloomberg.com/markets" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Sources & References</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
          We consult with major financial regulators and trusted news organizations to verify our data and stay current with market events.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-primary-400">Official Sources</h2>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-card-foreground/90">
            Our data verification process relies on the following primary sources:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            {sources.map(source => (
              <li key={source.name}>
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="nofollow noopener"
                  className="text-primary-400 hover:underline"
                >
                  {source.name}
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SourcesPage;
