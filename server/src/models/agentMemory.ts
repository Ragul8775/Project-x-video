import mongoose, { Types } from "mongoose";

const tweetDataSchema = new mongoose.Schema(
  {
    bookmarkCount: Number,
    conversationId: String,
    id: String,
    likes: Number,
    name: String,
    permanentUrl: String,
    replies: Number,
    retweets: Number,
    text: String,
    userId: String,
    username: String,
    views: Number,
    timeParsed: Date,
  },
  { _id: false }
);

const tokenTradeDataSchema = new mongoose.Schema(
  {
    price: Number,
    priceChange24h: Number,
    priceUsd: Number,
    priceQuote: Number,
    priceChangePercent24h: Number,
    volume24h: Number,
    volumeUsd24h: Number,
    liquidity: Number,
    liquidityUsd: Number,
    txns24h: Number,
    trades24h: Number,
    mcap: Number,
    fdv: Number,
    price_change_1h_percent: Number,
    price_change_6h_percent: Number,
    price_change_24h_percent: Number,
    unique_wallet_1h: Number,
    unique_wallet_24h: Number,
    unique_wallet_1h_change_percent: Number,
    unique_wallet_24h_change_percent: Number,
  },
  { _id: false }
);

const dexScreenerPairSchema = new mongoose.Schema(
  {
    baseToken: {
      address: String,
      symbol: String,
    },
    quoteToken: {
      symbol: String,
    },
    pairAddress: String,
    pairCreatedAt: String,
    priceUsd: String,
    priceChange24h: String,
    volume24h: String,
    liquidity: String,
    txns24h: {
      buys: Number,
      sells: Number,
    },
  },
  { _id: false }
);

const tokenMetricsSchema = new mongoose.Schema(
  {
    security: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    tradeData: tokenTradeDataSchema,
    holderDistributionTrend: String,
    recentTrades: Boolean,
    highSupplyHoldersCount: Number,
    dexScreenerData: {
      pairs: dexScreenerPairSchema,
    },
  },
  { _id: false }
);

const agentMemorySchema = new mongoose.Schema(
  {
    agentId: {
      type: Types.ObjectId,
      required: true,
    },
    tokenMint: {
      type: String,
      required: true,
    },
    ticker: {
      type: String,
      required: true,
    },
    tweets: [tweetDataSchema],
    chainMetrics: tokenMetricsSchema,
    generatedTweet: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const AgentMemory =
  mongoose.models.AgentMemory ||
  mongoose.model("AgentMemory", agentMemorySchema);

export default AgentMemory;
