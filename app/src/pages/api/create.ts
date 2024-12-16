import {
  BlockhashWithExpiryBlockHeight,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { Scraper } from "agent-twitter-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { loginToTwitter } from "services/twitter";
import Agent from "src/models/agent";
import connectToDatabase from "src/utils/database";
import {
  createAgentTxn,
  encryptData,
  retryTxn,
  verifyTransaction,
} from "src/utils/helper";

const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

type ResponseData = {
  message: string;
};

type ReqBody = {
  transactionBase64: string;
  blockhashWithBlockHeight: BlockhashWithExpiryBlockHeight;
  walletPublicKey: string;
  args: {
    tokenMetadata: {
      metadata: {
        name: string;
        description: string;
        image: string;
        symbol: string;
      };
      metadataUri: string;
    };
    personality: string;
    twitterUsername: string;
    twitterPassword: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>
) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });

    const {
      transactionBase64,
      blockhashWithBlockHeight,
      args,
      walletPublicKey,
    }: ReqBody = req.body;

    if (
      !transactionBase64 ||
      !blockhashWithBlockHeight ||
      !args ||
      !walletPublicKey
    ) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const connection = new Connection(process.env.BACKEND_RPC!, "confirmed");
    const txn = Transaction.from(Buffer.from(transactionBase64, "base64"));

    const creator = txn.feePayer;
    if (!creator) {
      return res
        .status(400)
        .json({ error: "Invalid transaction: feePayer not found" });
    }

    await connectToDatabase();
    const agent = await Agent.findOne({
      walletPublicKey,
      isInitialized: false,
    });
    if (!agent) {
      return res.status(404).json({ error: "Invalid walletPublicKey" });
    }

    const createAgentArgs = {
      tokenMetadata: {
        name: args.tokenMetadata.metadata.name,
        symbol: args.tokenMetadata.metadata.symbol,
      },
    };

    const { txn: vTxn, launchId } = await createAgentTxn(
      creator,
      createAgentArgs,
      new PublicKey(walletPublicKey),
      args.tokenMetadata.metadataUri
    );

    vTxn.instructions.forEach((instruction) => {
      instruction.keys.map((key) => {
        if (key.pubkey.equals(creator)) {
          key.isSigner = true;
          key.isWritable = true;
        }
      });
    });

    verifyTransaction(txn, vTxn);

    // const scraper = new Scraper();
    // const cookieStrings = await loginToTwitter(
    //   scraper,
    //   args.twitterUsername,
    //   args.twitterPassword
    // );

    const signature = await retryTxn(txn, blockhashWithBlockHeight, connection);

    const encryptedPassword = encryptData(args.twitterPassword, encryptionKey);

    // const encryptedTwitterCookieStrings: string[] = [];
    // const ivTwitterCookieStrings: string[] = [];

    // for (const cookieString of cookieStrings) {
    //   const encryptedCookie = encryptData(cookieString, encryptionKey);
    //   encryptedTwitterCookieStrings.push(encryptedCookie.encryptedData);
    //   ivTwitterCookieStrings.push(encryptedCookie.iv);
    // }

    const updateData = {
      launchId,
      personality: args.personality,
      creatorWallet: creator,
      signature,
      twitterUsername: args.twitterUsername,
      encryptedTwitterPassword: encryptedPassword.encryptedData,
      ivTwitterPassword: encryptedPassword.iv,
      // encryptedTwitterCookieStrings,
      // ivTwitterCookieStrings,
      isInitialized: true,
    };

    const updatedAgent = await Agent.findOneAndUpdate(
      {
        walletPublicKey,
        isInitialized: false,
      },
      {
        $set: updateData,
      },
      { new: true }
    );

    if (!updatedAgent) {
      console.log(
        `No matching agent found, walletPublicKey: ${walletPublicKey}, signature: ${signature}`
      );
      return res.status(500).json({ error: "No matching agent found" });
    }

    return res.status(201).json({ message: "Agent created successfully" });
  } catch (error) {
    console.error("API Error:", error);
    let message =
      error instanceof Error ? error.message : JSON.stringify(error);
    return res.status(500).json({ error: message });
  }
}
