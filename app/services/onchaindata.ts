// fetch onchain data here

import { PublicKey } from "@solana/web3.js";

export interface OnChainData {
  name: string | null;
  ticker: string | null;
  description: string | null;
  twitter: string | null;
  liquidity: number | null;
  lastTradeUnixTime: number | null;
  price: number | null;
  priceChange1hPercent: number | null;
  priceChange6hPercent: number | null;
  priceChange24hPercent: number | null;
  volume1hChangePercent: number | null;
  volume6hChangePercent: number | null;
  volume24hChangePercent: number | null;
  graduate: boolean | null;
  mc: number | null;
  holder: number | null;
  creatorPercentage: number | null;
  top10HolderPercent: number | null;
  uniqueWallet1hChangePercent: number | null;
  uniqueWallet6hChangePercent: number | null;
  uniqueWallet24hChangePercent: number | null;
  website: string | null;
  numberMarkets: number | null;
  mutableMetadata: string | null;
}

// TODO: Implement token metadata fetching
export const fetchOnChainData = async (
  mint: PublicKey,
  BIRDSEYE_KEY: string
): Promise<OnChainData> => {
  // Implementation here

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-chain": "solana",
      "X-API-KEY": BIRDSEYE_KEY,
    },
  };

  let securityData = (
    await (
      await fetch(
        `https://public-api.birdeye.so/defi/token_security?address=${mint}`,
        options
      )
    ).json()
  ).data;

  let tokenOverview = (
    await (
      await fetch(
        `https://public-api.birdeye.so/defi/token_overview?address=${mint}`,
        options
      )
    ).json()
  ).data;

  return {
    name: tokenOverview.name,
    ticker: tokenOverview.symbol,
    description: tokenOverview.extensions.description,
    twitter: tokenOverview.extensions.twitter,
    website: tokenOverview.extensions.website,
    liquidity: tokenOverview.liquidity,
    lastTradeUnixTime: tokenOverview.lastTradeUnixTime,
    price: tokenOverview.price / Math.pow(10, tokenOverview.decimals),
    priceChange1hPercent: tokenOverview.priceChange1hPercent,
    priceChange6hPercent: tokenOverview.priceChange6hPercent,
    priceChange24hPercent: tokenOverview.priceChange24hPercent,
    volume1hChangePercent: tokenOverview.v1hChangePercent,
    volume6hChangePercent: tokenOverview.v6hChangePercent,
    volume24hChangePercent: tokenOverview.v24hChangePercent,
    numberMarkets: tokenOverview.numberMarkets,
    uniqueWallet1hChangePercent: tokenOverview.uniqueWallet1hChangePercent,
    uniqueWallet6hChangePercent: tokenOverview.uniqueWallet6hChangePercent,
    uniqueWallet24hChangePercent: tokenOverview.uniqueWallet24hChangePercent,
    graduate: tokenOverview.graduate,
    mc: tokenOverview.mc,
    holder: tokenOverview.holder,
    mutableMetadata: securityData.mutableMetadata,
    creatorPercentage: securityData.creatorPercentage,
    top10HolderPercent: securityData.top10HolderPercent,
  };
};
