import { TokenProvider, WalletProvider } from "@ai16z/plugin-solana";
import bs58 from "bs58";
import { Connection, Keypair } from "@solana/web3.js";
import {
  type TokenMetrics,
  type OptimizedTokenMetrics,
  type OptimizedDexScreenerPair,
} from "../utils/types";

export async function getOnChainMetrics(
  tokenAddress: string
): Promise<TokenMetrics> {
  try {
    const connection = new Connection(process.env.BACKEND_RPC!, "confirmed");
    const devKeypair = Keypair.fromSecretKey(
      bs58.decode(process.env.PRIVATE_KEY!)
    );

    const walletProvider = new WalletProvider(connection as any, devKeypair.publicKey);
    const tokenProvider = new TokenProvider(tokenAddress, walletProvider);
    const tokenInfo = await tokenProvider.getProcessedTokenData();

    return tokenInfo as TokenMetrics;
  } catch (error) {
    console.error("Error fetching on-chain metrics:", error);
    throw error;
  }
}

export async function fetchAllMetrics(
  addresses: string[]
): Promise<Record<string, OptimizedTokenMetrics>> {
  const addressMetricsMapping: Record<string, OptimizedTokenMetrics> = {};

  const batchSize = 5;
  for (let i = 0; i < addresses.length; i += batchSize) {
    const batch = addresses.slice(i, i + batchSize);
    const promises = batch.map(async (address) => {
      try {
        const metrics = await getOnChainMetrics(address);
        addressMetricsMapping[address] = parseToOptimizedMetrics(metrics);
      } catch (error) {
        console.error(`Error fetching metrics for ${address}:`, error);
      }
    });
    await Promise.all(promises);
  }

  return addressMetricsMapping;
}

function parseToOptimizedMetrics(metrics: TokenMetrics): OptimizedTokenMetrics {
  const optimizedDexScreenerPair: OptimizedDexScreenerPair = {
    baseToken: {
      address: metrics.dexScreenerData.pairs[0].baseToken.address,
      symbol: metrics.dexScreenerData.pairs[0].baseToken.symbol,
    },
    quoteToken: {
      symbol: metrics.dexScreenerData.pairs[0].quoteToken.symbol,
    },
    pairAddress: metrics.dexScreenerData.pairs[0].pairAddress,
    pairCreatedAt: new Date(
      metrics.dexScreenerData.pairs[0].pairCreatedAt
    ).toISOString(),
    priceUsd: metrics.dexScreenerData.pairs[0].priceUsd,
    priceChange24h: metrics.dexScreenerData.pairs[0].priceChange.h24.toString(),
    volume24h: metrics.dexScreenerData.pairs[0].volume.h24.toString(),
    liquidity: metrics.dexScreenerData.pairs[0].liquidity.usd.toString(),
    txns24h: metrics.dexScreenerData.pairs[0].txns.h24,
  };

  return {
    security: metrics.security,
    tradeData: {
      price: metrics.tradeData.price,
      priceChange24h: metrics.tradeData.price_change_24h_percent,
      priceUsd: metrics.tradeData.volume_24h_usd / metrics.tradeData.volume_24h,
      priceQuote: metrics.tradeData.price,
      priceChangePercent24h: metrics.tradeData.price_change_24h_percent,
      volume24h: metrics.tradeData.volume_24h,
      volumeUsd24h: metrics.tradeData.volume_24h_usd,
      liquidity: metrics.tradeData.volume_24h,
      liquidityUsd: metrics.tradeData.volume_24h_usd,
      txns24h: metrics.tradeData.trade_24h,
      trades24h: metrics.tradeData.trade_24h,
      mcap: metrics.tradeData.market,
      fdv: metrics.tradeData.market,
      price_change_1h_percent: metrics.tradeData.price_change_1h_percent,
      price_change_6h_percent: metrics.tradeData.price_change_6h_percent,
      price_change_24h_percent: metrics.tradeData.price_change_24h_percent,
      unique_wallet_1h: metrics.tradeData.unique_wallet_1h,
      unique_wallet_24h: metrics.tradeData.unique_wallet_24h,
      unique_wallet_1h_change_percent:
        metrics.tradeData.unique_wallet_1h_change_percent,
      unique_wallet_24h_change_percent:
        metrics.tradeData.unique_wallet_24h_change_percent,
    },
    holderDistributionTrend: metrics.holderDistributionTrend,
    recentTrades: metrics.recentTrades,
    highSupplyHoldersCount: metrics.highSupplyHoldersCount,
    dexScreenerData: {
      pairs: optimizedDexScreenerPair,
    },
  };
}
