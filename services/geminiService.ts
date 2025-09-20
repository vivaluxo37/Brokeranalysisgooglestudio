import { GoogleGenAI, Type } from "@google/genai";
import { Broker } from '../types';

// FIX: Initialize GoogleGenAI directly with the API key from environment variables and remove fallback logic, as per coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

// --- Chatbot Functionality ---

export const getChatbotResponseStream = async (message: string) => {
  const response = await ai.models.generateContentStream({
    model: model,
    contents: `You are BrokerBot, an expert AI assistant for forex trading. A user is asking a question. Provide a helpful, concise, and friendly response. User's question: "${message}"`,
  });

  return response;
};

// --- Broker Matcher Functionality ---

interface BrokerMatcherPreferences {
  regulators: string;
  platforms: string;
  minDeposit: string;
  priority: string;
}

interface BrokerRecommendationResponse {
  reasoning: string;
  recommendedBrokerIds: string[];
}

export const getBrokerRecommendations = async (
  preferences: BrokerMatcherPreferences,
  brokers: Broker[]
): Promise<BrokerRecommendationResponse> => {
  const brokerData = brokers.map(b => ({
    id: b.id,
    name: b.name,
    score: b.score,
    foundingYear: b.foundingYear,
    regulators: b.regulation.regulators,
    platforms: b.technology.platforms,
    minDeposit: b.accessibility.minDeposit,
    eurusdSpread: b.tradingConditions.spreads.eurusd,
    executionType: b.technology.executionType,
  }));

  const prompt = `
    Based on the user's preferences and the provided list of forex brokers, recommend the top 3 brokers that are the best match.

    User Preferences:
    - Preferred Regulators: ${preferences.regulators || 'Any'}
    - Preferred Platforms: ${preferences.platforms || 'Any'}
    - Maximum Initial Deposit: $${preferences.minDeposit}
    - Main Priority: ${preferences.priority}

    Available Brokers (JSON format):
    ${JSON.stringify(brokerData, null, 2)}

    Your task is to analyze the brokers against the user's preferences.
    Provide a brief reasoning for your choices (2-3 sentences), explaining why they are a good fit.
    Then, provide a list of the top 3 broker IDs that you recommend.
    Respond ONLY in the specified JSON format.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reasoning: {
            type: Type.STRING,
            description: "A brief explanation of why these brokers were recommended based on the user's preferences.",
          },
          recommendedBrokerIds: {
            type: Type.ARRAY,
            description: "An array of strings, where each string is the ID of a recommended broker.",
            items: {
              type: Type.STRING,
            },
          },
        },
        required: ["reasoning", "recommendedBrokerIds"],
      },
    },
  });

  try {
    const text = response.text.trim();
    // In a real scenario, more robust parsing and validation would be needed.
    const parsedResponse: BrokerRecommendationResponse = JSON.parse(text);
    return parsedResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", response.text, error);
    throw new Error("Received an invalid response from the AI. Please try again.");
  }
};


// --- Cost Analysis Functionality ---

interface CostData {
    brokerName: string;
    spread: number;
    commission: number;
    totalCost: number;
}

export const getCostAnalysis = async (instrument: string, costData: CostData[]): Promise<string> => {
    const prompt = `
        You are an expert forex market analyst. Your task is to provide a concise cost analysis for trading one standard lot of ${instrument}.
        The user has provided real-time cost data from several brokers.
        Analyze the data below, which includes spread, commission, and a calculated total cost.

        Live Cost Data:
        ${JSON.stringify(costData, null, 2)}

        Based on this data, please provide:
        1. A clear recommendation for the most cost-effective broker at this moment.
        2. A brief, 2-3 sentence explanation of your reasoning, highlighting why that broker is cheaper. Mention the importance of considering both spread and commission.
        3. Keep the tone helpful and professional. Do not output JSON.
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });

    return response.text;
};
