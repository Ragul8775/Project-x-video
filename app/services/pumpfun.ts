import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { PumpFunSDK } from "pumpdotfun-sdk";
import { PLATFORM_FEE, PLATFORM_WALLET } from "src/utils/constants";
import { retryTxn } from "src/utils/helper";

// TODO: Implement migration status check
export const checkMigrationStatus = async (
  connection: Connection,
  mint: PublicKey
) => {
  const sdk = new PumpFunSDK({ connection });

  return (await sdk.getBondingCurveAccount(mint))?.complete;
};

// TODO: Implement pump trade execution
export const executePumpTrade = async (
  connection: Connection,
  amount: number,
  type: string,
  wallet: PublicKey,
  mint: PublicKey,
  agentWalletKey: Keypair,
  platformFee: number
) => {
  const sdk = new PumpFunSDK({ connection });

  const globalAccount = await sdk.getGlobalAccount("confirmed");
  const tokenAmount = globalAccount.getInitialBuyPrice(
    (BigInt(amount) * (100n - PLATFORM_FEE)) / 100n
  );
  const buyAmountWithSlippage = tokenAmount;

  let inx;

  if (type == "BUY") {
    inx = await sdk.getBuyInstructionsBySolAmount(
      wallet,
      mint,
      BigInt(amount),
      buyAmountWithSlippage
    );
  } else {
    inx = await sdk.getSellInstructionsByTokenAmount(
      wallet,
      mint,
      BigInt(amount),
      buyAmountWithSlippage
    );
  }

  let transaction = new Transaction();

  let blockhashContext = (await connection.getLatestBlockhashAndContext())
    .value;

  transaction.recentBlockhash = blockhashContext.blockhash;

  transaction.feePayer = wallet;

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: agentWalletKey.publicKey,
      toPubkey: PLATFORM_WALLET,
      lamports: platformFee,
    }),
    inx
  );

  transaction.sign(agentWalletKey);

  return await retryTxn(transaction, blockhashContext, connection);
};
