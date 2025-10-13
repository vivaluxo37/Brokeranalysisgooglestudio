

// SECURE BACKEND SERVICE CLIENT
// This service calls the secure proxy server to handle AI requests
// The proxy server manages API keys and rate limiting

import { Broker, Review, AIRecommendation, NewsArticle, Signal, TradingJournalEntry, MarketMood, BrokerAlternativesResponse } from '../types';
import { brokers } from '../data/brokers';

// Proxy server configuration
const PROXY_BASE_URL = import.meta.env.VITE_API_PROXY_URL || 'http://localhost:3001';

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

  try {
    const response = await fetch(`${PROXY_BASE_URL}/api/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        brokerContext: brokerContext
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Create a mock stream from the response
    const text = data.response;
    const stream = new ReadableStream({
      async start(controller) {
        // Split the response into chunks for streaming effect
        const words = text.split(' ');
        let currentText = '';
        
        for (const word of words) {
          currentText += (word + ' ');
          controller.enqueue({ text: () => word + ' ' });
          // Small delay to simulate streaming
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        controller.close();
      }
    });
    
    return stream;
    
  } catch (error) {
    console.error('Proxy server error:', error);
    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }
};


// --- AI Tutor Functionality ---
export const handleAiTutorStream = async (message: string, history: { sender: 'user' | 'ai'; text: string }[]) => {
    try {
        const response = await fetch(`${PROXY_BASE_URL}/api/tutor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: message,
                difficulty: 'beginner',
                userLevel: 'beginner',
                history: history
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Create a mock stream from the response
        const text = data.content;
        const stream = new ReadableStream({
            async start(controller) {
                // Split the response into chunks for streaming effect
                const words = text.split(' ');
                
                for (const word of words) {
                    controller.enqueue({ text: () => word + ' ' });
                    // Small delay to simulate streaming
                    await new Promise(resolve => setTimeout(resolve, 30));
                }
                
                controller.close();
            }
        });
        
        return stream;
        
    } catch (error) {
        console.error('Proxy server error:', error);
        throw new Error('AI service is temporarily unavailable. Please try again later.');
    }
};


// --- Broker Matcher Functionality ---

interface BrokerRecommendationResponse {
  reasoning: string;
  recommendedBrokerIds: string[];
}

