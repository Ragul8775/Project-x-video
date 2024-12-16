import OpenAI from "openai";
import {
  type TweetData,
  type OptimizedTokenMetrics,
  type OptimizedDexScreenerPair,
  type OptimizedDexScreenerData,
  type OptimizedTokenTradeData,
  type TokenAnalysisData,
  type TopPick,
  type OtherToken,
  type TokenAnalysisResult,
} from "../utils/types";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY! });

async function generateTokenDecisions(
  tokenAnalysis: Record<string, TokenAnalysisData>
): Promise<TokenAnalysisResult> {
  const analysisPrompt = buildAnalysisPrompt(tokenAnalysis);

  const llmResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a crypto market analyst examining social sentiment and on-chain metrics.",
      },
      {
        role: "user",
        content: analysisPrompt,
      },
    ],
    temperature: 0.7,
  });

  if (!llmResponse.choices[0].message.content) {
    throw new Error("LLM returned empty response");
  }

  const sanitizeResponse = (response: string): string => {
    return response
      .replace(/```json\s*/g, "") // Remove JSON code block markers
      .replace(/```\s*/g, "") // Remove other code block markers
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
      .replace(/[^\x20-\x7E]/g, "") // Keep only printable ASCII
      .trim();
  };

  try {
    const rawResponse = llmResponse.choices[0].message.content;
    const cleanResponse = sanitizeResponse(rawResponse);
    const parsedResponse = JSON.parse(cleanResponse);

    if (!parsedResponse.topPick || !Array.isArray(parsedResponse.otherTokens)) {
      throw new Error("Invalid response structure");
    }

    const decisions: TokenAnalysisResult = {
      topPick: parsedResponse.topPick as TopPick,
      otherTokens: parsedResponse.otherTokens as OtherToken[],
    };

    return decisions;
  } catch (error: any) {
    throw new Error(
      `Failed to parse LLM response: ${error.message}\nRaw response: ${llmResponse.choices[0].message.content}`
    );
  }
}

async function generateThreadFromDecisions(
  agentName: string,
  twitterUsername: string,
  description: string,
  personality: string,
  recentPosts: string[],
  decisions: TokenAnalysisResult
): Promise<string[]> {
  const threadPrompt = buildTweetThread(
    agentName,
    twitterUsername,
    description,
    personality,
    recentPosts,
    decisions
  );

  const threadResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are ${agentName}, a professional memecoin trader and technical analyst.`,
      },
      {
        role: "user",
        content: threadPrompt,
      },
    ],
  });

  if (!threadResponse.choices[0].message.content) {
    throw new Error("LLM returned empty thread response");
  }

  return threadResponse.choices[0].message.content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, 5);
}

export const generateTokenAnalysisAndThread = async (
  agentName: string,
  twitterUsername: string,
  description: string,
  personality: string,
  recentPosts: string[],
  tokenAnalysis: Record<string, TokenAnalysisData>
): Promise<{
  decisions: TokenAnalysisResult;
  generatedThread: string[];
}> => {
  // First get decisions
  const decisions = await generateTokenDecisions(tokenAnalysis);

  // Then generate tweets based on those decisions
  const generatedThread = await generateThreadFromDecisions(
    agentName,
    twitterUsername,
    description,
    personality,
    recentPosts,
    decisions
  );

  return {
    decisions,
    generatedThread,
  };
};

function buildAnalysisPrompt(tokenAnalysis: Record<string, TokenAnalysisData>) {
  return `Analyze and compare tokens based on weighted social metrics and on-chain data to identify the strongest performer.

Required metrics comparison:

Social Engagement (Aggregate across all tweets):
- Total Likes 
- Total Retweets
- Total Replies
- Total Bookmarks
- Total Views
- Tweet velocity (tweets per hour)
- Average engagement per tweet
- Sentiment analysis of tweet text (technical & emotional language)

Critical On-Chain Metrics:
Price & Volume:
- 24h price change %
- 24h volume
- Current liquidity
- Buy/sell ratio (from txns24h)
- Total trades in 24h
- Market cap & fully diluted valuation

Wallet Activity:
- Unique wallets 1h & 24h
- Wallet growth % (1h)
- Recent trade activity

Token Distribution:
- Owner & creator balance %
- Top 10 holder concentration %
- Holder distribution trend
- High supply holders count

Strictly output only the JSON format response, no other textual output or explanations:
{
  "topPick": {
    "address": "contract_address",
    "symbol": "token_symbol",
    "keySocialMetrics": {
      "totalLikes": number,
      "totalRetweets": number,
      "totalReplies": number,
      "sentimentAnalysis": "Brief explanation on the overall sentiment of the tweets, technical and emotional"
    },
    "keyChainMetrics": {
      "priceChange24h": number,
      "volumeUsd24h": number,
      "currentLiquidity": number,
      "marketCap": number,
      "buyToSellRatio": number,
      "uniqueWallets24h": number,
      "holderConcentration": number
    },
    "summary": "Brief summary on the token and what its represents",
    "reason": "Concise explanation of selection based on metrics"
  },
  "otherTokens": [
    {
      "address": "contract_address",
      "symbol": "token_symbol",
      "keySocialMetrics": {
      "totalLikes": number,
      "totalRetweets": number,
      "totalReplies": number,
      "sentimentAnalysis": string
      },
      "keyChainMetrics": {
        "priceChange24h": number,
        "volumeUsd24h": number,
        "currentLiquidity": number,
        "marketCap": number,
        "buyToSellRatio": number,
        "uniqueWallets24h": number,
        "holderConcentration": number
      },
      "summary": "Brief summary on the token and what its represents",
      "rejectionReason": "Specific metric-based reason for not selecting"
    }
  ]
}

Analyze this data:
${JSON.stringify(tokenAnalysis, null, 2)}`;
}

function buildTweetThread(
  agentName: string,
  twitterUsername: string,
  description: string,
  personality: string,
  recentPosts: string[],
  decisions: TokenAnalysisResult
): string {
  return `Generate a metrics-focused tweet thread analyzing token performance.

AGENT PROFILE:
Name: ${agentName}
Handle: @${twitterUsername}
Description: ${description}
Personality: ${personality}

REFERENCE STYLE (Do not copy, only for tone):
${recentPosts.join("\n")}

TWEET CONSTRAINTS:
- Maximum 5 tweets in thread
- One tweet per token
- 280 characters per tweet
- NO emojis
- NO financial advice or buy/sell recommendations
- ONLY use metrics provided in the data
- First tweet MUST be about the top pick
- Following tweets about other analyzed tokens 
- If no other tokens were analyzed then don't generate a tweet for it.

REQUIRED METRICS TO INCLUDE:
For Top Pick Tweet:
- Symbol
- 24h price change %
- 24h volume
- Buy/sell ratio
- Unique wallets (24h)
- Engagement metrics

For Other Tokens:
- Symbol
- Key metrics from rejection reason
- Major red flags if any

DATA FORMAT:
Use these exact formats for metrics:
- Percentages: "+/-XX.XX%"
- Volume: "$XXM"
- Ratios: "X.XX:1"
- Scores: "XX.X/100"

LANGUAGE RULES:
- Use analytical, data-driven tone
- Focus on metric comparisons
- No speculative statements
- No direct trading advice
- Avoid subjective language
- State facts, not opinions

INPUT DATA:
${JSON.stringify(decisions, null, 2)}

Generate the thread maintaining these requirements strictly.`;
}
