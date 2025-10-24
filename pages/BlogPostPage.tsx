
import React, { useMemo, useState, useContext } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { blogPosts } from '../data/blog';
import { authors } from '../data/authors';
import NotFoundPage from './NotFoundPage';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';
import { Icons } from '../constants';
import Tag from '../components/ui/Tag';
import ShareButtons from '../components/blog/ShareButtons';
import BlogPostCard from '../components/blog/BlogPostCard';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DiscussionContext } from '../contexts/DiscussionContext';
import { useAuth } from '../hooks/useAuth';
import DiscussionPostCard from '../components/brokers/DiscussionPostCard';
import { Input } from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';


// --- Components for Enhanced Blog Post ---

const KeyTakeaways: React.FC<{ items: string[] }> = ({ items }) => (
    <div className="my-8 p-6 bg-card rounded-lg border-2 border-primary-500/30 shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Icons.checkCircle className="h-6 w-6 text-primary-400" />
            Key Takeaways
        </h3>
        <ul className="space-y-2 list-disc pl-5 text-card-foreground/90">
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </div>
);


interface TocItem {
  id: string;
  title: string;
}

const StickyTableOfContents: React.FC<{ items: TocItem[] }> = ({ items }) => (
    <div className="sticky top-24 self-start">
        <h3 className="font-bold mb-4 text-lg text-card-foreground">On this page</h3>
        <ul className="space-y-2 border-l-2 border-input">
            {items.map(item => (
                <li key={item.id}>
                    <a 
                        href={`#${item.id}`} 
                        className="block pl-4 text-foreground/70 hover:text-primary-400 hover:border-primary-400 border-l-2 border-transparent -ml-px transition-colors"
                    >
                        {item.title}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const InlineTableOfContents: React.FC<{ items: TocItem[] }> = ({ items }) => (
    <div className="my-10 p-6 border-l-4 border-primary-500 bg-card rounded-r-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Icons.list className="h-5 w-5" /> Table of Contents</h3>
        <ul className="space-y-2 list-inside">
            {items.map(item => (
                <li key={item.id}>
                    <a 
                        href={`#${item.id}`} 
                        className="text-primary-400 hover:underline"
                    >
                        {item.title}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);


const DownloadableResource: React.FC = () => (
    <div className="my-10 p-6 bg-primary-900/40 rounded-lg flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <Icons.downloadCloud className="h-16 w-16 text-primary-300 flex-shrink-0" />
        <div>
            <h3 className="text-xl font-bold text-card-foreground">Free Broker Selection Checklist</h3>
            <p className="text-card-foreground/80 mt-1">Download our free PDF checklist to ensure you cover all the bases when choosing your next broker.</p>
        </div>
        <Button size="lg" className="mt-4 sm:mt-0 sm:ml-auto flex-shrink-0">Download PDF</Button>
    </div>
);

const InteractiveQuiz: React.FC = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const question = "Which broker model typically has a direct conflict of interest with the trader?";
    const options = ["ECN Broker", "Market Maker Broker", "STP Broker"];
    const correctAnswer = "Market Maker Broker";

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setIsCorrect(answer === correctAnswer);
    };

    return (
        <div className="my-10 p-6 border-2 border-input rounded-lg bg-card">
            <h3 className="text-xl font-bold text-center mb-4">Quick Knowledge Check!</h3>
            <p className="text-center text-card-foreground/90 mb-6">{question}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map(option => {
                    const isSelected = selectedAnswer === option;
                    let stateClass = 'bg-input hover:bg-input/70';
                    if (isSelected) {
                        stateClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                    }
                    return (
                        <button 
                            key={option} 
                            onClick={() => handleAnswer(option)}
                            disabled={selectedAnswer !== null}
                            className={`p-4 rounded-lg font-semibold transition-colors ${stateClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {isCorrect === true && <p className="text-center mt-4 text-green-400 font-semibold animate-fade-in">Correct! Market Makers profit from client losses, creating a conflict of interest.</p>}
            {isCorrect === false && <p className="text-center mt-4 text-red-400 font-semibold animate-fade-in">Not quite. ECN and STP brokers act as intermediaries, removing that conflict.</p>}
        </div>
    );
};

const StrategyQuiz: React.FC = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const question = "If you prefer making many small trades throughout the day and closing them within minutes, which trading style suits you best?";
    const options = ["Swing Trading", "Scalping", "Position Trading"];
    const correctAnswer = "Scalping";

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setIsCorrect(answer === correctAnswer);
    };

    return (
        <div className="my-10 p-6 border-2 border-input rounded-lg bg-card">
            <h3 className="text-xl font-bold text-center mb-4">What's Your Style?</h3>
            <p className="text-center text-card-foreground/90 mb-6">{question}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map(option => {
                    const isSelected = selectedAnswer === option;
                    let stateClass = 'bg-input hover:bg-input/70';
                    if (isSelected) {
                        stateClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                    }
                    return (
                        <button 
                            key={option} 
                            onClick={() => handleAnswer(option)}
                            disabled={selectedAnswer !== null}
                            className={`p-4 rounded-lg font-semibold transition-colors ${stateClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {isCorrect === true && <p className="text-center mt-4 text-green-400 font-semibold animate-fade-in">Correct! Scalping is a high-frequency strategy focused on capturing small profits from minor price movements.</p>}
            {isCorrect === false && <p className="text-center mt-4 text-red-400 font-semibold animate-fade-in">Not quite. That description fits Scalping perfectly.</p>}
        </div>
    );
};

const BeginnerQuiz: React.FC = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const question = "In the currency pair GBP/USD, if you 'go long' (buy), what are you hoping for?";
    const options = ["GBP to weaken against USD", "GBP to strengthen against USD", "The price to stay the same"];
    const correctAnswer = "GBP to strengthen against USD";

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setIsCorrect(answer === correctAnswer);
    };

    return (
        <div className="my-10 p-6 border-2 border-input rounded-lg bg-card">
            <h3 className="text-xl font-bold text-center mb-4">Beginner Knowledge Check!</h3>
            <p className="text-center text-card-foreground/90 mb-6">{question}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map(option => {
                    const isSelected = selectedAnswer === option;
                    let stateClass = 'bg-input hover:bg-input/70';
                    if (isSelected) {
                        stateClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                    }
                    return (
                        <button 
                            key={option} 
                            onClick={() => handleAnswer(option)}
                            disabled={selectedAnswer !== null}
                            className={`p-4 rounded-lg font-semibold transition-colors ${stateClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {isCorrect === true && <p className="text-center mt-4 text-green-400 font-semibold animate-fade-in">Correct! Going long means you are buying the base currency (GBP), profiting if its value rises.</p>}
            {isCorrect === false && <p className="text-center mt-4 text-red-400 font-semibold animate-fade-in">Not quite. Going long means you expect the first currency in the pair to strengthen.</p>}
        </div>
    );
};

const AutomatedTradingQuiz: React.FC = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const question = "What is the biggest risk of creating a trading bot that performs perfectly on historical data?";
    const options = ["The bot will trade too fast", "Over-optimization (curve-fitting)", "The VPS will fail"];
    const correctAnswer = "Over-optimization (curve-fitting)";

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setIsCorrect(answer === correctAnswer);
    };

    return (
        <div className="my-10 p-6 border-2 border-input rounded-lg bg-card">
            <h3 className="text-xl font-bold text-center mb-4">Automation Knowledge Check!</h3>
            <p className="text-center text-card-foreground/90 mb-6">{question}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map(option => {
                    const isSelected = selectedAnswer === option;
                    let stateClass = 'bg-input hover:bg-input/70';
                    if (isSelected) {
                        stateClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                    }
                    return (
                        <button 
                            key={option} 
                            onClick={() => handleAnswer(option)}
                            disabled={selectedAnswer !== null}
                            className={`p-4 rounded-lg font-semibold transition-colors ${stateClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {isCorrect === true && <p className="text-center mt-4 text-green-400 font-semibold animate-fade-in">Correct! A bot perfectly tuned to past data often fails in live markets because it has been 'curve-fitted' and cannot adapt.</p>}
            {isCorrect === false && <p className="text-center mt-4 text-red-400 font-semibold animate-fade-in">That's a risk, but the biggest danger is over-optimization. A bot that never loses in backtesting is often a red flag.</p>}
        </div>
    );
};

const LeverageQuiz: React.FC = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const question = "With 1:100 leverage, a 1% price move against your position can cause approximately how much loss to your account equity?";
    const options = ["1% loss", "10% loss", "100% loss (wipeout)"];
    const correctAnswer = "100% loss (wipeout)";

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setIsCorrect(answer === correctAnswer);
    };

    return (
        <div className="my-10 p-6 border-2 border-input rounded-lg bg-card">
            <h3 className="text-xl font-bold text-center mb-4">Leverage Risk Check!</h3>
            <p className="text-center text-card-foreground/90 mb-6">{question}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map(option => {
                    const isSelected = selectedAnswer === option;
                    let stateClass = 'bg-input hover:bg-input/70';
                    if (isSelected) {
                        stateClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                    }
                    return (
                        <button 
                            key={option} 
                            onClick={() => handleAnswer(option)}
                            disabled={selectedAnswer !== null}
                            className={`p-4 rounded-lg font-semibold transition-colors ${stateClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {isCorrect === true && <p className="text-center mt-4 text-green-400 font-semibold animate-fade-in">Correct! Leverage magnifies moves. A 1% market move multiplied by 100x leverage results in a 100% loss of your margin.</p>}
            {isCorrect === false && <p className="text-center mt-4 text-red-400 font-semibold animate-fade-in">Not quite. Remember that leverage magnifies the market's movement. 1% x 100 leverage = 100% potential loss.</p>}
        </div>
    );
};

const PlatformQuiz: React.FC = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const question = "You are a scalper who values a clean interface and seeing market depth. Which platform is likely the best fit for you?";
    const options = ["MT4", "MT5", "cTrader"];
    const correctAnswer = "cTrader";

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setIsCorrect(answer === correctAnswer);
    };

    return (
        <div className="my-10 p-6 border-2 border-input rounded-lg bg-card">
            <h3 className="text-xl font-bold text-center mb-4">Platform Knowledge Check!</h3>
            <p className="text-center text-card-foreground/90 mb-6">{question}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map(option => {
                    const isSelected = selectedAnswer === option;
                    let stateClass = 'bg-input hover:bg-input/70';
                    if (isSelected) {
                        stateClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                    }
                    return (
                        <button 
                            key={option} 
                            onClick={() => handleAnswer(option)}
                            disabled={selectedAnswer !== null}
                            className={`p-4 rounded-lg font-semibold transition-colors ${stateClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {isCorrect === true && <p className="text-center mt-4 text-green-400 font-semibold animate-fade-in">Correct! cTrader is renowned for its modern interface and built-in Level II Depth of Market, making it ideal for scalpers.</p>}
            {isCorrect === false && <p className="text-center mt-4 text-red-400 font-semibold animate-fade-in">Not quite. While MT5 has market depth, cTrader is specifically designed with manual execution and a clean UI in mind.</p>}
        </div>
    );
};

const CopyTradingQuiz: React.FC = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const question = "When choosing a trader to copy, what is 'Maximum Drawdown' an important indicator of?";
    const options = ["Their total profit", "The biggest loss their account has experienced", "How many followers they have"];
    const correctAnswer = "The biggest loss their account has experienced";

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setIsCorrect(answer === correctAnswer);
    };

    return (
        <div className="my-10 p-6 border-2 border-input rounded-lg bg-card">
            <h3 className="text-xl font-bold text-center mb-4">Copy Trading Risk Check!</h3>
            <p className="text-center text-card-foreground/90 mb-6">{question}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map(option => {
                    const isSelected = selectedAnswer === option;
                    let stateClass = 'bg-input hover:bg-input/70';
                    if (isSelected) {
                        stateClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                    }
                    return (
                        <button 
                            key={option} 
                            onClick={() => handleAnswer(option)}
                            disabled={selectedAnswer !== null}
                            className={`p-4 rounded-lg font-semibold transition-colors ${stateClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {isCorrect === true && <p className="text-center mt-4 text-green-400 font-semibold animate-fade-in">Correct! Maximum Drawdown shows the greatest percentage loss from a peak, which is a key indicator of their risk management.</p>}
            {isCorrect === false && <p className="text-center mt-4 text-red-400 font-semibold animate-fade-in">Incorrect. Total profit can be misleading without understanding the risk taken to achieve it. Drawdown is a critical risk metric.</p>}
        </div>
    );
};

const DemoVsLiveQuiz: React.FC = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const question = "What is the single biggest difference a trader faces when moving from a demo to a live account?";
    const options = ["The spreads are wider", "The platform is slower", "The psychological pressure of real money"];
    const correctAnswer = "The psychological pressure of real money";

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setIsCorrect(answer === correctAnswer);
    };

    return (
        <div className="my-10 p-6 border-2 border-input rounded-lg bg-card">
            <h3 className="text-xl font-bold text-center mb-4">Ready to Go Live?</h3>
            <p className="text-center text-card-foreground/90 mb-6">{question}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map(option => {
                    const isSelected = selectedAnswer === option;
                    let stateClass = 'bg-input hover:bg-input/70';
                    if (isSelected) {
                        stateClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                    }
                    return (
                        <button 
                            key={option} 
                            onClick={() => handleAnswer(option)}
                            disabled={selectedAnswer !== null}
                            className={`p-4 rounded-lg font-semibold transition-colors ${stateClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {isCorrect === true && <p className="text-center mt-4 text-green-400 font-semibold animate-fade-in">Correct! The emotions of fear and greed are absent in demo trading but become powerful forces when real capital is at risk.</p>}
            {isCorrect === false && <p className="text-center mt-4 text-red-400 font-semibold animate-fade-in">While technical differences can exist, the overwhelming challenge is managing the emotional impact of trading real money.</p>}
        </div>
    );
};

const TradingRisksQuiz: React.FC = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const question = "Choosing a broker with only an offshore license (e.g., from St. Vincent) primarily exposes you to which type of risk?";
    const options = ["Market Risk", "Leverage Risk", "Broker Risk"];
    const correctAnswer = "Broker Risk";

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setIsCorrect(answer === correctAnswer);
    };

    return (
        <div className="my-10 p-6 border-2 border-input rounded-lg bg-card">
            <h3 className="text-xl font-bold text-center mb-4">Risk Knowledge Check!</h3>
            <p className="text-center text-card-foreground/90 mb-6">{question}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map(option => {
                    const isSelected = selectedAnswer === option;
                    let stateClass = 'bg-input hover:bg-input/70';
                    if (isSelected) {
                        stateClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                    }
                    return (
                        <button 
                            key={option} 
                            onClick={() => handleAnswer(option)}
                            disabled={selectedAnswer !== null}
                            className={`p-4 rounded-lg font-semibold transition-colors ${stateClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {isCorrect === true && <p className="text-center mt-4 text-green-400 font-semibold animate-fade-in">Correct! Broker risk (or counterparty risk) is the danger of the broker failing or acting fraudulently. Top-tier regulation is the best defense.</p>}
            {isCorrect === false && <p className="text-center mt-4 text-red-400 font-semibold animate-fade-in">Not quite. While all risks are present, weak regulation specifically heightens Broker Risk, as there's less oversight to protect your funds.</p>}
        </div>
    );
};

const TradingToolsQuiz: React.FC = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const question = "To ensure you risk exactly 1% of your account on a trade, which tool is non-negotiable?";
    const options = ["A real-time news feed", "A pip value calculator", "A position size calculator"];
    const correctAnswer = "A position size calculator";

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setIsCorrect(answer === correctAnswer);
    };

    return (
        <div className="my-10 p-6 border-2 border-input rounded-lg bg-card">
            <h3 className="text-xl font-bold text-center mb-4">Toolkit Knowledge Check!</h3>
            <p className="text-center text-card-foreground/90 mb-6">{question}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map(option => {
                    const isSelected = selectedAnswer === option;
                    let stateClass = 'bg-input hover:bg-input/70';
                    if (isSelected) {
                        stateClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                    }
                    return (
                        <button 
                            key={option} 
                            onClick={() => handleAnswer(option)}
                            disabled={selectedAnswer !== null}
                            className={`p-4 rounded-lg font-semibold transition-colors ${stateClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {isCorrect === true && <p className="text-center mt-4 text-green-400 font-semibold animate-fade-in">Correct! The position size calculator is the tool that translates your risk percentage into an actual trade size (in lots) based on your stop-loss.</p>}
            {isCorrect === false && <p className="text-center mt-4 text-red-400 font-semibold animate-fade-in">Incorrect. While other tools are useful, the position size calculator is the one that directly implements your risk management rule.</p>}
        </div>
    );
};

const AiTutorCta: React.FC = () => (
    <div className="my-10 p-6 bg-gradient-to-r from-primary-900/40 to-card rounded-lg border-2 border-primary-500/50 shadow-xl text-center">
        <Icons.bot className="h-12 w-12 text-primary-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-card-foreground">Want to Dive Deeper?</h3>
        <p className="text-card-foreground/80 mt-2 max-w-lg mx-auto">
            Our AI Tutor is available 24/7 to answer your specific questions on trading psychology, risk management, and more. Start a personalized learning session now.
        </p>
        <ReactRouterDOM.Link to="/education/ai-tutor">
            <Button size="lg" className="mt-6">Chat with AI Tutor</Button>
        </ReactRouterDOM.Link>
    </div>
);


// --- Enhanced Markdown Parser ---

const parseMarkdown = (markdown: string): string => {
    const processInlines = (text: string): string => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/_([^_]+)_/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code class="bg-input text-primary-400 font-mono py-1 px-2 rounded text-sm">$1</code>')
            .replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
                // External links (http, https, www)
                if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('www.')) {
                    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:underline font-semibold">${linkText} <span class="inline-block align-middle">↗</span></a>`;
                }
                // Internal links - convert to React Router hash format
                const internalUrl = url.startsWith('/') ? `#${url}` : `#/${url}`;
                return `<a href="${internalUrl}" class="text-primary-400 hover:underline font-semibold">${linkText}</a>`;
            });
    };

    const blocks = markdown.trim().split(/\n\n+/);
    
    return blocks.map(block => {
        // H2 with ID
        if (block.match(/^## (.*?){#(.*?)}/)) {
            return block.replace(/^## (.*?){#(.*?)}/, (match, title, id) => `<h2 id="${id}" class="text-3xl font-bold mt-12 mb-6 pt-4 border-b border-input">${processInlines(title)}</h2>`);
        }
        // H3
        if (block.startsWith('### ')) {
            return `<h3 class="text-2xl font-semibold mt-8 mb-4">${processInlines(block.substring(4))}</h3>`;
        }
        // Blockquote
        if (block.startsWith('> ')) {
            const quoteContent = block.split('\n').map(line => line.substring(2)).join(' ');
            return `<blockquote class="border-l-4 border-primary-500 pl-4 italic text-foreground/80 my-6">${processInlines(quoteContent)}</blockquote>`;
        }
        // Table
        if (/^\|.*\|/m.test(block)) {
            const rows = block.trim().split('\n');
            const headerCells = rows[0].split('|').slice(1, -1).map(h => h.trim());
            const bodyRows = rows.slice(2).map(row => row.split('|').slice(1, -1).map(c => c.trim()));

            let tableHtml = '<div class="my-6 overflow-x-auto rounded-lg border border-input"><table class="w-full text-base">';
            tableHtml += '<thead class="bg-input/50"><tr>' + headerCells.map(h => `<th class="p-4 font-semibold text-left">${processInlines(h)}</th>`).join('') + '</tr></thead>';
            tableHtml += '<tbody>' + bodyRows.map(row => '<tr class="border-t border-input">' + row.map(cell => `<td class="p-4 align-top">${processInlines(cell)}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>';
            return tableHtml;
        }
        // Unordered List
        if (block.startsWith('* ')) {
            const items = block.split('\n').map(item => `<li class="ml-5">${processInlines(item.replace(/^\* /, '').trim())}</li>`).join('');
            return `<ul class="list-disc pl-5 space-y-2 my-6">${items}</ul>`;
        }
        // Paragraphs
        return `<p class="my-6 leading-relaxed">${processInlines(block)}</p>`;
    }).join('');
};


const extractTocItems = (markdown: string): TocItem[] => {
    const tocItems: TocItem[] = [];
    const h2Regex = /^## (.*?){#(.*?)}/gm;
    let match;
    while ((match = h2Regex.exec(markdown)) !== null) {
        tocItems.push({
            title: match[1].trim(),
            id: match[2].trim(),
        });
    }
    return tocItems;
};

const extractFaqs = (markdown: string) => {
    const faqs = [];
    const faqRegex = /\*\*Q: (.*?)\*\*[\s\S]*?A: ([\s\S]*?)(?=\n\n\*\*Q:|\n### FAQ|\s*$)/g;
    let match;
    while ((match = faqRegex.exec(markdown)) !== null) {
        faqs.push({
            question: match[1].trim(),
            answer: match[2].trim(),
        });
    }
    return faqs;
};

const BlogPostPage: React.FC = () => {
    const { slug } = ReactRouterDOM.useParams<{ slug: string }>();
    const post = blogPosts.find(p => p.slug === slug);
    
    const discussionContext = useContext(DiscussionContext);
    const { user } = useAuth();
    
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [isSubmittingPost, setIsSubmittingPost] = useState(false);

    const reviewer = useMemo(() => {
        if (!post?.reviewedBy) return null;
        return authors.find(a => a.slug === post.reviewedBy.slug);
    }, [post]);

    const relatedPosts = useMemo(() => {
        if (!post) return [];
        return blogPosts
            .filter(p => p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
            .slice(0, 4);
    }, [post]);
    
    const posts = useMemo(() => {
      if (!discussionContext || !post) return [];
      return discussionContext.getPostsByTopicId(post.slug);
    }, [discussionContext, post]);


    if (!post || !discussionContext) {
        return <NotFoundPage />;
    }
    
    const { addPost } = discussionContext;

    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!postTitle.trim() || !postContent.trim() || !user) return;
        setIsSubmittingPost(true);
        setTimeout(() => {
            addPost({
                topicId: post.slug,
                userId: user.id,
                userName: user.name,
                title: postTitle,
                content: postContent,
            });
            setPostTitle('');
            setPostContent('');
            setIsSubmittingPost(false);
        }, 500);
    };

    const canonicalUrl = `https://brokeranalysis.com/#/blog/${post.slug}`;
    const tocItems = extractTocItems(post.content);
    const faqs = extractFaqs(post.content);
    
    // Split content by shortcodes to inject React components
    const contentParts = post.content.split(/(\[DOWNLOAD_RESOURCE\]|\[INTERACTIVE_QUIZ\]|\[BEGINNER_QUIZ\]|\[AUTOMATED_TRADING_QUIZ\]|\[LEVERAGE_QUIZ\]|\[PLATFORM_QUIZ\]|\[COPY_TRADING_QUIZ\]|\[DEMO_VS_LIVE_QUIZ\]|\[TRADING_RISKS_QUIZ\]|\[TRADING_TOOLS_QUIZ\]|\[AI_TUTOR_CTA\])/);

    const blogPostJsonLd: any = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl,
        },
        "headline": post.title,
        "description": post.metaDescription,
        "image": post.imageUrl,
        "author": {
            "@type": "Person",
            "name": post.author.name,
            "url": `https://brokeranalysis.com/#/author/${post.author.slug}`
        },
        "publisher": {
            "@type": "Organization",
            "name": "Brokeranalysis",
            "logo": {
                "@type": "ImageObject",
                "url": "https://brokeranalysis.com/vite.svg" 
            }
        },
        "datePublished": new Date(post.date).toISOString(),
    };
    if (post.lastUpdated) {
        blogPostJsonLd.dateModified = new Date(post.lastUpdated).toISOString();
    }
    if (post.reviewedBy) {
        blogPostJsonLd.reviewedBy = {
            "@type": "Person",
            "name": post.reviewedBy.name,
            "url": `https://brokeranalysis.com/#/author/${post.reviewedBy.slug}`
        };
    }

    const faqJsonLd = faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : null;

    return (
        <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-4 lg:gap-12">
            <MetaTags
                title={post.metaTitle}
                description={post.metaDescription}
                canonicalUrl={canonicalUrl}
                imageUrl={post.imageUrl}
            />
            <JsonLdSchema data={blogPostJsonLd} />
            {faqJsonLd && <JsonLdSchema data={faqJsonLd} />}
            
            <aside className="hidden lg:block lg:col-span-1">
                <StickyTableOfContents items={tocItems} />
            </aside>

            <main className="lg:col-span-3">
                <article>
                    <header className="mb-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-card-foreground">{post.title}</h1>
                        
                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 text-sm border-t border-b border-input py-4">
                            {/* Author Info */}
                            <div className="flex items-center gap-3">
                                <ReactRouterDOM.Link to={`/author/${post.author.slug}`}>
                                    <img src={post.author.avatarUrl} alt={post.author.name} className="h-12 w-12 rounded-full ring-2 ring-primary-500/50" />
                                </ReactRouterDOM.Link>
                                <div>
                                    <p className="font-bold text-foreground">
                                        <ReactRouterDOM.Link to={`/author/${post.author.slug}`} className="hover:text-primary-400">{post.author.name}</ReactRouterDOM.Link>
                                    </p>
                                    <p className="text-xs text-foreground/70">
                                        Published on {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            {/* Reviewer Info */}
                            {reviewer && (
                                <div className="flex items-center gap-3">
                                     <ReactRouterDOM.Link to={`/author/${reviewer.slug}`}>
                                        <img src={reviewer.avatarUrl} alt={reviewer.name} className="h-12 w-12 rounded-full" />
                                    </ReactRouterDOM.Link>
                                    <div>
                                        <p className="font-semibold text-foreground">
                                            Reviewed by <ReactRouterDOM.Link to={`/author/${reviewer.slug}`} className="hover:text-primary-400">{reviewer.name}</ReactRouterDOM.Link>
                                        </p>
                                        {post.lastUpdated && (
                                            <p className="text-xs text-foreground/70">
                                                Fact-checked on {new Date(post.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                         <div className="mt-4 text-xs text-foreground/60 flex items-center gap-1">
                            <Icons.clock className="h-3 w-3" /> {post.readTimeMinutes} min read
                        </div>
                    </header>
                    
                    {post.keyTakeaways && <KeyTakeaways items={post.keyTakeaways} />}

                    <img src={post.imageUrl} alt={post.title} className="w-full h-auto aspect-video object-cover rounded-lg mb-8" loading="lazy" decoding="async" />
                    
                    <div className="lg:hidden">
                        <InlineTableOfContents items={tocItems} />
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-card-foreground/90 text-lg">
                        {contentParts.map((part, index) => {
                            if (part === '[DOWNLOAD_RESOURCE]') return <DownloadableResource key={index} />;
                            if (part === '[INTERACTIVE_QUIZ]') return <InteractiveQuiz key={index} />;
                            if (part === '[BEGINNER_QUIZ]') return <BeginnerQuiz key={index} />;
                            if (part === '[AUTOMATED_TRADING_QUIZ]') return <AutomatedTradingQuiz key={index} />;
                            if (part === '[LEVERAGE_QUIZ]') return <LeverageQuiz key={index} />;
                            if (part === '[PLATFORM_QUIZ]') return <PlatformQuiz key={index} />;
                            if (part === '[COPY_TRADING_QUIZ]') return <CopyTradingQuiz key={index} />;
                            if (part === '[DEMO_VS_LIVE_QUIZ]') return <DemoVsLiveQuiz key={index} />;
                            if (part === '[TRADING_RISKS_QUIZ]') return <TradingRisksQuiz key={index} />;
                            if (part === '[TRADING_TOOLS_QUIZ]') return <TradingToolsQuiz key={index} />;
                            if (part === '[AI_TUTOR_CTA]') return <AiTutorCta key={index} />;
                            return <div key={index} dangerouslySetInnerHTML={{ __html: parseMarkdown(part) }} />;
                        })}
                    </div>

                    <footer className="mt-12 pt-8 border-t border-input">
                       <ShareButtons title={post.title} url={canonicalUrl} />
                    </footer>
                </article>

                {relatedPosts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                            <Icons.newspaper className="h-8 w-8 text-primary-400" />
                            Related Articles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {relatedPosts.map(relatedPost => (
                                <BlogPostCard key={relatedPost.id} post={relatedPost} />
                            ))}
                        </div>
                    </section>
                )}

                <section id="discussion" className="mt-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">Community Q&A</h2>
                     {user ? (
                        <Card className="my-6 bg-input/40">
                            <CardContent>
                                <h3 className="text-xl font-semibold mb-4">Ask a Question</h3>
                                <form onSubmit={handlePostSubmit} className="space-y-4">
                                    <Input
                                        label="Question Title"
                                        id="post-title"
                                        type="text"
                                        placeholder="e.g., How does this apply to commodity trading?"
                                        value={postTitle}
                                        onChange={(e) => setPostTitle(e.target.value)}
                                        required
                                    />
                                    <div>
                                        <label htmlFor="post-content" className="block text-sm font-medium text-card-foreground/90 mb-1">Your Question</label>
                                        <textarea
                                            id="post-content"
                                            rows={3}
                                            className="block w-full bg-input border-input rounded-md shadow-sm p-2 placeholder:text-foreground/60"
                                            placeholder="Provide more details here..."
                                            value={postContent}
                                            onChange={(e) => setPostContent(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <Button type="submit" disabled={isSubmittingPost || !postTitle.trim() || !postContent.trim()}>
                                        {isSubmittingPost ? <Spinner size="sm" /> : 'Post Question'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="text-center p-6 bg-card rounded-lg border border-input my-8">
                            <p className="text-card-foreground/80"><ReactRouterDOM.Link to="/login" className="text-primary-400 font-semibold hover:underline">Log in</ReactRouterDOM.Link> to join the discussion.</p>
                        </div>
                    )}
                    <div className="space-y-6 mt-8">
                        {posts.length > 0 ? (
                            posts.map(post => <DiscussionPostCard key={post.id} post={post} />)
                        ) : (
                            <p className="text-center text-foreground/70 py-8">No questions have been asked about this article yet. Be the first!</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default BlogPostPage;
