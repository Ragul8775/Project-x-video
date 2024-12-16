import { PLATFORM_WALLET } from "@/utils/constants";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import {
  AddressLookupTableAccount,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { retryTxn } from "src/utils/helper";

// TODO: Implement Jupiter trade execution
export const executeJupTrade = async (
  connection: Connection,
  amount: number,
  type: string,
  wallet: PublicKey,
  mint: PublicKey,
  agentWalletKey: Keypair,
  platformFee: number
) => {
  let quoteResponse;

  if (type == "BUY")
    // Swapping SOL to USDC with input 0.1 SOL and 0.5% slippage
    quoteResponse = await (
      await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${mint}&amount=${amount}&autoSlippage=true`
      )
    ).json();
  else
    quoteResponse = await (
      await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${mint}&outputMint=So11111111111111111111111111111111111111112&amount=${amount}&autoSlippage=true`
      )
    ).json();

  console.log(quoteResponse);

  const instructions = await (
    await fetch("https://quote-api.jup.ag/v6/swap-instructions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // quoteResponse from /quote api
        quoteResponse,
        // user public key to be used for the swap
        userPublicKey: wallet.toBase58(),
        // auto wrap and unwrap SOL. default is true
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        dynamicSlippage: {
          minBps: 0,
          maxBps: 1000,
        },
        // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
        // feeAccount: "fee_account_public_key"
      }),
    })
  ).json();

  if (instructions.error) {
    throw new Error("Failed to get swap instructions: " + instructions.error);
  }

  const destinationTokenAccount = await getAssociatedTokenAddress(
    mint,
    agentWalletKey.publicKey
  );

  const {
    tokenLedgerInstruction, // If you are using `useTokenLedger = true`.
    computeBudgetInstructions, // The necessary instructions to setup the compute budget.
    setupInstructions, // Setup missing ATA for the users.
    swapInstruction: swapInstructionPayload, // The actual swap instruction.
    cleanupInstruction, // Unwrap the SOL if `wrapAndUnwrapSol = true`.
    addressLookupTableAddresses, // The lookup table addresses that you can use if you are using versioned transaction.
  } = instructions;

  const deserializeInstruction = (instruction: any) => {
    return new TransactionInstruction({
      programId: new PublicKey(instruction.programId),
      keys: instruction.accounts.map((key: any) => ({
        pubkey: new PublicKey(key.pubkey),
        isSigner: key.isSigner,
        isWritable: key.isWritable,
      })),
      data: Buffer.from(instruction.data, "base64"),
    });
  };

  const getAddressLookupTableAccounts = async (
    keys: string[]
  ): Promise<AddressLookupTableAccount[]> => {
    const addressLookupTableAccountInfos =
      await connection.getMultipleAccountsInfo(
        keys.map((key) => new PublicKey(key))
      );

    return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
      const addressLookupTableAddress = keys[index];
      if (accountInfo) {
        const addressLookupTableAccount = new AddressLookupTableAccount({
          key: new PublicKey(addressLookupTableAddress),
          state: AddressLookupTableAccount.deserialize(accountInfo.data),
        });
        acc.push(addressLookupTableAccount);
      }

      return acc;
    }, new Array<AddressLookupTableAccount>());
  };

  const addressLookupTableAccounts: AddressLookupTableAccount[] = [];

  addressLookupTableAccounts.push(
    ...(await getAddressLookupTableAccounts(addressLookupTableAddresses))
  );

  console.log(computeBudgetInstructions);

  let blockhashContext = (await connection.getLatestBlockhashAndContext())
    .value;
  const messageV0 = new TransactionMessage({
    payerKey: agentWalletKey.publicKey,
    recentBlockhash: blockhashContext.blockhash,
    instructions: [
      ...computeBudgetInstructions.map(deserializeInstruction),
      createAssociatedTokenAccountIdempotentInstruction(
        agentWalletKey.publicKey,
        destinationTokenAccount,
        agentWalletKey.publicKey,
        mint
      ),
      ...setupInstructions.map(deserializeInstruction),
      deserializeInstruction(swapInstructionPayload),
      deserializeInstruction(cleanupInstruction),
      SystemProgram.transfer({
        fromPubkey: agentWalletKey.publicKey,
        toPubkey: PLATFORM_WALLET,
        lamports: platformFee,
      }),
    ],
  }).compileToV0Message(addressLookupTableAccounts);
  const transaction = new VersionedTransaction(messageV0);

  transaction.sign([agentWalletKey]);

  return await retryTxn(transaction, blockhashContext, connection);
};
