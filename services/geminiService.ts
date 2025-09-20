
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Broker, Review } from '../types';

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
  experience: string;
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
    regulators: b.regulation.regulators,
    platforms: b.technology.platforms,
    minDeposit: b.accessibility.minDeposit,
    eurusdSpread: b.tradingConditions.spreads.eurusd,
    executionType: b.technology.executionType,
  }));

  const prompt = `
    Based on the user's preferences and the provided list of forex brokers, recommend the top 3 brokers that are the best match.

    User Preferences:
    - Trading Experience: ${preferences.experience}
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
            items: { type: Type.STRING },
          },
        },
        required: ["reasoning", "recommendedBrokerIds"],
      },
    },
  });

  const parsedResponse: BrokerRecommendationResponse = JSON.parse(response.text.trim());
  return parsedResponse;
};

// --- Cost Analysis Functionality ---

interface CostData {
    name: string;
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

// --- NEW: Personalized Cost Projection ---
export type TradingStyle = 'Scalper' | 'Day Trader' | 'Swing Trader';

interface PersonalizedCostRequest {
    style: TradingStyle;
    instrument: string;
    brokers: { name: string; spread: number; commission: number; swapCategory: 'Low' | 'Standard' | 'High' }[];
}

export const getPersonalizedCostProjection = async (request: PersonalizedCostRequest): Promise<string> => {
    const prompt = `
        As a forex expert, create a personalized cost projection analysis for a trader with the following profile:
        - Trading Style: ${request.style}
        - Instrument: ${request.instrument}

        Here is the live data for the brokers they are considering:
        ${JSON.stringify(request.brokers, null, 2)}

        Analyze the data from the perspective of their trading style:
        - For a 'Scalper', focus almost exclusively on the lowest spread + commission. Swaps are irrelevant.
        - For a 'Day Trader', spread + commission is still key, but mention if high swaps could be a factor for occasional overnight trades.
        - For a 'Swing Trader', emphasize the huge importance of low swap fees ('swapCategory: Low'), as these costs will accumulate over many days. A slightly higher spread is acceptable if swaps are very low.

        Your response should be a concise paragraph (3-4 sentences).
        1. Start by recommending the best broker FOR THEIR STYLE.
        2. Explain your choice clearly, referencing their style (e.g., "As a scalper, your priority is...").
        3. Briefly mention why the other brokers are less suitable for them.
        Do not output JSON.
    `;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
};


// --- NEW: AI Review Summarizer ---
export interface ReviewSummary {
    summary: string;
    pros: string[];
    cons: string[];
}
export const getReviewSummary = async (brokerName: string, reviews: Review[]): Promise<ReviewSummary> => {
    if (reviews.length === 0) {
        return { summary: "There are no reviews yet for this broker.", pros: [], cons: [] };
    }
    const comments = reviews.map(r => r.comment).join('\n - ');
    const prompt = `
        Analyze the following user reviews for the forex broker "${brokerName}".
        
        Reviews:
        - ${comments}

        Based on these reviews, perform the following tasks:
        1. Write a short, neutral summary (1-2 sentences) of the overall customer sentiment.
        2. Identify the top 3 most frequently mentioned positive points (pros).
        3. Identify the top 3 most frequently mentioned negative points (cons).

        Respond ONLY in the specified JSON format.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING },
                    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["summary", "pros", "cons"],
            }
        }
    });
    return JSON.parse(response.text.trim());
};

// --- NEW: Regulatory Trust Score ---
export interface TrustScore {
    score: number;
    reasoning: string;
    sources: { uri: string, title: string }[];
}
export const getRegulatoryTrustScore = async (brokerName: string, regulators: string[]): Promise<TrustScore> => {
    const prompt = `
        Act as a financial compliance analyst. I need a "Regulatory Trust Score" for the forex broker: "${brokerName}".
        They claim to be regulated by: ${regulators.join(', ')}.

        Using your search capabilities, please do the following:
        1.  Verify if they are indeed regulated by these authorities. Pay special attention to top-tier regulators like FCA (UK), ASIC (Australia), and CySEC (Cyprus).
        2.  Search for any recent (last 2 years) major regulatory fines, warnings, or enforcement actions against "${brokerName}".
        3.  Based on the quality of their regulation and the absence/presence of recent negative actions, provide a trust score from 1.0 to 10.0 (e.g., 9.5).
        4.  Provide a very brief, one-sentence reasoning for your score. For example: "High score based on regulation by multiple top-tier authorities and no recent fines found."

        Your output must be only the score and the reasoning. Example: "9.5/10. High score due to regulation by multiple top-tier authorities and no recent fines found." Do not add any other text.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const text = response.text;
    const scoreMatch = text.match(/(\d+\.?\d*)\/10/);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 7.0; // Default score
    const reasoning = text.split('. ').slice(1).join('. ').trim() || "Score based on available regulatory information.";

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map(chunk => chunk.web)
        .filter(Boolean) // Step 1: Safely remove any undefined/null entries.
        .filter((web, index, self) => self.findIndex(w => w.uri === web.uri) === index) // Step 2: Now that `self` has no undefineds, find unique URIs.
        .map(web => ({ uri: web.uri, title: web.title })) as { uri: string, title: string }[] || [];

    return { score, reasoning, sources };
};


// --- NEW: AI Comparison Summary ---
export const getComparisonSummary = async (brokers: Broker[]): Promise<string> => {
    const prompt = `
    Act as an expert forex broker analyst. You are comparing the following brokers: ${brokers.map(b => b.name).join(', ')}.

    Here is their data:
    ${JSON.stringify(brokers.map(b => ({name: b.name, score: b.score, regulators: b.regulation.regulators, minDeposit: b.accessibility.minDeposit, eurusdSpread: b.tradingConditions.spreads.eurusd, platforms: b.technology.platforms})), null, 2)}

    Please provide a summary analysis with a clear winner for two types of traders:
    1.  **For a Beginner Trader:** Who is the best choice and why? (Focus on ease of use, low min deposit, good support, platform simplicity).
    2.  **For an Experienced Scalper:** Who is the best choice and why? (Focus on ultra-low spreads, fast execution, advanced platforms like cTrader).

    Structure your response as two short paragraphs, one for each trader type. Be decisive.
    `;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
}

// --- NEW: AI Duel Verdict ---
export const getDuelVerdict = async (broker1: Broker, broker2: Broker): Promise<string> => {
    const prompt = `
    You are the judge in a head-to-head "Broker Duel" between ${broker1.name} and ${broker2.name}.

    Broker 1 Data (${broker1.name}):
    ${JSON.stringify({score: broker1.score, regulators: broker1.regulation.regulators, minDeposit: broker1.accessibility.minDeposit, eurusdSpread: broker1.tradingConditions.spreads.eurusd, platforms: broker1.technology.platforms}, null, 2)}

    Broker 2 Data (${broker2.name}):
    ${JSON.stringify({score: broker2.score, regulators: broker2.regulation.regulators, minDeposit: broker2.accessibility.minDeposit, eurusdSpread: broker2.tradingConditions.spreads.eurusd, platforms: broker2.technology.platforms}, null, 2)}

    Based on this data, declare an overall winner. Write a short, exciting verdict (3-4 sentences) explaining your decision. Mention the key factor that tipped the scales in the winner's favor.
    `;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
}
