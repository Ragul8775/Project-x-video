import { Scraper, SearchMode } from "agent-twitter-client";

const TWITTER_AUTH = process.env.TWITTER_AUTH!;

const scraper = new Scraper();
// Define the cookie
const cookie = {
  domain: "twitter.com",
  expirationDate: 1748118131.469602,
  hostOnly: false,
  httpOnly: true,
  name: "auth_token",
  path: "/",
  sameSite: "no_restriction",
  secure: true,
  session: false,
  value: TWITTER_AUTH,
};

// Convert cookie expirationDate to a valid date
const cookieString = `${cookie.name}=${cookie.value}; Domain=${
  cookie.domain
}; Path=${cookie.path}; Secure=${cookie.secure}; HttpOnly=${
  cookie.httpOnly
}; Expires=${new Date(cookie.expirationDate * 1000).toUTCString()}`;

await scraper.setCookies([cookieString]);

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

export interface SocialSentimentResult {
  latestTweets: TweetData[];
  verified: boolean;
  followers: number;
}

// TODO: Implement social sentiment analysis
export const fetchSocialSentiment = async (
  mint: string,
  twitter: string
): Promise<SocialSentimentResult> => {
  try {
    const isLoggedIn = await scraper.isLoggedIn();
    if (!isLoggedIn) {
      console.log("Twitter scraper not logged in");
    }

    let twitterId = extractUsername(twitter);

    console.log(twitterId);

    let tokenTwitter;

    if (twitterId) tokenTwitter = await scraper.getProfile(twitterId);

    // console.log(mint);

    const tweets = await scraper.fetchSearchTweets(mint, 10, SearchMode.Top);

    // console.log(tweets.tweets);

    const latestTweets: TweetData[] = tweets.tweets.map((tweet) => ({
      text: tweet.text ?? "",
      likes: tweet.likes ?? 0,
      retweets: tweet.retweets ?? 0,
      replies: tweet.replies ?? 0,
      views: tweet.views ?? 0,
      username: tweet.username ?? "",
      timeParsed: tweet.timestamp?.toString() ?? "",
    }));

    return {
      verified: tokenTwitter?.isBlueVerified ?? false,
      followers: tokenTwitter?.followersCount ?? 0,
      latestTweets,
    };
  } catch (error) {
    console.error("Error fetching social sentiment:", error);
    return {
      latestTweets: [],
      verified: false,
      followers: 0,
    };
  }
};

function extractUsername(url: string): string | null {
  const regex =
    /https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/([^\/?]+)(?:\/|$)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