export const handleStrategyBrokerRecommendations = async (
  strategyDescription: string,
  brokers: Broker[]
): Promise<BrokerRecommendationResponse> => {
    const brokerData = brokers.map(b => ({
        id: b.id,
        name: b.name,
        score: b.score,
        executionType: b.technology?.executionType || 'STP',
        commissionStructure: b.fees?.trading?.commissionStructure || 'No commission',
        eurusdSpread: b.tradingConditions?.spreads?.eurusd || '1.0',
        swapFeeCategory: b.tradingConditions?.swapFeeCategory || 'Standard',
        platforms: b.technology?.platforms || [],
        hasCopyTrading: !!b.copyTrading,
        hasApiAccess: !!b.technology?.apiAccess,
        scalpingAllowed: b.tradingConditionsExtended?.scalpingAllowed || false
    }));

    const prompt = `
    You are an expert forex broker analyst. Your task is to recommend the top 3 brokers from a provided list that best match the user's trading strategy, described in plain English.

    **User's Strategy Description:**
    "${strategyDescription}"

    **Available Brokers (JSON format):**
    ${JSON.stringify(brokerData, null, 2)}

    **Your Analysis Process:**
    1.  **Parse the Strategy:** Read the user's description and identify the key requirements. Look for keywords like:
        -   **Style:** "scalp", "day trade", "swing trade", "long-term".
        -   **Costs:** "low spread", "cheap", "low cost", "no commission".
        -   **Execution:** "ECN", "fast", "no requotes".
        -   **Platform:** "MT4", "MT5", "TradingView", "cTrader".
        -   **Tools:** "algo", "EA", "API", "copy trading", "social".
    2.  **Match Requirements to Broker Data:**
        -   If "scalp" or "fast execution" is mentioned, prioritize brokers with \`executionType: 'ECN'\`, \`scalpingAllowed: true\`, and low \`eurusdSpread\`.
        -   If "low cost" is mentioned, prioritize brokers with low \`eurusdSpread\` and a commission-based structure (these are often cheaper overall).
        -   If a specific platform is mentioned, filter for brokers who offer it in their \`platforms\` array.
        -   If "swing" or "long-term" is mentioned, give weight to brokers with \`swapFeeCategory: 'Low'\`.
        -   If "algo" or "EA" is mentioned, prioritize brokers with \`hasApiAccess: true\` and MT4/MT5 platforms.
    3.  **Final Selection:** From the brokers that best match the criteria, select the top 3. Use the overall \`score\` as the final tie-breaker if multiple brokers are a good fit.

    **Your Output:**
    Provide a brief reasoning (3-4 sentences) explaining your choices. Start by summarizing your understanding of their strategy and explain how your picks meet the key requirements you identified. Then, provide a list of the top 3 broker IDs.

    Respond ONLY in the specified JSON format:
    {
      "reasoning": "explanation here",
      "recommendedBrokerIds": ["broker1", "broker2", "broker3"]
    }
  `;

  try {
    const response = await aiProviderManager.generateResponse(prompt, {
      stream: false,
      systemInstruction: "You are an expert forex broker analyst. Always respond with valid JSON only."
    });
    
    console.log(`Using ${response.provider} (${response.model}) for strategy recommendations`);
    
    // Parse the JSON response
    const responseText = typeof response.result === 'string' ? response.result : await response.result.text();
    const parsedResponse: BrokerRecommendationResponse = JSON.parse(responseText.trim());
    return parsedResponse;
    
  } catch (error) {
    console.error('AI Provider Manager failed, falling back to direct Gemini call:', error);
    
    // Fallback to original Gemini implementation
    try {
      const generativeModel = genAI.getGenerativeModel({ model: model });
      const response = await generativeModel.generateContent(prompt);
      
      // Parse the JSON response (since we instructed it to respond with JSON)
      const responseText = response.response.text();
      const parsedResponse: BrokerRecommendationResponse = JSON.parse(responseText.trim());
      return parsedResponse;
    } catch (geminiError) {
      console.error('All AI providers failed:', geminiError);
      throw new Error('AI service is temporarily unavailable. Please try again later.');
    }
  }
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

    try {
        const response = await aiProviderManager.generateResponse(prompt, {
            stream: false,
            systemInstruction: "You are an expert forex market analyst providing cost analysis."
        });
        
        console.log(`Using ${response.provider} (${response.model}) for cost analysis`);
        return typeof response.result === 'string' ? response.result : await response.result.text();
        
    } catch (error) {
        console.error('AI Provider Manager failed, falling back to direct Gemini call:', error);
        
        // Fallback to original Gemini implementation
        try {
            const response = await genAI.models.generateContent({
                model: model,
                contents: prompt,
            });
            return response.text;
        } catch (geminiError) {
            console.error('All AI providers failed:', geminiError);
            throw new Error('AI service is temporarily unavailable. Please try again later.');
        }
    }
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

// --- AI Trading Journal Analysis ---
export const handleTradingJournalAnalysis = async (entries: TradingJournalEntry[]): Promise<string> => {
    const prompt = `
    You are a professional trading coach named "AI Coach". Your task is to analyze a trader's journal and provide actionable, constructive feedback. The goal is to help them improve, not to criticize.

    Here is the trader's journal data (last 50 entries):
    ${JSON.stringify(entries.slice(0, 50), null, 2)}

    Analyze the data to identify patterns, strengths, and weaknesses. Your analysis should be structured in markdown format and include:
    1.  **Overall Performance Snapshot:** A brief summary including total P/L, win rate, and total number of trades.
    2.  **Key Strengths:** Identify positive patterns. For example: "You show great discipline in your EUR/USD trades, which have a 75% win rate," or "Your notes indicate you follow your 'Trendline Bounce' strategy consistently, which is a major strength."
    3.  **Areas for Improvement:** Identify negative patterns in a constructive way. For example: "I noticed your biggest losses often occur on GBP/USD. It might be helpful to review your strategy for this pair or reduce your position size," or "Your notes sometimes mention 'FOMO'. This is common, and focusing on your pre-trade checklist can help mitigate impulsive entries."
    4.  **Actionable Suggestion:** Provide one clear, actionable tip for the trader to focus on next. For example: "For the next week, try to write one sentence in your notes before each trade explaining how it fits your trading plan. This can enhance mindfulness and reduce impulsive trades."
    5.  **An Encouraging Closing:** End with a positive and motivational sentence.

    Keep the tone professional, encouraging, and helpful. Use markdown formatting like bolding and lists to make the report easy to read. Do not output JSON.
    `;

    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
};


// --- AI Market Mood ---
export const handleMarketMood = async (articles: NewsArticle[]): Promise<MarketMood> => {
    const prompt = `
    You are a financial market sentiment analyst. Analyze the headlines and summaries of the following recent news articles.
    Based *only* on this information, determine the overall market sentiment.

    News Articles:
    ${JSON.stringify(articles.map(a => ({ title: a.title, summary: a.summary, importance: a.importance })), null, 2)}

    Your task is to:
    1.  Determine the overall sentiment. Is it "Risk-On" (investors are optimistic, buying riskier assets like stocks and AUD), "Risk-Off" (investors are fearful, buying safer assets like USD, JPY, Gold), or "Neutral"?
    2.  Provide a sentiment score from 1 (Extreme Risk-Off) to 10 (Extreme Risk-On).
    3.  Categorize the score into one of these levels: 'Extreme Risk-Off' (1-2), 'Risk-Off' (3-4), 'Neutral' (5-6), 'Risk-On' (7-8), 'Extreme Risk-On' (9-10).
    4.  Write a one-sentence summary explaining the current mood, referencing the key news driver (e.g., "Sentiment is risk-off due to unexpected inflation data increasing fears of aggressive rate hikes.").

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
                    score: { type: Type.INTEGER },
                    level: { type: Type.STRING },
                    summary: { type: Type.STRING },
                },
                required: ["score", "level", "summary"],
            }
        }
    });
    return JSON.parse(response.text.trim());
};

// --- AI Broker Alternatives ---
export const handleBrokerAlternatives = async (targetBroker: Broker, allBrokers: Broker[]): Promise<BrokerAlternativesResponse> => {
    const otherBrokers = allBrokers
        .filter(b => b.id !== targetBroker.id)
        .map(b => ({
            id: b.id,
            name: b.name,
            score: b.score,
            summary: b.summary,
            pros: b.pros,
            executionType: b.technology.executionType,
            minDeposit: b.accessibility.minDeposit,
            platforms: b.technology.platforms,
        }));

    const targetBrokerData = {
        id: targetBroker.id,
        name: targetBroker.name,
        score: targetBroker.score,
        summary: targetBroker.summary,
        pros: targetBroker.pros,
        executionType: targetBroker.technology.executionType,
        minDeposit: targetBroker.accessibility.minDeposit,
        platforms: targetBroker.technology.platforms,
    };

    const prompt = `
    You are a forex broker analyst. Your task is to find good alternatives to a given broker.

    The user is currently looking at this broker:
    **Target Broker:** ${JSON.stringify(targetBrokerData, null, 2)}

    **Your Task:**
    1.  Identify the 2-3 key strengths of the Target Broker from its data (e.g., "low ECN costs", "great for beginners", "excellent platform variety", "strong regulation").
    2.  From the list of "Other Brokers" provided below, select the top 2-3 brokers that are the most similar to the Target Broker based on its key strengths.
    3.  For each recommended broker, provide a concise, one-sentence reasoning explaining *why* it is a good alternative.

    **List of Other Brokers:**
    ${JSON.stringify(otherBrokers, null, 2)}

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
                    recommendations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                brokerId: { type: Type.STRING },
                                reasoning: { type: Type.STRING }
                            },
                            required: ["brokerId", "reasoning"]
                        }
                    }
                },
                required: ["recommendations"]
            }
        }
    });
    
    return JSON.parse(response.text.trim());
};
