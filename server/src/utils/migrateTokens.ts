import { Connection, Keypair, Transaction } from "@solana/web3.js";
import {
  addComputeUnitLimitIx,
  addComputeUnitPriceIx,
  depositIx,
  getProgram,
  sendTransaction,
  withdrawIx,
} from "./transactions";
import bs58 from "bs58";
import Agent from "../models/agent";
import { calculateWithSlippageBuy, PumpFunSDK } from "pumpdotfun-sdk";
import BigNumber from "bignumber.js";

const migrateTokens = async () => {
  const program = getProgram();

  const userKeypair = Keypair.fromSecretKey(
    bs58.decode(process.env.PRIVATE_KEY!)
  );
  const user = userKeypair.publicKey;

  program.addEventListener("launchCompleted", async (event) => {
    try {
      const { maxSupply, price, id, creatorSupply } = event;
      const connection = new Connection(process.env.RPC!, "confirmed");
      const agent = await Agent.findOne({ launchId: id });
      const { name, symbol, metadataUri } = agent;

      const mintKeypair = Keypair.generate();

      const withdrawSolIx = await withdrawIx(program, user, id);

      const sdk = new PumpFunSDK({ connection });
      const createTx = await sdk.getCreateInstructions(
        user,
        name,
        symbol,
        metadataUri,
        mintKeypair
      );

      const buyAmountToken = new BigNumber(maxSupply.toString()).multipliedBy(
        new BigNumber(creatorSupply)
      );

      const buyAmountSol = buyAmountToken
        .div(10 ** 6)
        .multipliedBy(price.toString());
      const buyAmountSolWithSlippage = calculateWithSlippageBuy(
        BigInt(buyAmountSol.toString()),
        100n
      );

      const globalAccount = await sdk.getGlobalAccount("confirmed");

      const buyTx = await sdk.getBuyInstructions(
        user,
        mintKeypair.publicKey,
        globalAccount.feeRecipient,
        BigInt(buyAmountToken.toString()),
        buyAmountSolWithSlippage
      );

      const depositTokenIx = await depositIx(
        program,
        user,
        id,
        mintKeypair.publicKey
      );

      const txn = new Transaction();
      addComputeUnitLimitIx(txn);
      txn.add(withdrawSolIx, createTx, buyTx, depositTokenIx);
      txn.feePayer = user;

      const blockhashWithContext = await connection.getLatestBlockhash();
      txn.recentBlockhash = blockhashWithContext.blockhash;

      await addComputeUnitPriceIx(txn);
      txn.sign(userKeypair, mintKeypair);

      const signature = await sendTransaction(
        txn,
        blockhashWithContext,
        connection
      );

      await Agent.findOneAndUpdate(
        { launchId: id },
        { tokenMint: mintKeypair.publicKey }
      );
      console.log(`Migrated launch: ${id}, tx: ${signature}`);
    } catch (error) {
      console.log(`Error migrating launch: ${event.id}`, error);
    }
  });
};
export default migrateTokens;
