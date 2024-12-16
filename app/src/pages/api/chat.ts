// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { calculatePromptWeightage } from "./../../../services/misc";
import {
  analysePrompt,
  callLLM,
  TokenAnalysisInput,
} from "../../../services/old-llm";
import {
  fetchPastRequests,
  saveAgentMemory,
  SaveMemoryParams,
  saveTrade,
  TradeDataParams,
} from "./../../../services/db";
import { fetchSocialSentiment } from "../../../services/socialdata";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { fetchOnChainData } from "services/onchaindata";
import { checkMigrationStatus, executePumpTrade } from "services/pumpfun";
import { executeJupTrade } from "services/jupiter";
import { postToTwitter } from "services/twitter";
import connectToDatabase from "src/utils/database";
import {
  decryptData,
  fetchAllBalances,
  fetchTokenBalance,
} from "src/utils/helper";
import { PER_TRADE, TRADE_FEE } from "@/utils/constants";
import { getToken } from "next-auth/jwt";
import Agent from "@/models/agent";
import bs58 from "bs58";

type ResponseData = {
  shouldExecute: boolean;
  reason: string;
};

const connection = new Connection(process.env.BACKEND_RPC!, {
  commitment: "confirmed",
});

const secret = process.env.NEXTAUTH_SECRET;
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

const BIRDSEYE_KEY = process.env.BIRDSEYE_KEY!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>
) {
  if (req.method != "POST") return res.status(400);

  try {
    const { wallet, userPrompt, agentId } = req.body;

    if (!wallet || !userPrompt || !agentId) {
      return res
        .status(400)
        .json({ error: "Wallet, userPrompt, agentId are required" });
    }

    const token = await getToken({ req, secret });

    if (!token || !token.sub || token.sub != wallet)
      return res.status(400).json({
        error: "User wallet not authenticated",
      });

    // fetch agent data from DB
    await connectToDatabase();

    const agentInfo = await Agent.findById(agentId);
    if (!agentInfo)
      return res
        .status(400)
        .json({ error: `No agent found with ID: ${agentId}` });

    const {
      encryptedWalletPrivateKey,
      ivWalletPrivateKey,
      tokenMint,
      encryptedTwitterAccessToken,
      ivTwitterAccessToken,
    } = agentInfo;

    // Fetch gov token holding of the user wallet
    const tokenBalance = await fetchTokenBalance(
      connection,
      new PublicKey(wallet),
      new PublicKey(tokenMint)
    );

    if (tokenBalance == 0n) {
      return res.status(400).json({ error: "User wallet has no agent token" });
    }

    let { mint, type, response } = await analysePrompt(userPrompt);

    if (!mint) {
      return res
        .status(400)
        .json({ error: "Please include the token address in the prompt" });
    }

    if (type == "NONE") {
      return res.status(200).json({ shouldExecute: false, reason: response });
    }

    const agentUint8 = bs58.decode(
      decryptData(encryptedWalletPrivateKey, encryptionKey, ivWalletPrivateKey)
    );
    const agentWallet = Keypair.fromSecretKey(agentUint8);

    //TODO: Create a twitter post
    if (encryptedTwitterAccessToken && ivTwitterAccessToken) {
      const twitterAccessToken = decryptData(
        encryptedTwitterAccessToken,
        encryptionKey,
        ivTwitterAccessToken
      );
    }

    // Fetch agent wallet balance
    const { solBalance, tokens } = await fetchAllBalances(
      connection,
      agentWallet.publicKey
    );

    let tradeAmount = 0;
    let platformFee = 0;

    if (type == "SELL" && !tokens.find((data) => data.mint == mint))
      return res.status(400).json({
        shouldExecute: false,
        reason: "Sell token not found in agent wallet",
      });

    // Calculate wallet balance and apply weightage formula
    const pastRequests = await fetchPastRequests(agentId, mint);

    // Calculate wallet balance and apply weightage formula
    const { buyWeight, sellWeight, weight } = calculatePromptWeightage(
      Number(tokenBalance),
      pastRequests,
      type
    );

    let onchainData = await fetchOnChainData(new PublicKey(mint), BIRDSEYE_KEY); // Gets token name and basic info

    if (!onchainData.name)
      return res.status(400).json({
        shouldExecute: false,
        reason: "Token too young | unable to fetch info atm",
      });

    if (type == "BUY") {
      tradeAmount =
        solBalance * PER_TRADE * (1 - TRADE_FEE) < 2
          ? solBalance * PER_TRADE * (1 - TRADE_FEE)
          : 2 * (1 - TRADE_FEE);

      platformFee =
        solBalance * PER_TRADE * TRADE_FEE < 2
          ? solBalance * PER_TRADE * TRADE_FEE
          : 2 * TRADE_FEE;
    } else {
      let solPrice = (
        await (
          await fetch(
            "https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112"
          )
        ).json()
      ).data["So11111111111111111111111111111111111111112"].price;
      tradeAmount = tokens[0].uiAmount;
      platformFee =
        ((tokens[0].uiAmount * onchainData.price!) / solPrice) * TRADE_FEE;
    }

    // Gets social sentiment score & recent tweets

    let socialSentimentData = await fetchSocialSentiment(
      mint,
      onchainData.twitter!
    );

    // Initialize tokenData with default values
    const tokenData: TokenAnalysisInput = {
      ...onchainData,
      ...socialSentimentData,
      buyWeight,
      sellWeight,
      weight,
    };

    console.log(tokenData);

    let prompt = JSON.stringify({
      ...tokenData,
      // personality
    });

    // Call LLM with personality and weighted prompt
    const { shouldExecute, reason } = await callLLM(prompt, userPrompt);

    console.log(shouldExecute, reason);

    let signature;

    if (shouldExecute == "YES") {
      let migrationStatus: any = await checkMigrationStatus(
        connection,
        new PublicKey(mint)
      );

      if (migrationStatus) {
        signature = await executeJupTrade(
          connection,
          tradeAmount * 10 ** 9,
          type,
          agentWallet.publicKey,
          new PublicKey(mint),
          agentWallet,
          platformFee
        );
      } else {
        signature = await executePumpTrade(
          connection,
          tradeAmount * 10 ** 9,
          type,
          agentWallet.publicKey,
          new PublicKey(mint),
          agentWallet,
          platformFee
        );
      }

      console.log(signature);

      let tradeData: TradeDataParams = {
        agentId,
        tokenMint: mint,
        price: tokenData.price!,
        amount: tradeAmount,
        type: type,
        txn: signature!,
      };

      // save trade info
      await saveTrade(agentId, tradeData);

      // // Post decision to Twitter (optional)
      // if (encryptedTwitterAuthToken) {
      // await postToTwitter(twitterAuthToken, reason);
      // }
    }

    let memoryData: SaveMemoryParams = {
      tokenMint: mint,
      wallet,
      price: onchainData.price!,
      amount: tradeAmount ?? 0,
      shouldExecute,
      holding: Number(tokenBalance ?? 0),
      type,
      reason,
      signature,
    };

    await saveAgentMemory(agentId, memoryData);

    // Respond with the decision and reasoning
    res.status(200).json({ shouldExecute, reason });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
