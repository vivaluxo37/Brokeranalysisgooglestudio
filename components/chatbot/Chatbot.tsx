import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../../constants';
import { ChatMessage } from '../../types';
import { getChatbotResponseStream } from '../../services/geminiService';
import { useTranslation } from '../../hooks/useTranslation';

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5 p-2">
        <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce"></div>
    </div>
);

const parseMarkdown = (text: string): string => {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold

  html = html.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
    // Check if it's an external link
    if (url.startsWith('http')) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:underline">${linkText}</a>`;
    }
    // Internal link
    return `<a href="${url}" class="text-primary-400 hover:underline">${linkText}</a>`;
  });
  return html;
};


const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-start gap-3 my-2 animate-fade-in ${isUser ? 'justify-end' : ''}`}>
            {!isUser && <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-input text-primary-400"><Icons.bot className="h-5 w-5"/></span>}
            <div className={`p-3 rounded-xl max-w-sm md:max-w-md shadow-md ${isUser ? 'bg-primary-600 text-white ltr:rounded-br-none rtl:rounded-bl-none' : 'bg-input text-card-foreground ltr:rounded-bl-none rtl:rounded-br-none'}`}>
                <p className="text-sm break-words" dangerouslySetInnerHTML={{ __html: parseMarkdown(message.text) }} />
            </div>
            {isUser && <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-input text-foreground"><Icons.user className="h-5 w-5"/></span>}
        </div>
    );
};

const Chatbot: React.FC = () => {
    const { t } = useTranslation();
    const suggestions = t('chatbot.suggestions');

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'ai', text: t('chatbot.greeting') }
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
        try {
            const stream = await getChatbotResponseStream(userMessageText);
            let firstChunk = true;
            let currentText = "";
            
            for await (const chunk of stream) {
                currentText += chunk.text;
                if (firstChunk) {
                    setIsLoading(false); // Hide typing indicator
                    const aiMessage: ChatMessage = { sender: 'ai', text: currentText };
                    setMessages(prev => [...prev, aiMessage]);
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
            }
            if (firstChunk) setIsLoading(false); // Handle empty stream
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


    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-5 ltr:right-5 rtl:left-5 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-110 animate-pulse"
                aria-label="Open Chatbot"
            >
                <Icons.chat className="h-8 w-8" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-5 ltr:right-5 rtl:left-5 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-gradient-to-br from-card to-background rounded-2xl shadow-2xl flex flex-col z-50 border border-input/50 animate-fade-in transition-colors duration-300">
            <header className="p-4 flex justify-between items-center bg-card/50 rounded-t-2xl border-b border-input/50 backdrop-blur-sm transition-colors duration-300">
                <h3 className="font-bold text-lg text-card-foreground">BrokerBot Assistant</h3>
                <button onClick={() => setIsOpen(false)} className="text-foreground/60 hover:text-foreground"><Icons.close className="h-6 w-6" /></button>
            </header>
            <main className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => <ChatMessageBubble key={index} message={msg} />)}
                {isLoading && (
                    <div className="flex items-start gap-3 my-2 animate-fade-in">
                        <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-input text-primary-400"><Icons.bot className="h-5 w-5"/></span>
                        <div className="p-1 rounded-xl bg-input text-card-foreground ltr:rounded-bl-none rtl:rounded-br-none shadow-md">
                            <TypingIndicator />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>
            {messages.length === 1 && (
                <div className="p-3 border-t border-input/50">
                    <p className="text-xs text-foreground/60 mb-2 font-semibold tracking-wider">QUICK ACTIONS</p>
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(suggestions) && suggestions.map((q, i) => (
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
            <footer className="p-3 border-t border-input/50 bg-card/50 rounded-b-2xl transition-colors duration-300">
                <div className="flex items-center bg-input rounded-xl transition-colors duration-300">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about spreads, leverage..."
                        className="w-full bg-transparent p-3 focus:outline-none text-foreground placeholder:text-foreground/60"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="p-3 text-primary-500 disabled:text-foreground/40 hover:text-primary-400 transition-colors">
                       <Icons.send className="h-6 w-6"/>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Chatbot;