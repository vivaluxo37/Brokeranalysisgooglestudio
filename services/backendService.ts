// THIS FILE SIMULATES A SECURE BACKEND SERVER.
// IN A REAL-WORLD APPLICATION, THIS LOGIC WOULD LIVE ON A SERVER-SIDE
// ENDPOINT, AND THE API KEY WOULD BE A SERVER ENVIRONMENT VARIABLE.

import { GoogleGenAI, Type } from "@google/genai";
import { Broker, Review, AIRecommendation, NewsArticle, Signal, BrokerMatcherPreferences } from '../types';
import { brokers } from '../data/brokers';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

// --- Chatbot Functionality ---

export const handleChatbotStream = async (message: string) => {
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
      commission: b.tradingConditions.commission,
      executionType: b.technology.executionType,
  })), null, 2);

  const prompt = `You are BrokerBot, an expert AI assistant for forex trading. You have access to a database of forex brokers in JSON format below. Use this data to answer user questions accurately. You can and should create links in your response using markdown format [link text](url).

- To link to a broker's detail page within this app, use the 'internalPath' value. For example: "You can see more details on [Pepperstone](/#/broker/pepperstone)".
- To link to a broker's official website, use the 'websiteUrl' value. For example: "Visit the [official Pepperstone website](https://pepperstone.com/)".
- To link to the comparison page, use '/#/compare'. For example: "You can compare them on our [comparison page](/#/compare)".

**Answering "Best Broker" Questions:**
When asked for the "best" broker for a specific category (e.g., "best ECN brokers", "best for beginners"), identify the top 2-3 brokers from the data that match the criteria. Explain your reasoning briefly. For example, for "beginners", look for low minimum deposits, high overall scores, and user-friendly platforms. For "ECN", look for brokers with \`executionType\` of 'ECN' and low costs.

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

interface BrokerRecommendationResponse {
  reasoning: string;
  recommendedBrokerIds: string[];
}

export const handleBrokerRecommendations = async (
  preferences: BrokerMatcherPreferences,
  brokers: Broker[]
): Promise<BrokerRecommendationResponse> => {
    const brokerData = brokers.map(b => ({
        id: b.id,
        name: b.name,
        score: b.score,
        regulatedBy: b.security.regulatedBy.map(r => r.regulator),
        headquarters: b.headquarters,
        minDeposit: b.accessibility.minDeposit,
        executionType: b.technology.executionType,
        commissionStructure: b.fees.trading.commissionStructure,
        eurusdSpread: b.tradingConditions.spreads.eurusd,
        swapFeeCategory: b.tradingConditions.swapFeeCategory,
        depositMethods: b.depositWithdrawal.depositMethods,
        hasIslamicAccount: b.accountManagement.islamicAccount.available,
        hasCopyTrading: !!b.copyTrading,
        hasApiAccess: !!b.technology.apiAccess,
    }));

    // FIX: Removed invalid template literal substitutions (`${...}`) from the prompt string.
    // These were causing compilation errors as the variables were not in scope.
    // The prompt is intended as instructions for the AI, so plain text is correct.
    const prompt = `
    You are an expert forex broker analyst. Your task is to recommend the top 3 brokers from a provided list that best match the user's detailed preferences.

    **User Preferences:**
    - Country of Residence: ${preferences.country}
    - Trading Experience: ${preferences.experience}
    - Preferred Fee Structure: ${preferences.feeStructure}
    - Preferred Deposit Method: ${preferences.depositMethod}
    - Preferred Currency Pairs: ${preferences.currencyPairs}
    - Special Preferences: ${preferences.specialPreferences.join(', ')}

    **Available Brokers (JSON format):**
    ${JSON.stringify(brokerData, null, 2)}

    **Your Analysis Process:**
    1.  **Filter by Country:** First, check if a broker is likely available in the user's country. A broker is considered available if their \`regulatedBy\` array contains a major regulator for that region (e.g., 'FCA' for UK, 'ASIC' for Australia) OR if their \`headquarters\` is in that country. For "offshore" brokers, assume they are generally available unless specified otherwise. THIS IS A SOFT FILTER.
    2.  **Filter by Special Preferences:** Heavily prioritize brokers that match the user's specific requests (e.g., if they ask for 'ECN account', strongly favor brokers with \`executionType: 'ECN'\`).
    3.  **Analyze Other Preferences:**
        - For 'Low spreads', prioritize brokers with low \`eurusdSpread\` and 'ECN' \`executionType\`.
        - For 'Low overnight fee', prioritize brokers with \`swapFeeCategory: 'Low'\`.
        - For 'Beginner' experience, favor brokers with high \`score\` and low \`minDeposit\`.
        - For 'Expert' experience, favor brokers with 'ECN' \`executionType\`, 'API access', and lower costs.
    4.  **Final Selection:** From the filtered and prioritized list, select the top 3 brokers. The overall \`score\` should be the final tie-breaker.

    **Your Output:**
    Provide a brief reasoning (3-4 sentences) explaining your choices. Start by acknowledging their top priority and explain how your picks meet it. Then, provide a list of the top 3 broker IDs.

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

export const handleCostAnalysis = async (instrument: string, costData: CostData[]): Promise<string> => {
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

// --- Personalized Cost Projection ---
export type TradingStyle = 'Scalper' | 'Day Trader' | 'Swing Trader';

interface PersonalizedCostRequest {
    style: TradingStyle;
    instrument: string;
    brokers: { name: string; websiteUrl: string; spread: number; commission: number; swapCategory: 'Low' | 'Standard' | 'High' }[];
}

export const handlePersonalizedCostProjection = async (request: PersonalizedCostRequest): Promise<string> => {
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

// --- AI Review Summarizer ---
export interface ReviewSummary {
    summary: string;
    pros: string[];
    cons: string[];
}
export const handleReviewSummary = async (brokerName: string, reviews: Review[]): Promise<ReviewSummary> => {
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

// --- Regulatory Trust Score ---
export interface TrustScore {
    score: number;
    reasoning: string;
    sources: { uri: string, title: string }[];
}
export const handleRegulatoryTrustScore = async (brokerName: string, regulators: string[]): Promise<TrustScore> => {
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

// --- Scam Broker Shield Analysis ---
export const handleRiskAnalysis = async (brokerName: string, signals: Signal[]): Promise<string> => {
    const prompt = `
        You are a succinct financial risk analyst. Based on the following risk signals for the forex broker "${brokerName}", write a 2-3 sentence summary for a retail trader.
        Explain the practical implications of these risks in simple terms. Do not use jargon. Focus on what the user should be cautious about.

        Signals:
        ${JSON.stringify(signals, null, 2)}
    `;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
}


// --- AI Comparison Summary ---
export const handleComparisonSummary = async (brokers: Broker[]): Promise<string> => {
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

// --- AI Duel Verdict ---
export const handleDuelVerdict = async (broker1: Broker, broker2: Broker): Promise<string> => {
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

// --- AI Broker Recommendation ---
export const handleAIRecommendation = async (brokers: Broker[]): Promise<AIRecommendation> => {
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

// --- AI News Analysis ---
interface NewsAnalysisResponse {
    analysis: string;
    recommendedBrokerIds: string[];
}
export const handleNewsAnalysis = async (article: NewsArticle, brokers: Broker[]): Promise<NewsAnalysisResponse> => {
    const brokerData = brokers.map(b => ({
        id: b.id,
        name: b.name,
        executionType: b.technology.executionType,
        negativeBalanceProtection: b.tradingConditionsExtended.negativeBalanceProtection,
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