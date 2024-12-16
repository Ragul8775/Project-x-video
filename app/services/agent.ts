import { fetchTwitterTimeline, postToTwitter } from "./twitter";
import { analyzeTweetsForDecision } from "./llm";

export const runAgent = async (
  agentId: string,
  twitterUsername: string,
  twitterPassword: string
) => {
  try {
    const timeline = await fetchTwitterTimeline(
      twitterUsername,
      twitterPassword,
      agentId
    );

    // TODO: Implement logic to fetch bot data from db using the agentId
    const agentName = "Agent";
    const bio = "Agent bio";
    const lore = "Agent lore";
    const recentTweets = [];

    const tokenDecisions = await analyzeTweetsForDecision(
      timeline,
      agentName,
      twitterUsername,
      bio,
      lore,
      recentTweets
    );

    // TODO: Implement logic to store token decisions in the db

    await Promise.all(
      tokenDecisions.map((tweet) =>
        postToTwitter(twitterUsername, twitterPassword, tweet)
      )
    );
  } catch (error) {
    console.error("Error running agent:", error);
    throw error;
  }
};
