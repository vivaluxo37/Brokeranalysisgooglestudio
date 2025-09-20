
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../../constants';
import { ChatMessage } from '../../types';
import { getChatbotResponseStream } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white"><Icons.bot className="h-5 w-5"/></span>}
            <div className={`p-3 rounded-lg max-w-sm md:max-w-md ${isUser ? 'bg-primary-600 text-white' : 'bg-input text-foreground'}`}>
                <p className="text-sm break-words">{message.text}</p>
            </div>
            {isUser && <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-card text-white"><Icons.user className="h-5 w-5"/></span>}
        </div>
    );
};


const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'ai', text: "Hello! I'm BrokerBot. Ask me anything about forex trading or brokers." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        const aiMessage: ChatMessage = { sender: 'ai', text: "" };
        setMessages(prev => [...prev, aiMessage]);

        try {
            const stream = await getChatbotResponseStream(input.trim());
            let currentText = "";
            for await (const chunk of stream) {
                currentText += chunk.text;
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage.sender === 'ai') {
                       return [...prev.slice(0, -1), { ...lastMessage, text: currentText }];
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.error('Gemini API error:', error);
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage.sender === 'ai') {
                    return [...prev.slice(0, -1), { ...lastMessage, text: "Sorry, I'm having trouble connecting right now." }];
                }
                return prev;
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-5 right-5 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-110"
                aria-label="Open Chatbot"
            >
                <Icons.chat className="h-8 w-8" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-5 right-5 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-card rounded-lg shadow-2xl flex flex-col z-50 border border-input">
            <header className="p-4 flex justify-between items-center bg-input rounded-t-lg">
                <h3 className="font-bold text-lg">BrokerBot Assistant</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><Icons.close className="h-6 w-6" /></button>
            </header>
            <main className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => <ChatMessageBubble key={index} message={msg} />)}
                {isLoading && messages[messages.length - 1].sender === 'user' && (
                     <div className="flex items-start gap-3 my-4">
                        <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white"><Icons.bot className="h-5 w-5"/></span>
                        <div className={`p-3 rounded-lg bg-input text-foreground`}><Spinner size="sm" /></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>
            <footer className="p-4 border-t border-input">
                <div className="flex items-center bg-background rounded-lg">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask a question..."
                        className="w-full bg-transparent p-3 focus:outline-none"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="p-3 text-primary-500 disabled:text-gray-500">
                       <Icons.send className="h-6 w-6"/>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Chatbot;
