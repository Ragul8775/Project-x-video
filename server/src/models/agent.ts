import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    launchId: Number,
    name: String,
    symbol: String,
    imageUrl: String,
    metadataUri: String,
    description: String,
    personality: String,
    creatorWallet: String,
    // mint of token created for agent on pumpdotfun
    tokenMint: String,
    // wallet holding agents trading balance
    walletPublicKey: {
      type: String,
      required: true,
    },
    encryptedWalletPrivateKey: {
      type: String,
      required: true,
    },
    ivWalletPrivateKey: {
      type: String,
      required: true,
    },
    signature: String,
    twitterUsername: String,
    encryptedTwitterPassword: String,
    ivTwitterPassword: String,
    encryptedTwitterCookieStrings: [String],
    ivTwitterCookieStrings: [String],
    isInitialized: {
      type: Boolean,
      required: true,
      default: false,
    },
    // Last executed at unix timestamp
    lastExecutedAt: Number,
  },
  { timestamps: true }
);

const Agent = mongoose.models.Agent || mongoose.model("Agent", agentSchema);
export default Agent;
