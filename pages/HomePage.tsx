

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Icons } from '../constants';
import { brokers } from '../data/brokers';
import JsonLdSchema from '../components/common/JsonLdSchema';

// New AccordionItem component
const AccordionItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-input last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-5 text-left text-lg font-semibold"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <Icons.chevronDown className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-card-foreground/70">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};


const HomePage: React.FC = () => {
  const brokerLogos = brokers.slice(0, 6).map(b => ({ name: b.name, logoUrl: b.logoUrl, websiteUrl: b.websiteUrl }));
  const features = [
    { 
      icon: <Icons.data className="h-8 w-8 text-primary-400" />, 
      title: "Comprehensive Data", 
      description: "Access detailed information on dozens of brokers, from regulations to trading conditions." 
    },
    { 
      icon: <Icons.brainCircuit className="h-8 w-8 text-primary-400" />, 
      title: "AI-Powered Matching", 
      description: "Our intelligent Broker Matcher finds the ideal broker based on your unique preferences." 
    },
    { 
      icon: <Icons.layers className="h-8 w-8 text-primary-400" />, 
      title: "Side-by-Side Comparison", 
      description: "Easily compare key features of multiple brokers in a clear, concise table." 
    },
    { 
      icon: <Icons.shieldCheck className="h-8 w-8 text-primary-400" />, 
      title: "Trust & Safety", 
      description: "We verify regulatory data and use AI to generate a dynamic trust score for each broker." 
    }
  ];

  const faqs = [
    {
      q: "What’s the safest forex broker?",
      a: "Safety depends heavily on regulation. The safest brokers are typically those regulated by multiple top-tier authorities like the FCA (UK), ASIC (Australia), and FINMA (Switzerland). Our platform highlights regulatory data and provides an AI Trust Score to help you assess broker safety."
    },
    {
      q: "How does AI choose the right broker for me?",
      a: "Our AI Broker Matcher analyzes your answers to questions about your trading style, and priorities. It then compares your profile against our database of broker attributes—like costs, platforms, and regulation—to find the closest matches. It's a data-driven process designed to personalize your search."
    },
    {
      q: "Which broker has the lowest trading costs?",
      a: "Trading costs are dynamic and depend on the instrument you trade. Our Live Cost Analyzer provides real-time data on spreads and commissions for brokers you select, helping you identify the cheapest option at any given moment. Generally, ECN/STP brokers like Pepperstone or IC Markets offer very low raw spreads but charge a commission."
    }
  ];

  const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
          }
      }))
  };

  return (
    <div className="space-y-24 md:space-y-32">
      <JsonLdSchema data={faqJsonLd} />
      {/* Hero Section */}
      <div className="text-center pt-16 md:pt-24">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
          Find Your Perfect Forex Broker
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80">
          Leverage the power of AI to analyze, compare, and choose the best broker tailored to your trading style.
        </p>
         <p className="mt-2 text-sm text-foreground/60">
          Data-driven insights on dozens of regulated brokers worldwide.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/broker-matcher">
            <Button size="lg" variant="primary" className="animate-pulse w-full sm:w-auto">
              Use AI Broker Matcher
            </Button>
          </Link>
          <Link to="/brokers">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Explore All Brokers
            </Button>
          </Link>
        </div>
        <div className="mt-16">
          <p className="text-sm text-foreground/60 uppercase tracking-wider">Trusted by top traders</p>
          <div className="mt-4 flex justify-center items-center gap-6 sm:gap-8 flex-wrap">
            {brokerLogos.map(logo => (
              <a key={logo.name} href={logo.websiteUrl} target="_blank" rel="noopener noreferrer" title={`Visit ${logo.name}`}>
                <img src={logo.logoUrl} alt={logo.name} className="h-8 object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-10">Why Choose Brokeranalysis?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map(feature => (
            <div key={feature.title} className="p-6 bg-card rounded-lg border border-input text-left flex flex-col items-start">
                <div className="p-3 bg-input rounded-full mb-4">
                    {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-primary-400">{feature.title}</h3>
                <p className="mt-2 text-card-foreground/80 flex-grow">{feature.description}</p>
            </div>
            ))}
        </div>
      </div>

      {/* How it Works Section */}
       <div className="text-center max-w-4xl mx-auto">
         <h2 className="text-3xl font-bold mb-10">How It Works in 3 Simple Steps</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Dashed line connector for desktop */}
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 w-full h-px border-t-2 border-dashed border-input -z-10"></div>
            
            <div className="flex flex-col items-center p-6 bg-card border border-input rounded-lg">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-900/50 border-2 border-primary-700 text-2xl font-bold text-primary-300 mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Answer Questions</h3>
                <p className="text-card-foreground/80">Tell us about your trading style, experience, and what you value most in a broker.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card border border-input rounded-lg">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-900/50 border-2 border-primary-700 text-2xl font-bold text-primary-300 mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Get AI Matches</h3>
                <p className="text-card-foreground/80">Our AI analyzes your profile and recommends top brokers from our database.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card border border-input rounded-lg">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-900/50 border-2 border-primary-700 text-2xl font-bold text-primary-300 mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Compare & Choose</h3>
                <p className="text-card-foreground/80">Use our tools to compare costs, features, and trust scores to make your final choice.</p>
            </div>
         </div>
       </div>

      {/* Social Proof Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Trusted by Traders Worldwide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-card rounded-lg border border-input text-left">
                <p className="text-card-foreground/90 italic">"The AI Broker Matcher is a game-changer. It found me a broker with low spreads that I'd never heard of. Saved me hours of research."</p>
                <p className="mt-4 font-semibold text-primary-400">- Alex R., Day Trader</p>
            </div>
             <div className="p-6 bg-card rounded-lg border border-input text-left">
                <p className="text-card-foreground/90 italic">"Finally, a comparison site that's actually useful. The live cost analyzer is brilliant for seeing real-time fees. Highly recommended."</p>
                <p className="mt-4 font-semibold text-primary-400">- Sarah T., Swing Trader</p>
            </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="bg-card rounded-lg border border-input divide-y divide-input">
            {faqs.map(faq => (
                <AccordionItem key={faq.q} title={faq.q}>
                    <p>{faq.a}</p>
                </AccordionItem>
            ))}
        </div>
      </div>

    </div>
  );
};

export default HomePage;