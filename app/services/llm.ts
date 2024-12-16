import OpenAI from "openai";
import { TweetData } from "./twitter";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY! });

export const analyzeTweetsForDecision = async (
  tweets: TweetData[],
  agentName: string,
  twitterUserName: string,
  bio: string,
  lore: string,
  recentPosts: string[]
) => {
  // Prepare tweet content with metrics for analysis
  const tweetsContent = tweets
    .map(
      (tweet) =>
        `Text: "${tweet.text}"\nLikes: ${tweet.likes}, Retweets: ${tweet.retweets}, Replies: ${tweet.replies}, Views: ${tweet.views}, Posted by: @${tweet.username}, Posted at: ${tweet.timeParsed}`
    )
    .join("\n\n");

  // LLM Request to extract tokens and make decisions
  const llmResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a professional memecoin trader and technical analyst. 
Analyze the following tweets related to memecoin buy/sell calls. Identify each token mentioned in the tweets, and provide a recommendation in the format:

[
  {
    "token": "TOKEN_NAME",
    "decision": "BUY" or "SELL" or "NONE",
    "reason": "A concise, tweetable reason explaining your analysis and recommendation.",
    "tweetsReferenced": ["List of tweet texts related to this token"]
  }
]

Base your recommendation on the tweets' sentiment, engagement metrics (likes, retweets, replies, views), and market trends. Be objective.`,
      },
      {
        role: "user",
        content: `Tweets:\n${tweetsContent}`,
      },
    ],
  });

  const response = JSON.parse(llmResponse.choices[0].message.content!);

  // Generate tweets for each token decision
  const tokenDecisions = await Promise.all(
    response.map(async (decision: any) => {
      const newTweetPrompt = `
{{timeline}}

{{providers}}

About ${agentName} (@${twitterUserName}):
${bio}
${lore}

${recentPosts}

# Task: Generate a post in the voice and style of ${agentName}, aka @${twitterUserName}.
Write a single-sentence tweet about trending meme tokens, share your thoughts based on the provided reasoning:

Reason: "${decision.reason}"

Follow the style guidelines:
- Act like a professional trading advisor.
- Be bold about your opinion, negative or positive.
- Use different starting words and avoid repetitive phrasing.
- Avoid questions or emojis.
- Brief and concise statements only.
- Occasionally make a bold claim about someone in the timeline (not often).

Your response must not acknowledge this request. Output only the tweet.
      `;

      const tweetResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are ${agentName}, a professional memecoin trader and technical analyst.`,
          },
          {
            role: "user",
            content: newTweetPrompt,
          },
        ],
      });

      const generatedTweet = tweetResponse.choices[0].message.content!.trim();

      return {
        token: decision.token,
        decision: decision.decision,
        reason: decision.reason,
        tweetsReferenced: decision.tweetsReferenced,
        generatedTweet,
      };
    })
  );

  return tokenDecisions;
};
