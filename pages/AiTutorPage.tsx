
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { ChatMessage } from '../types';
import { getAiTutorResponseStream } from '../services/geminiService';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Markdown from '../components/ui/markdown';

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5 p-2">
        <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce"></div>
    </div>
);

// Removed custom parseMarkdown function - now using Markdown component


const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-start gap-3 my-4 animate-fade-in ${isUser ? 'justify-end' : ''}`}>
            {!isUser && <span className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-input text-primary-400"><Icons.bot className="h-6 w-6"/></span>}
            <div className={`p-4 rounded-xl max-w-lg shadow-md ${isUser ? 'bg-primary-600 text-white ltr:rounded-br-none rtl:rounded-bl-none' : 'bg-card text-card-foreground ltr:rounded-bl-none rtl:rounded-br-none'}`}>
                <div className="text-sm break-words">
                    <Markdown content={message.text} />
                </div>
            </div>
             {isUser && <span className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-input text-foreground"><Icons.user className="h-6 w-6"/></span>}
        </div>
    );
};

const AiTutorPage: React.FC = () => {
    const { t } = useTranslation();
    const suggestions = [
        "Explain risk management like I'm 5",
        "What is the difference between ECN and a Market Maker?",
        "Tell me about the RSI indicator",
        "What is a stop-loss order?"
    ];

    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'ai', text: "Hello! I'm your AI Forex Tutor. What topic would you like to learn about today? You can ask me anything about trading concepts." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const processStreamedResponse = async (userMessageText: string) => {
        setIsLoading(true);
        const history = messages.slice(1); // Exclude initial greeting from history
        try {
            const stream = await getAiTutorResponseStream(userMessageText, history);
            if (!stream) {
                setIsLoading(false);
                return;
            }

            const extractChunkText = (value: unknown): string => {
                if (!value && value !== 0) return '';
                if (typeof value === 'string') return value;
                if (typeof value === 'function') {
                    try {
                        return String((value as () => string)());
                    } catch {
                        return '';
                    }
                }
                if (typeof value === 'object' && value !== null) {
                    const chunkObj = value as { text?: unknown };
                    if (typeof chunkObj.text === 'function') {
                        try {
                            return String(chunkObj.text());
                        } catch {
                            return '';
                        }
                    }
                    if (typeof chunkObj.text === 'string') {
                        return chunkObj.text;
                    }
                }
                return String(value);
            };

            let firstChunk = true;
            let currentText = '';

            const appendChunk = (chunkText: string) => {
                if (!chunkText) {
                    return;
                }

                currentText += chunkText;
                if (firstChunk) {
                    setIsLoading(false);
                    setMessages(prev => [...prev, { sender: 'ai', text: currentText }]);
                    firstChunk = false;
                } else {
                    setMessages(prev => {
                        const lastMessage = prev[prev.length - 1];
                        if (lastMessage?.sender === 'ai') {
                            return [...prev.slice(0, -1), { ...lastMessage, text: currentText }];
                        }
                        return prev;
                    });
                }
            };

            const reader = typeof (stream as ReadableStream<any>).getReader === 'function'
                ? (stream as ReadableStream<any>).getReader()
                : null;

            if (reader) {
                try {
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;
                        appendChunk(extractChunkText(value));
                    }
                } finally {
                    reader.releaseLock?.();
                }
            } else if (Symbol.asyncIterator && typeof (stream as any)[Symbol.asyncIterator] === 'function') {
                for await (const value of stream as AsyncIterable<unknown>) {
                    appendChunk(extractChunkText(value));
                }
            } else if (typeof (stream as any)?.text === 'function') {
                const fullText = await (stream as any).text();
                appendChunk(typeof fullText === 'string' ? fullText : '');
            }

            if (firstChunk) {
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Gemini API error:', error);
            const errorMessage: ChatMessage = { sender: 'ai', text: "Sorry, I'm having trouble connecting right now." };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        const userMessageText = input.trim();
        const userMessage: ChatMessage = { sender: 'user', text: userMessageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        await processStreamedResponse(userMessageText);
    };

    const handleSuggestionClick = async (prompt: string) => {
        if (isLoading) return;
        const userMessage: ChatMessage = { sender: 'user', text: prompt };
        setMessages(prev => [...prev, userMessage]);
        await processStreamedResponse(prompt);
    };


    return (
        <div className="flex flex-col h-[calc(100vh-150px)] max-w-4xl mx-auto">
             <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">AI Tutor</h1>
                <p className="text-lg text-foreground/80 mt-2">Your personal guide to mastering forex trading.</p>
            </div>
            <Card className="flex-1 flex flex-col">
                <main className="flex-1 p-6 overflow-y-auto">
                    {messages.map((msg, index) => <ChatMessageBubble key={index} message={msg} />)}
                    {isLoading && (
                        <div className="flex items-start gap-3 my-2 animate-fade-in">
                            <span className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-input text-primary-400"><Icons.bot className="h-6 w-6"/></span>
                            <div className="p-1 rounded-xl bg-card text-card-foreground ltr:rounded-bl-none rtl:rounded-br-none shadow-md">
                                <TypingIndicator />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>
                {messages.length <= 1 && (
                    <div className="p-4 border-t border-input">
                        <p className="text-xs text-foreground/60 mb-2 font-semibold tracking-wider text-center">SUGGESTIONS</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {suggestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSuggestionClick(q)}
                                    disabled={isLoading}
                                    className="px-3 py-1 text-sm rounded-full bg-input hover:bg-primary-900/50 text-foreground/80 transition-colors disabled:opacity-50"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <footer className="p-4 border-t border-input bg-card/50 rounded-b-xl">
                    <div className="flex items-center bg-input rounded-xl">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about spreads, leverage, risk..."
                            className="w-full bg-transparent p-3 focus:outline-none text-foreground placeholder:text-foreground/60"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="p-3 text-primary-500 disabled:text-foreground/40 hover:text-primary-400 transition-colors">
                        <Icons.send className="h-6 w-6"/>
                        </button>
                    </div>
                </footer>
            </Card>
        </div>
    );
};

export default AiTutorPage;
