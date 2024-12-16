import { PublicKey } from "@solana/web3.js";

const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || "development";

let PLATFORM_WALLET: PublicKey;
let PLATFORM_FEE = BigInt(10); //TODO: remove if not needed
let AGENT_FEE = 1_000_000; // in lamports
let PER_TRADE = 0.1; // 10% - % user per trade from agent wallet
let TRADE_FEE = 0.02; // 2% - platform fee per trade

const GLOBAL_SEED = "global";
const LAUNCH_SEED = "launch";
const ALLOCATION_SEED = "allocation";
const FEE_RECIPIENT = new PublicKey(
  "HxW4EmTr2WhvrKuxXjB5t5hEpftNebxw6mXsVxcYDMHT"
);

if (environment === "development") {
  PLATFORM_WALLET = new PublicKey(
    "HtUaVzWiSNrrY2NSVKroE3883vnBfn8SMrLM2UxA2vDy"
  );
} else if (environment === "production") {
  PLATFORM_WALLET = new PublicKey(
    "HtUaVzWiSNrrY2NSVKroE3883vnBfn8SMrLM2UxA2vDy"
  );
}

export {
  PLATFORM_WALLET,
  PLATFORM_FEE,
  AGENT_FEE,
  PER_TRADE,
  TRADE_FEE,
  GLOBAL_SEED,
  LAUNCH_SEED,
  ALLOCATION_SEED,
  FEE_RECIPIENT,
};
