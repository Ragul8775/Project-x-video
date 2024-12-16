import { Keypair, PublicKey } from "@solana/web3.js";
import { Types } from "mongoose";
import connectToDatabase from "../src/utils/database";
import Trade from "@/models/trade";
import AgentMemory from "@/models/agentMemory";
import Agent from "@/models/agent";

interface BotData {
  agentTokenMint: PublicKey;
  personality: string;
  agentWalletSecret: string;
  iv: string;
}

export interface PastRequest {
  createdAt: string;
  userQuery: string;
  botResponse: string;
  tokenMint: string;
  wallet: string;
  price: string;
  amount: Number;
  shouldExecute: Boolean;
  holding: number;
  type: string;
  reason: string;
  signature: string;
}

// Fetch bot data using MongoDB ObjectId
export const fetchBotData = async (agentId: string): Promise<BotData> => {
  try {
    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(agentId)) {
      throw new Error("Invalid agent ID format");
    }

    const agent = await Agent.findById(agentId, {
      personality: 1,
      agentWallet: 1,
      tokenMint: 1,
      iv: 1,
    });

    if (!agent) {
      throw new Error(`No agent found with ID: ${agentId}`);
    }

    return {
      agentTokenMint: new PublicKey(agent.tokenMint),
      agentWalletSecret: agent.agentPrivateKeyEncrypted,
      personality: agent.personality,
      iv: agent.iv,
    };
  } catch (error) {
    console.error("Error fetching bot data:", error);
    throw error;
  }
};

export const fetchPastRequests = async (
  agentId: string,
  tokenMint: string
): Promise<PastRequest[]> => {
  try {
    // Find the last document with shouldExecute: true and type: 'SELL' for the given tokenMint
    const lastSell = await AgentMemory.findOne({
      agentId,
      tokenMint: tokenMint,
      shouldExecute: true,
      type: "SELL",
    })
      .sort({ createdAt: -1 }) // Get the most recent one
      .exec();

    if (!lastSell) {
      // If no such document exists, return all documents for the tokenMint
      return await AgentMemory.find({ tokenMint }).exec();
    }

    // Fetch all documents with tokenMint and createdAt after the last document
    const documents = await AgentMemory.find({
      tokenMint,
      createdAt: { $gt: lastSell.createdAt },
    }).exec();

    return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

export interface SaveMemoryParams {
  tokenMint: string;
  wallet: string;
  price: number;
  amount: number;
  shouldExecute: string;
  holding: number;
  type: "BUY" | "SELL";
  reason: string;
  signature?: string;
}

export interface TradeData {
  agentId: string;
  mintId: string;
  amountInvested: number;
  buyPrice: number;
  sellPrice: number;
  pnl: number;
  profit: number;
  buyTxn: string;
  sellTxn: string;
}

export interface TradeDataParams {
  agentId: string;
  tokenMint: string;
  price: number;
  amount: number;
  type: "BUY" | "SELL";
  txn: string;
}

export const saveAgentMemory = async (
  agentId: string,
  memoryData: SaveMemoryParams
): Promise<void> => {
  try {
    // Validate if the provided ID is a valid MongoDB ObjectId
    // if (!Types.ObjectId.isValid(agentId)) {
    //   throw new Error("Invalid agent ID format");
    // }

    // Create new memory document
    const memory = await AgentMemory.create({
      agentId,
      tokenMint: memoryData.tokenMint,
      wallet: memoryData.wallet,
      price: memoryData.price,
      amount: memoryData.amount ?? 0,
      shouldExecute: memoryData.shouldExecute,
      holding: memoryData.holding,
      type: memoryData.type,
      reason: memoryData.reason,
      signature: memoryData.signature,
    });
  } catch (error) {
    console.error("Error saving agent memory:", error);
    throw error;
  }
};

export const saveTrade = async (
  agentId: string,
  tradeData: TradeDataParams
): Promise<void> => {
  try {
    // Validate if the provided ID is a valid MongoDB ObjectId
    // if (!Types.ObjectId.isValid(agentId)) {
    //   throw new Error("Invalid agent ID format");
    // }

    // Create new trade document with correct parameters from TradeDataParams
    await Trade.create({
      agentId,
      tokenMint: tradeData.tokenMint,
      price: tradeData.price,
      amount: tradeData.amount,
      type: tradeData.type,
      txn: tradeData.txn,
    });
  } catch (error) {
    console.error("Error saving trade:", error);
    throw error;
  }
};
