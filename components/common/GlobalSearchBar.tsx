import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { brokers } from '../../data/brokers';
import { blogPosts } from '../../data/blog';
import { Icons } from '../../constants';

const tools = [
  { name: 'Economic Calendar', path: '/tools/economic-calendar', icon: Icons.calendar },
  { name: 'Forex Calculators', path: '/tools/calculators', icon: Icons.calculator },
  { name: 'Market Data', path: '/tools/market-data', icon: Icons.trendingUp },
  { name: 'Cost Analyzer', path: '/cost-analyzer', icon: Icons.data },
  { name: 'AI Broker Matcher', path: '/broker-matcher', icon: Icons.bot },
  { name: 'Compare Brokers', path: '/compare', icon: Icons.compare },
  { name: 'Blog', path: '/blog', icon: Icons.newspaper },
  { name: 'Education Hub', path: '/education', icon: Icons.bookOpen },
];

const GlobalSearchBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<{ brokers: typeof brokers, blog: typeof blogPosts, tools: typeof tools }>({ brokers: [], blog: [], tools: [] });
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm.length > 1) {
                const lowerCaseTerm = searchTerm.toLowerCase();
                const brokerResults = brokers.filter(b => b.name.toLowerCase().includes(lowerCaseTerm)).slice(0, 4);
                const blogResults = blogPosts.filter(p => p.title.toLowerCase().includes(lowerCaseTerm)).slice(0, 4);
                const toolResults = tools.filter(t => t.name.toLowerCase().includes(lowerCaseTerm)).slice(0, 3);

                if (brokerResults.length > 0 || blogResults.length > 0 || toolResults.length > 0) {
                    setResults({ brokers: brokerResults, blog: blogResults, tools: toolResults });
                    setIsOpen(true);
                } else {
                    setResults({ brokers: [], blog: [], tools: [] });
                    setIsOpen(false);
                }
            } else {
                setIsOpen(false);
            }
        }, 200);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLinkClick = () => {
        setIsOpen(false);
        setSearchTerm('');
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchTerm) {
            const firstResult = results.brokers[0] || results.blog[0] || results.tools[0];
            if (firstResult) {
                const path = 'id' in firstResult ? `/broker/${firstResult.id}` : ('slug' in firstResult ? `/blog/${firstResult.slug}` : firstResult.path);
                navigate(path);
                handleLinkClick();
            }
        }
    };

    return (
        <div className="relative w-full max-w-xs" ref={searchRef}>
            <div className="relative">
                <Icons.search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search brokers, articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.length > 1 && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-input border-transparent rounded-md ltr:pl-9 rtl:pr-9 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                />
            </div>
            {isOpen && (
                <div className="absolute top-full mt-2 w-full sm:w-96 bg-card rounded-lg shadow-2xl border border-input z-50 animate-fade-in max-h-[70vh] overflow-y-auto">
                    {results.brokers.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold uppercase text-foreground/60 p-3 border-b border-input">Brokers</h3>
                            <div className="p-2">
                                {results.brokers.map(broker => (
                                    <Link key={broker.id} to={`/broker/${broker.id}`} onClick={handleLinkClick} className="flex items-center gap-3 p-2 rounded-md hover:bg-input transition-colors">
                                        <img src={broker.logoUrl} alt={broker.name} className="h-8 w-8 bg-white p-1 rounded-md" />
                                        <span>{broker.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    {results.blog.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold uppercase text-foreground/60 p-3 border-b border-t border-input">Blog Articles</h3>
                            <div className="p-2">
                                {results.blog.map(post => (
                                    <Link key={post.id} to={`/blog/${post.slug}`} onClick={handleLinkClick} className="block p-2 rounded-md hover:bg-input transition-colors">
                                        <p className="truncate text-sm">{post.title}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    {results.tools.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold uppercase text-foreground/60 p-3 border-b border-t border-input">Tools</h3>
                            <div className="p-2">
                                {results.tools.map(tool => (
                                    <Link key={tool.path} to={tool.path} onClick={handleLinkClick} className="flex items-center gap-3 p-2 rounded-md hover:bg-input transition-colors">
                                        <tool.icon className="h-5 w-5 text-primary-400" />
                                        <span className="text-sm">{tool.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearchBar;
