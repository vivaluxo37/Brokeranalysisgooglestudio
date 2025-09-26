import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  text: string;
  done: boolean;
}

export async function* getChatbotResponseStream(
  message: string,
  history: ChatMessage[] = []
): AsyncIterable<ChatResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Format history for Gemini
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: formattedHistory.length > 0 ? formattedHistory : undefined,
      context: `You are BrokerBot, an AI assistant for a forex broker comparison platform.
      You help users understand broker features, trading concepts, and make informed decisions about forex trading.
      Be helpful, accurate, and concise. Focus on educational content and broker-specific information.
      When discussing specific brokers, use factual information about regulations, spreads, leverage, and features.`
    });

    const result = await chat.sendMessageStream(message);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield { text: chunkText, done: false };
      }
    }

    yield { text: '', done: true };
  } catch (error) {
    console.error('Gemini API error:', error);
    yield { text: 'I apologize, but I encountered an error. Please try again later.', done: true };
  }
}

export async function* getAiTutorResponseStream(
  message: string,
  history: ChatMessage[] = []
): AsyncIterable<ChatResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: formattedHistory.length > 0 ? formattedHistory : undefined,
      context: `You are an AI Forex Tutor specializing in trading education.
      You explain complex trading concepts in simple terms, provide educational content about:
      - Technical analysis and indicators
      - Risk management strategies
      - Market psychology
      - Trading strategies and systems
      - Economic indicators and news analysis
      Be thorough, educational, and adapt your explanations to the user's level of understanding.
      Use examples and analogies when helpful.`
    });

    const result = await chat.sendMessageStream(message);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield { text: chunkText, done: false };
      }
    }

    yield { text: '', done: true };
  } catch (error) {
    console.error('Gemini API error:', error);
    yield { text: 'I apologize, but I encountered an error. Please try again later.', done: true };
  }
}