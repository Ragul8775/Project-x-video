import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  BlockhashWithExpiryBlockHeight,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { CreateTokenMetadata } from "pumpdotfun-sdk";
import { AGENT_FEE } from "./constants";
import { CreateAgentArgs } from "./types";
import crypto from "crypto";
import {
  TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { IDL } from "./pump_launchpad";
import { createIx } from "./transactions";
import BN from "bn.js";

export const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC!,
  "confirmed"
);

async function generateWallet(tokenMetadata: CreateTokenMetadata) {
  const formData = new FormData();
  formData.append("file", tokenMetadata.file);
  formData.append("name", tokenMetadata.name);
  formData.append("symbol", tokenMetadata.symbol);
  formData.append("description", tokenMetadata.description);
  // formData.append("twitter", "");
  // formData.append("telegram", "");
  // formData.append("website", "");
  // formData.append("showName", "true");

  const response = await fetch(`/api/generateWallet`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());

  return response;
}

export async function createAgent(
  wallet: WalletContextState,
  args: CreateAgentArgs
) {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected");
  }

  const walletPubkey = new PublicKey(wallet.publicKey);

  const walletResponse = await generateWallet(args.tokenMetadata);
  const agentPubkey = new PublicKey(walletResponse.walletPublicKey);
  const tokenMetadata = walletResponse.tokenMetadata;

  const { txn } = await createAgentTxn(
    walletPubkey,
    args,
    agentPubkey,
    tokenMetadata.metadataUri
  );
  const blockhashWithBlockHeight = await connection.getLatestBlockhash();
  txn.recentBlockhash = blockhashWithBlockHeight.blockhash;

  await addComputeUnitPriceIx(txn);

  const signedTxn = await wallet.signTransaction(txn);

  const response = await fetch(`/api/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transactionBase64: signedTxn.serialize().toString("base64"),
      blockhashWithBlockHeight,
      walletPublicKey: walletResponse.walletPublicKey,
      args: {
        tokenMetadata,
        personality: args.personality,
        twitterUsername: args.twitterUsername,
        twitterPassword: args.twitterPassword,
      },
    }),
  });
  let responseJson = await response.json();

  if (!response.ok) throw new Error(responseJson.error);

  return responseJson.message;
}

export async function createAgentTxn(
  creator: PublicKey,
  args: {
    tokenMetadata: {
      name: string;
      symbol: string;
    };
  },
  agentPubkey: PublicKey,
  metadataUri: string
) {
  const { ix: createLaunchIx, launchId } = await createIx(creator, {
    name: args.tokenMetadata.name,
    symbol: args.tokenMetadata.symbol,
    uri: metadataUri,
  });

  const feeIx = SystemProgram.transfer({
    fromPubkey: creator,
    toPubkey: agentPubkey,
    lamports: AGENT_FEE,
  });

  const txn = new Transaction();
  addComputeUnitLimitIx(txn);
  txn.add(feeIx, createLaunchIx);
  txn.feePayer = creator;

  return { txn, launchId };
}

export const calculateWithSlippageBuy = (
  amount: bigint,
  basisPoints: bigint = 100n
) => {
  return amount + (amount * basisPoints) / 10000n;
};

export const addComputeUnitLimitIx = (transaction: Transaction) => {
  transaction.add(
    ComputeBudgetProgram.setComputeUnitLimit({
      units: 350_000,
    })
  );
};

export const addComputeUnitPriceIx = async (transaction: Transaction) => {
  let priorityFeeEstimate = 100_000;

  try {
    const transactionBase58 = bs58.encode(
      transaction.serialize({ requireAllSignatures: false })
    );

    const response = await fetch(process.env.NEXT_PUBLIC_RPC!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getPriorityFeeEstimate",
        params: [
          {
            transaction: transactionBase58,
            options: {
              recommended: true,
            },
          },
        ],
      }),
    });
    const data = await response.json();

    if (!response.ok) throw new Error(JSON.stringify(data));

    priorityFeeEstimate =
      typeof data.result?.priorityFeeEstimate === "number"
        ? data.result.priorityFeeEstimate
        : priorityFeeEstimate;
  } catch (err) {
    console.log(err);
  } finally {
    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: priorityFeeEstimate,
      })
    );
  }
};

export async function retryTxn(
  transaction: Transaction | VersionedTransaction,
  blockhashContext: BlockhashWithExpiryBlockHeight,
  connection: Connection
) {
  const { lastValidBlockHeight } = blockhashContext;
  let blockheight = await connection.getBlockHeight();

  let flag = true;
  let finalTxn = "";
  let txn = "";
  let error = "";

  while (
    blockheight < lastValidBlockHeight &&
    flag &&
    !(await connection.simulateTransaction(transaction as any)).value.err
  ) {
    txn = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: true,
      maxRetries: 0,
    });
    await new Promise((r) => setTimeout(r, 1000));
    const status = await connection.getSignatureStatus(txn);

    if (!status.value) continue;
    if (status.value.err) {
      error =
        typeof status.value.err === "string"
          ? status.value.err
          : JSON.stringify(status.value.err);
      flag = false;
    }
    if (status.value?.confirmationStatus === "confirmed") {
      finalTxn = txn;
      flag = false;
    }

    blockheight = await connection.getBlockHeight();
  }

  if (finalTxn) return finalTxn;
  else {
    throw new Error(error);
  }
}

// To generate process.env.ENCRYPTION_KEY
const encryptionKey = crypto.randomBytes(32); // 32 bytes for AES-256

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

export const fetchTokenBalance = async (
  connection: Connection,
  wallet: PublicKey,
  mint: PublicKey
) => {
  try {
    let tokenAcc = await getAssociatedTokenAddress(mint, wallet);
    const accountData = await getAccount(connection, tokenAcc);

    return accountData?.amount ?? 0n;
  } catch (e) {
    return 0n;
  }
};

export const fetchSolBalance = async (
  connection: Connection,
  wallet: PublicKey
): Promise<number> => {
  try {
    const balance = await connection.getBalance(wallet);
    return balance / Math.pow(10, 9); // Convert lamports to SOL
  } catch (error) {
    console.error("Error fetching SOL balance:", error);
    throw error;
  }
};

interface TokenBalance {
  mint: string;
  amount: number;
  decimals: number;
  uiAmount: number;
}

interface WalletBalances {
  solBalance: number;
  tokens: TokenBalance[];
}

export const fetchAllBalances = async (
  connection: Connection,
  wallet: PublicKey
): Promise<WalletBalances> => {
  try {
    // Fetch SOL balance
    const solBalance = await fetchSolBalance(connection, wallet);

    // Fetch all token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      wallet,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );

    // Combine and process all token accounts
    const allTokenAccounts = [...tokenAccounts.value];

    const tokens: TokenBalance[] = allTokenAccounts
      .map((account) => {
        const tokenData = account.account.data.parsed.info;

        return {
          mint: tokenData.mint,
          amount: Number(tokenData.tokenAmount.amount),
          decimals: tokenData.tokenAmount.decimals,
          uiAmount: tokenData.tokenAmount.uiAmount || 0,
        };
      })
      // Filter out tokens with 0 balance
      .filter((token) => token.amount > 0);

    return {
      solBalance,
      tokens,
    };
  } catch (error) {
    console.error("Error fetching wallet balances:", error);
    throw error;
  }
};

export const verifyTransaction = (
  transaction: Transaction,
  vTransaction: Transaction
) => {
  const ixs = transaction.instructions.filter(
    (ix) => !ix.programId.equals(ComputeBudgetProgram.programId)
  );
  const vIxs = vTransaction.instructions.filter(
    (ix) => !ix.programId.equals(ComputeBudgetProgram.programId)
  );

  if (JSON.stringify(ixs) !== JSON.stringify(vIxs)) {
    console.log(JSON.stringify(ixs));
    console.log("------------------------");
    console.log(JSON.stringify(vIxs));
    throw new Error("Transaction verification failed");
  }
};

export function truncateAddress(str: string): string {
  if (str.length <= 8) {
    return str;
  }

  const start = str.slice(0, 4);
  const end = str.slice(-4);

  return `${start}...${end}`;
}

export const sendTransaction = async (
  signedTxn: Transaction,
  blockhashWithContext: BlockhashWithExpiryBlockHeight,
  connection: Connection
) => {
  try {
    const signature = await retryTxn(
      signedTxn,
      blockhashWithContext,
      connection
    );
    return signature;
  } catch (error) {
    let message =
      error instanceof Error ? error.message : JSON.stringify(error);

    if (!message?.includes("Custom")) {
      throw new Error(message);
    }

    const errorObj = JSON.parse(message);
    const customErrorNum: number = errorObj.InstructionError[1].Custom;

    const errorMsg = IDL.errors.find(
      (error) => error.code === customErrorNum
    )?.msg;

    throw new Error(errorMsg ?? message);
  }
};

export function getAllocationPercent(max: BN, amount: BN): string {
  return Math.round((amount.toNumber() / (max.toNumber() || 1)) * 100) + "%";
}
