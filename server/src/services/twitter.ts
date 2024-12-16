import { Scraper, SearchMode, type Tweet } from "agent-twitter-client";
import SeenTweets from "../models/seenTweets";
import { type TweetData } from "../utils/types";

export const loginToTwitter = async (
  scraper: Scraper,
  username: string,
  password: string,
  cookieStrings?: string[]
) => {
  await scraper.clearCookies();

  if (cookieStrings) {
    console.log("[LOGGING IN] - FROM COOKIES");

    await scraper.setCookies(cookieStrings);

    const loggedIn = await scraper.isLoggedIn();
    if (loggedIn) {
      console.log("[LOGGED IN] - SUCCESSFULLY");
      return cookieStrings;
    }
  }

  console.log("[COOKIES NOT FOUND/EXPIRED] - LOGGING IN AGAIN");
  await scraper.login(username, password);
  // Save new cookies
  const newCookies = await scraper.getCookies();
  const newCookieStrings = newCookies.map((cookie) => cookie.toString());

  return newCookieStrings;
};

export const fetchTwitterTimeline = async (
  scraper: Scraper,
  agentId: string,
  timelineCount: number = 50
) => {
  const seenTweets = await SeenTweets.find({
    agentId,
    seenAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  }).select("tweetId");

  const seenTweetIds = seenTweets.map((tweet) => tweet.tweetId);
  const timeline = await scraper
    .fetchHomeTimeline(timelineCount, seenTweetIds)
    .then((res) => parseHomeTimeline(res));

  const newTweetIds = timeline
    .map((tweet) => tweet.id)
    .filter((id) => !seenTweetIds.includes(id));

  if (newTweetIds.length > 0) {
    await SeenTweets.insertMany(
      newTweetIds.map((tweetId) => ({
        agentId,
        tweetId,
      }))
    );
  }

  return timeline;
};

export const fetchRecentTweets = async (
  scraper: Scraper,
  twitterUserName: string,
  tweetCount: number = 10
): Promise<TweetData[]> => {
  try {
    const tweetGenerator = scraper.getTweets(twitterUserName, tweetCount);
    const tweets: Tweet[] = [];

    for await (const tweet of tweetGenerator) {
      tweets.push(tweet);
      if (tweets.length >= tweetCount) break;
    }

    return parseTweets(tweets);
  } catch (error) {
    console.error(`Error fetching tweets for user ${twitterUserName}:`, error);
    return [];
  }
};

export const fetchTweetsForTickers = async (
  scraper: Scraper,
  tickerAddressMapping: Record<string, string>,
  tweetCount: number = 30
): Promise<Record<string, TweetData[]>> => {
  const randomDelay = () =>
    new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 3000) + 2000)
    );

  const tickers = Object.keys(tickerAddressMapping);

  const tickerTweetsMap = await Promise.all(
    tickers.map(async (ticker, index) => {
      try {
        if (index > 0) {
          await randomDelay();
        }

        const address = tickerAddressMapping[ticker];
        const query = `${ticker} address`;
        const queryTweetsResponse = await scraper.fetchSearchTweets(
          query,
          tweetCount,
          SearchMode.Top
        );
        const parsedTweets = parseTweets(queryTweetsResponse.tweets);
        return [address, parsedTweets];
      } catch (error) {
        console.error(`Error fetching tweets for ticker ${ticker}:`, error);
        return [tickerAddressMapping[ticker], []];
      }
    })
  );

  return Object.fromEntries(tickerTweetsMap);
};

export const fetchTweetsForAddresses = async (
  scraper: Scraper,
  addresses: string[],
  tweetCount: number = 30
): Promise<Record<string, TweetData[]>> => {
  // add randomized delay 2-5 sec and fetch using ticker
  const addressTweetsMap = await Promise.all(
    addresses.map(async (address) => {
      try {
        const queryTweetsResponse = await scraper.fetchSearchTweets(
          address,
          tweetCount,
          SearchMode.Top
        );

        if (!queryTweetsResponse?.tweets?.length) {
          console.warn(`No tweets found for address: ${address}`);
          return [address, []];
        }

        const parsedTweets = parseTweets(queryTweetsResponse.tweets);
        return [address, parsedTweets];
      } catch (error) {
        console.error(`Error fetching tweets for address ${address}:`, error);
        return [address, []];
      }
    })
  );

  return Object.fromEntries(addressTweetsMap);
};

export const postToTwitter = async (scraper: Scraper, tweet: string) => {
  try {
    await scraper.sendTweet(tweet);

    console.log("Tweet posted successfully!");
  } catch (error) {
    console.error("Error posting the tweet:", error);
    throw new Error("Failed to post the tweet");
  }
};

export const followTwitterAccounts = async (
  scraper: Scraper,
  accounts: string[]
) => {
  for (const account of accounts) {
    await scraper.followUser(account).catch((err) => {
      console.error(`Failed to follow ${account}: ${err}`);
    });
  }
};

const parseHomeTimeline = (timeline: any[]) => {
  const parsedTweets = [];

  for (const t of timeline) {
    const tweet = t?.legacy;
    if (!tweet) {
      continue;
    }

    const user = t?.core?.user_results?.result?.legacy;

    const parsedViews = parseInt(tweet?.ext_views?.count ?? "");

    const tw: TweetData = {
      bookmarkCount: tweet.bookmark_count,
      conversationId: tweet.conversation_id_str,
      id: tweet.id_str,
      likes: tweet.favorite_count,
      name: user.name,
      permanentUrl: `https://twitter.com/${user.screen_name}/status/${tweet.id_str}`,
      replies: tweet.reply_count,
      retweets: tweet.retweet_count,
      text: tweet.full_text,
      userId: tweet.user_id_str,
      username: user.screen_name,
      views: isNaN(parsedViews) ? parseInt(t.views.count) : parsedViews,
      timeParsed: new Date(Date.parse(tweet.created_at)),
    };
    parsedTweets.push(tw);
  }
  return parsedTweets;
};

export const parseTweets = (tweets: Tweet[]): TweetData[] => {
  const parsedTweets: TweetData[] = [];

  try {
    for (const tweet of tweets) {
      if (!tweet) continue;

      const tweetData: TweetData = {
        bookmarkCount: tweet.bookmarkCount || 0,
        conversationId: tweet.conversationId || tweet.id || "",
        id: tweet.id || "",
        likes: tweet.likes || 0,
        name: tweet.name || "",
        permanentUrl: tweet.permanentUrl || "",
        replies: tweet.replies || 0,
        retweets: tweet.retweets || 0,
        text: tweet.text || "",
        userId: tweet.userId || "",
        username: tweet.username || "",
        views: tweet.views || 0,
        timeParsed: tweet.timeParsed || new Date(),
      };

      parsedTweets.push(tweetData);
    }
  } catch (error) {
    console.error("Error parsing tweets:", error);
  }

  return parsedTweets;
};
