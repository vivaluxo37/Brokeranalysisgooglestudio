import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Broker, Review, AIRecommendation, NewsArticle } from '../types';
import { brokers } from '../data/brokers';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

// --- Chatbot Functionality ---

export const getChatbotResponseStream = async (message: string) => {
  const brokerContext = JSON.stringify(brokers.map(b => ({
      id: b.id,
      name: b.name,
      websiteUrl: b.websiteUrl,
      internalPath: `/#/broker/${b.id}`,
      score: b.score,
      minDeposit: b.accessibility.minDeposit,
      platforms: b.technology.platforms,
      maxLeverage: b.tradingConditions.maxLeverage,
      regulators: b.regulation.regulators,
      spreads: b.tradingConditions.spreads,
      commission: b.tradingConditions.commission
  })), null, 2);

  const prompt = `You are BrokerBot, an expert AI assistant for forex trading. You have access to a database of forex brokers in JSON format below. Use this data to answer user questions accurately. You can and should create links in your response using markdown format [link text](url).

- To link to a broker's detail page within this app, use the 'internalPath' value. For example: "You can see more details on [Pepperstone](/#/broker/pepperstone)".
- To link to a broker's official website, use the 'websiteUrl' value. For example: "Visit the [official Pepperstone website](https://pepperstone.com/)".
- To link to the comparison page, use '/#/compare'. For example: "You can compare them on our [comparison page](/#/compare)".

If a user asks to compare brokers, use the data to provide a comparison. If the question is about a specific broker, use the data for that broker and provide helpful links. If it's a general forex question not related to the data, answer it from your general knowledge. Be helpful, concise, and friendly. Use markdown for formatting, like bolding broker names with **.

Broker Data:
${brokerContext}

User's question: "${message}"`;

  const response = await ai.models.generateContentStream({
    model: model,
    contents: prompt,
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
    websiteUrl: string;
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
        3. When you recommend a broker, create a markdown link to their website using their name as the link text and the "websiteUrl" as the URL. For example: "The best option is [BrokerName](https://broker.website.com/) because...".
        4. Keep the tone helpful and professional. Do not output JSON.
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
    brokers: { name: string; websiteUrl: string; spread: number; commission: number; swapCategory: 'Low' | 'Standard' | 'High' }[];
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
        2. When you recommend a broker, create a markdown link to their website using their name as the link text and the "websiteUrl" as the URL. For example: "For a swing trader like you, [BrokerName](https://broker.website.com/) is the clear choice."
        3. Explain your choice clearly, referencing their style (e.g., "As a scalper, your priority is...").
        4. Briefly mention why the other brokers are less suitable for them.
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

    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [])
        .filter(Boolean) // Ensure chunks themselves are not null/undefined
        .map(chunk => chunk.web)
        .filter(Boolean)
        .filter((web, index, self) => self.findIndex(w => w.uri === web.uri) === index)
        .map(web => ({ uri: web.uri, title: web.title })) as { uri: string, title: string }[];

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

// --- NEW: AI Broker Recommendation ---
export const getAIRecommendation = async (brokers: Broker[]): Promise<AIRecommendation> => {
  if (brokers.length < 2) {
    throw new Error("Cannot get a recommendation for fewer than two brokers.");
  }
  
  const brokerData = brokers.map(b => ({
    id: b.id,
    name: b.name,
    score: b.score,
    regulators: b.regulation.regulators,
    eurusdSpread: b.tradingConditions.spreads.eurusd,
    commission: b.tradingConditions.commission,
  }));

  const prompt = `
    Act as an expert forex trading analyst. Your task is to analyze the provided list of forex brokers and recommend the top 3 best options from the list.

    Consider the following factors in your analysis, in this order of importance:
    1.  **Overall Score:** A higher score is significantly better. This is the most important factor.
    2.  **Regulation:** Brokers with multiple top-tier regulators (e.g., FCA, ASIC) are strongly preferred.
    3.  **Trading Costs:** Lower spreads and commissions are better.

    Here is the list of brokers to analyze:
    ${JSON.stringify(brokerData, null, 2)}

    Your task is to:
    1.  Select the top 3 best brokers from THIS list based on the criteria above.
    2.  Provide a concise, compelling reason (2-3 sentences) explaining your selection. Highlight what makes these brokers stand out from the others in THIS specific list.

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
          recommendedBrokerIds: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of the IDs of the top 3 recommended brokers from the provided list.",
          },
          reasoning: {
            type: Type.STRING,
            description: "A brief explanation for why these brokers were chosen as the best from the list.",
          },
        },
        required: ["recommendedBrokerIds", "reasoning"],
      },
    },
  });

  const parsedResponse: AIRecommendation = JSON.parse(response.text.trim());
  return parsedResponse;
};

// --- NEW: AI News Analysis ---
interface NewsAnalysisResponse {
    analysis: string;
    recommendedBrokerIds: string[];
}
export const getNewsAnalysis = async (article: NewsArticle, brokers: Broker[]): Promise<NewsAnalysisResponse> => {
    const brokerData = brokers.map(b => ({
        id: b.id,
        name: b.name,
        executionType: b.technology.executionType,
        negativeBalanceProtection: b.safety?.negativeBalanceProtection,
        regulators: b.regulation.regulators,
        spreads: b.tradingConditions.spreads,
        commission: b.tradingConditions.commission,
    }));

    const prompt = `
    Act as a senior market analyst for a professional trader.
    Analyze the following news article and provide actionable insights.

    News Article:
    - Title: ${article.title}
    - Summary: ${article.summary}
    - Full Content: ${article.fullContent}

    Based on this news, perform the following tasks:
    1. Write a concise analysis (2-3 sentences) explaining the key implications for forex traders. For example, does this suggest increased volatility, a change in trend, or a risk-on/risk-off environment?
    2. Based on your analysis, identify the TOP TWO most important broker characteristics needed to trade this event effectively (e.g., "fast ECN execution", "low spreads", "strong regulation", "negative balance protection").
    3. From the provided list of brokers, select the TWO brokers that best exemplify these characteristics.

    Respond ONLY in the specified JSON format.

    Broker Data:
    ${JSON.stringify(brokerData, null, 2)}
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    analysis: {
                        type: Type.STRING,
                        description: "A concise analysis of the news article's impact on traders and the most important broker characteristics required.",
                    },
                    recommendedBrokerIds: {
                        type: Type.ARRAY,
                        description: "An array of exactly two broker IDs that are best suited for the market conditions described in the news.",
                        items: { type: Type.STRING },
                    },
                },
                required: ["analysis", "recommendedBrokerIds"],
            }
        }
    });

    return JSON.parse(response.text.trim());
};