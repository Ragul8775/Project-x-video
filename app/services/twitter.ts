import { Scraper } from "agent-twitter-client";
import { Cookie } from "tough-cookie";

export interface TweetData {
  text: string;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  username: string;
  timeParsed: string;
  //   followersCount: number;
  //   followingCount: number;
  //   isBlueVerified: boolean;
  //   tweetsCount: number;
  //   likesCount: number;
  //   joined: string;
}

const scraper = new Scraper();

export const loginToTwitter = async (
  scraper: Scraper,
  username: string,
  password: string,
  cookieStrings?: string[]
) => {
  await scraper.clearCookies();

  if (cookieStrings) {
    console.log("[LOGGING IN] - FROM COOKIES");

    const cookies = cookieStrings
      .map((cookieStr: string) => Cookie.parse(cookieStr))
      .filter((cookie) => cookie != undefined);

    await scraper.setCookies(cookies);

    const loggedIn = await scraper.isLoggedIn();
    if (loggedIn) return cookieStrings;
  }

  console.log("[COOKIES NOT FOUND/EXPIRED] - LOGGING IN AGAIN");
  await scraper.login(username, password);
  // Save new cookies
  const newCookies = await scraper.getCookies();
  const newCookieStrings = newCookies.map((cookie) => cookie.toString());

  return newCookieStrings;
};

export const fetchTwitterTimeline = async (
  username: string,
  password: string,
  agentId: string,
  timelineCount: number = 50
) => {
  try {
    await scraper.login(username, password);

    // Implement logic to fetch seenTweetIds from db using the agentId
    const seenTweetIds: string[] = [];
    const timeline = await scraper.fetchHomeTimeline(
      timelineCount,
      seenTweetIds
    );

    return timeline;
  } catch (error) {
    console.error("Error fetching home timeline:", error);
    throw error;
  } finally {
    await scraper.logout();
  }
};

export const fetchRecentTweets = async (
  username: string,
  password: string,
  twitterUserName: string,
  tweetCount: number = 10
) => {
  try {
    await scraper.login(username, password);

    const tweets = await scraper.getTweets(twitterUserName, tweetCount);

    return tweets;
  } catch (error) {
    console.error("Error fetching recent tweets:", error);
    throw error;
  } finally {
    await scraper.logout();
  }
};

export const postToTwitter = async (
  username: string,
  password: string,
  tweet: string
) => {
  try {
    await scraper.login(username, password);

    await scraper.sendTweet(tweet);

    console.log("Tweet posted successfully!");
  } catch (error) {
    console.error("Error posting the tweet:", error);
    throw new Error("Failed to post the tweet");
  } finally {
    await scraper.logout();
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
