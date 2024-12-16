import { CreateTokenMetadata } from "pumpdotfun-sdk";
import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";

export type CreateAgentArgs = {
  tokenMetadata: CreateTokenMetadata;
  personality: string;
  twitterUsername: string;
  twitterPassword: string;
};

export type CreateArgs = {
  name: string;
  symbol: string;
  uri: string;
};

export type BuyArgs = {
  id: number;
  tokenAmount: BN;
  price: BN;
};

export type SellArgs = {
  id: number;
  tokenAmount: BN;
};

export interface Agent {
  id: number;
  name: string;
  symbol: string;
  imageUrl: string;
  description: string;
  creatorWallet: string;
  data: AgentData;
  agentTwitter: string;
}

export interface AgentData {
  id: number;
  mint: PublicKey;
  creator: PublicKey;
  name: string;
  symbol: string;
  uri: string;
  maxSupply: BN;
  soldSupply: BN;
  price: BN;
  feeCollected: BN;
  completed: boolean;
  withdrawn: boolean;
  deposited: boolean;
  bump: number;
}

export interface Allocation {
  initialized: boolean;
  id: number;
  user: PublicKey;
  tokenAmount: BN;
  claimed: boolean;
  bump: number;
}
