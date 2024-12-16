import crypto from "crypto";
import { PublicKey } from "@solana/web3.js";
import {
  type TweetData,
  type OptimizedTokenMetrics,
  type TokenAnalysisData,
} from "../utils/types";

export interface DexScreenerPair {
  chainId: string;
  baseToken: {
    address: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    symbol: string;
  };
}

export interface DexScreenerResponse {
  pairs: DexScreenerPair[];
}

const generateIV = () => crypto.randomBytes(16); // 16 bytes for AES

export const encryptData = (data: string, encryptionKey: Buffer) => {
  const iv = generateIV();

  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");

  return { encryptedData, iv: iv.toString("hex") };
};

export const decryptData = (
  encryptedData: string,
  encryptionKey: Buffer,
  ivHex: string
) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    encryptionKey,
    Buffer.from(ivHex, "hex")
  );
  let decryptedData = decipher.update(encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");

  return decryptedData;
};

export const generateRandomInterval = () => {
  const interval = {
    min: 40, // 40 mins
    max: 60, // 60 mins
  };

  const randomInterval =
    Math.floor(
      Math.random() * (interval.max - interval.min + 1) + interval.min
    ) * 60;

  return randomInterval;
};

export const extractTickersFromTweets = (tweets: TweetData[]): string[] => {
  const tickerPattern = /\$[A-Z]{1,8}/g;

  const tickers = tweets.reduce((acc: string[], tweet) => {
    const matches = (tweet.text?.match(tickerPattern) || []) as string[];
    return [...acc, ...matches];
  }, []);

  return [...new Set(tickers)];
};

export const getTokenAddressMapping = async (
  tickers: string[]
): Promise<Record<string, string>> => {
  const addressMapping: Record<string, string> = {};

  try {
    await Promise.all(
      tickers.map(async (ticker) => {
        const cleanTicker = ticker.replace("$", "");

        const response = await fetch(
          `https://api.dexscreener.com/latest/dex/search?q=${cleanTicker}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          console.warn(`Failed to fetch data for ${ticker}`);
          return;
        }

        const data: DexScreenerResponse = await response.json();

        const matchingPair = data.pairs?.find(
          (pair) =>
            pair.baseToken.symbol.toUpperCase() === cleanTicker.toUpperCase()
        );

        if (matchingPair) {
          const cleanedAddress = cleanAddress(matchingPair.baseToken.address);
          if (cleanedAddress) {
            addressMapping[ticker] = cleanedAddress;
          } else {
            console.warn(
              `Invalid Solana address format for ${ticker}: ${matchingPair.baseToken.address}`
            );
          }
        }
      })
    );

    return addressMapping;
  } catch (error) {
    console.error("Error fetching token addresses:", error);
    return addressMapping;
  }
};

export const extractMintAddresses = (
  tickerTweetsMapping: Record<string, TweetData[]>
): Record<string, string> => {
  const mintAddressMapping: Record<string, string> = {};

  const mintAddressRegex = /[1-9A-HJ-NP-Za-km-z]{32,44}/g;

  for (const [ticker, tweets] of Object.entries(tickerTweetsMapping)) {
    const allText = tweets.map((tweet) => tweet.text || "").join(" ");

    const potentialAddresses = allText.match(mintAddressRegex) || [];

    for (const address of potentialAddresses) {
      try {
        new PublicKey(address);
        mintAddressMapping[ticker] = address;
        break;
      } catch {
        continue;
      }
    }
  }

  return mintAddressMapping;
};

const cleanAddress = (address: string): string | null => {
  const ADDRESS_PATTERN = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

  if (ADDRESS_PATTERN.test(address)) return address;

  const solMatch = address.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/);
  if (solMatch) return solMatch[0];

  return null;
};

export const calculateSocialMetrics = (tweets: TweetData[]) => {
  return {
    tweetCount: tweets.length,
    averageLikes:
      tweets.reduce((acc, tweet) => acc + tweet.likes, 0) / tweets.length,
    averageReplies:
      tweets.reduce((acc, tweet) => acc + tweet.replies, 0) / tweets.length,
    averageRetweets:
      tweets.reduce((acc, tweet) => acc + tweet.retweets, 0) / tweets.length,
  };
};

// Combined data function
export const combineTokenData = (
  address: string,
  metrics: OptimizedTokenMetrics,
  tweets: TweetData[]
): TokenAnalysisData => {
  return {
    address,
    metrics,
    tweets,
    socialMetrics: calculateSocialMetrics(tweets),
  };
};