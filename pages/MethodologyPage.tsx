
import React from 'react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';

const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Our Methodology</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
          Transparency is at the core of our mission. Here's how we gather data, score brokers, and leverage AI to help you make informed decisions.
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary-400">How We Score Brokers</h2>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              Each broker is given an overall score out of 10, which is a weighted average of several key categories. Our goal is to provide a balanced view that reflects the complete trading experience.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Regulation (35%):</strong> This is the most critical factor. We assess the quality and number of regulatory licenses a broker holds. Top-tier regulators (like FCA, ASIC, NFA) carry the most weight.</li>
              <li><strong>Costs (30%):</strong> We analyze trading costs, including spreads on major pairs, commissions per lot, and overnight swap fees. Brokers with transparent and consistently low costs score higher.</li>
              <li><strong>Platforms & Technology (20%):</strong> This category evaluates the range and quality of trading platforms (MT4, MT5, cTrader, proprietary), execution speed, and available trading tools.</li>
              <li><strong>Customer Support & Accessibility (15%):</strong> We consider the availability and quality of customer support channels (live chat, phone), minimum deposit requirements, and the variety of deposit/withdrawal methods.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary-400">Data Sources & Accuracy</h2>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              Our data is meticulously gathered from multiple sources to ensure it is as accurate and up-to-date as possible:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Broker Websites:</strong> We directly source information on accounts, fees, and trading conditions from the brokers themselves.</li>
              <li><strong>Regulatory Body Databases:</strong> We verify licenses and check for disciplinary actions directly with regulatory agencies.</li>
              <li><strong>User Reviews:</strong> The experiences of real traders provide invaluable qualitative insights that complement our quantitative data.</li>
            </ul>
            <p className="text-sm text-gray-400 italic">
              Disclaimer: The forex market is dynamic. While we strive for accuracy, information such as spreads and fees can change. Always verify details with the broker before opening an account.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary-400">The Role of AI</h2>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              We use Google's Gemini AI model as a powerful tool to process and analyze vast amounts of information, providing you with unique insights that would be impossible to generate manually.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>AI Summaries:</strong> The AI reads through all user reviews to generate concise summaries of pros and cons, saving you hours of reading.</li>
              <li><strong>AI Matching:</strong> The Broker Matcher uses AI to intelligently sift through our entire database and find the brokers that best fit your specific, nuanced requirements.</li>
              <li><strong>AI Trust Score:</strong> Our AI performs a real-time search to check for recent regulatory issues or fines, providing a dynamic "Trust Score" that goes beyond a simple list of licenses.</li>
            </ul>
             <p className="font-semibold">
              Crucially, AI is our co-pilot, not the pilot. All AI-generated content is based on the factual data we provide it and is reviewed for quality and accuracy. The final scores and core data points are determined by our human-led research process.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default MethodologyPage;
