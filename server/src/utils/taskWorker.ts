import { Scraper } from "agent-twitter-client";
import {
  fetchTwitterTimeline,
  loginToTwitter,
  fetchTweetsForTickers,
  fetchTweetsForAddresses,
  postToTwitter,
} from "../services/twitter";
import Agent from "../models/agent";
import {
  decryptData,
  encryptData,
  generateRandomInterval,
  extractTickersFromTweets,
  getTokenAddressMapping,
  extractMintAddresses,
  combineTokenData,
} from "./helper";
import { generateTokenAnalysisAndThread } from "../services/llm";
import { fetchAllMetrics } from "../services/onChainMetrics";
import AgentMemory from "../models/agentMemory";
import { type TokenAnalysisData } from "./types";

const taskWorker = async (tasks: Map<number, string>) => {
  const sleepDuration = 10; // in minutes

  while (true) {
    const currentTime = Date.now();
    // get the task with the smallest key value
    const nextExeTime = Math.min(...Array.from(tasks.keys()));

    if (nextExeTime > currentTime) {
      console.log(`Sleeping for ${sleepDuration} minutes`);
      await new Promise((resolve) =>
        setTimeout(resolve, sleepDuration * 60 * 1000)
      );
      continue;
    }

    const agentId = tasks.get(nextExeTime);
    if (!agentId) {
      console.log(`No agent found for task : ${nextExeTime}`);
      continue;
    }

    await executeTask(nextExeTime, agentId, tasks);
  }
};

const executeTask = async (
  key: number,
  agentId: string,
  tasks: Map<number, string>
) => {
  try {
    console.log(`Executing task for agent: ${agentId}`);

    const agent = await Agent.findById(agentId);
    if (!agent) {
      console.log(`No agent found for id: ${agentId}`);
      tasks.delete(key);
      return;
    }
    if (!agent.isInitialized) {
      console.log(`Agent not initialized: ${agentId}`);
      tasks.delete(key);
      return;
    }
    const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

    const {
      twitterUsername,
      encryptedTwitterPassword,
      ivTwitterPassword,
      encryptedTwitterCookieStrings,
      ivTwitterCookieStrings,
      name,
      description,
      personality,
    } = agent;

    const twitterPassword = decryptData(
      encryptedTwitterPassword,
      encryptionKey,
      ivTwitterPassword
    );

    const cookieStrings = encryptedTwitterCookieStrings.map(
      (encryptedCookie: string, index: number) => {
        return decryptData(
          encryptedCookie,
          encryptionKey,
          ivTwitterCookieStrings[index]
        );
      }
    );

    const scraper = new Scraper();
    const newCookieStrings = await loginToTwitter(
      scraper,
      twitterUsername,
      twitterPassword,
      cookieStrings
    );

    const newEncryptedTwitterCookieStrings: string[] = [];
    const newIvTwitterCookieStrings: string[] = [];

    for (const cookieString of newCookieStrings) {
      const encryptedCookie = encryptData(cookieString, encryptionKey);
      newEncryptedTwitterCookieStrings.push(encryptedCookie.encryptedData);
      newIvTwitterCookieStrings.push(encryptedCookie.iv);
    }

    await Agent.findByIdAndUpdate(agentId, {
      $set: {
        encryptedTwitterCookieStrings: newEncryptedTwitterCookieStrings,
        ivTwitterCookieStrings: newIvTwitterCookieStrings,
      },
    });

    const timeline = await fetchTwitterTimeline(scraper, agentId);
    console.log("Twitter timeline fetched", timeline);
    if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
      console.log("No new tweets found in timeline, stopping agent");
      return;
    }

    const tickers = extractTickersFromTweets(timeline);
    console.log("Tickers fetched", tickers);
    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      console.log("No tickers found in tweets, stopping agent");
      return;
    }

    const tickerAddressMapping = await getTokenAddressMapping(tickers);
    console.log("Ticker address mapping", tickerAddressMapping);

    const addressTweetsMapping = await fetchTweetsForTickers(
      scraper,
      tickerAddressMapping
    );
    console.log("Tweets fetched for tickers");

    const addresses = Object.values(tickerAddressMapping);
    console.log("Addresses fetched", addresses);

    const addressMetricsMapping = await fetchAllMetrics(addresses);
    console.log("Token metrics fetched");

    // Combine data
    const tokenAnalysis: Record<string, TokenAnalysisData> = {};

    for (const address of addresses) {
      const metrics = addressMetricsMapping[address];
      const tweets = addressTweetsMapping[address] || [];

      if (metrics && tweets.length > 0) {
        tokenAnalysis[address] = combineTokenData(address, metrics, tweets);
      }
    }

    if (Object.keys(tokenAnalysis).length === 0) {
      console.log(
        "No addresses found with both tweets and metrics data, stopping agent"
      );
      return;
    }

    console.log("Token Analysis", tokenAnalysis);

    const recentTweets = await AgentMemory.find({ agentId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("generatedTweet")
      .then((memories) => memories.map((memory) => memory.generatedTweet));
    console.log("Recent tweets fetched");

    const tokenDecisions = await generateTokenAnalysisAndThread(
      name,
      twitterUsername,
      description,
      personality,
      recentTweets,
      tokenAnalysis
    );

    console.log("Token decision:", tokenDecisions);

    const { decisions, generatedThread } = tokenDecisions;

    try {
      await AgentMemory.create({
        agentId,
        tokenMint: decisions.topPick.address,
        ticker: decisions.topPick.symbol,
        tweets: tokenAnalysis[decisions.topPick.address]?.tweets || [],
        chainMetrics: tokenAnalysis[decisions.topPick.address]?.metrics,
        generatedTweet: generatedThread[0] || "",
      });

      await Promise.all(
        decisions.otherTokens.map((decision, index) =>
          AgentMemory.create({
            agentId,
            tokenMint: decision.address,
            ticker: decision.symbol,
            tweets: tokenAnalysis[decision.address]?.tweets || [],
            chainMetrics: tokenAnalysis[decision.address]?.metrics,
            generatedTweet: generatedThread[index + 1] || "",
          })
        )
      );
    } catch (error) {
      console.error("Failed to store token analysis:", error);
      throw error;
    }

    // await postToTwitter(scraper, tokenDecision.generatedTweet);
    const lastExecutionTime = Date.now();
    await Agent.findByIdAndUpdate(agentId, {
      $set: {
        lastExecutionTime,
      },
    });

    const randomInterval = generateRandomInterval();
    tasks.set(lastExecutionTime + randomInterval, agentId);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    console.log("Error running agent:", errorMessage);
    tasks.delete(key);
  }
  process.exit(0);
};

export default taskWorker;

// const addressTweetsMapping = await fetchTweetsForAddresses(
//   scraper,
//   addresses
// );
// console.log("Tweets fetched for addresses");

// const tickerTweetsMapping = await fetchTweetsForTickers(scraper, tickers);
// console.log("Tweets fetched for tickers");
// if (!tickerTweetsMapping || Object.keys(tickerTweetsMapping).length === 0) {
//   console.log("No tweets found for tickers, stopping agent");
//   return;
// }

// const tickerAddressMapping = extractMintAddresses(tickerTweetsMapping);
// console.log("Ticker and address mapping done", tickerAddressMapping);
// if (
//   !tickerAddressMapping ||
//   Object.keys(tickerAddressMapping).length === 0
// ) {
//   console.log("No mint addresses found for tickers, stopping agent");
//   return;
// }
