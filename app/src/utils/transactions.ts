import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { IDL, PumpLaunchpad } from "./pump_launchpad";
import { Program } from "@coral-xyz/anchor";
import { BuyArgs, CreateArgs, SellArgs } from "./types";
import {
  ALLOCATION_SEED,
  FEE_RECIPIENT,
  GLOBAL_SEED,
  LAUNCH_SEED,
} from "./constants";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createCloseAccountInstruction,
  createSyncNativeInstruction,
  getAssociatedTokenAddressSync,
  NATIVE_MINT,
} from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  addComputeUnitLimitIx,
  addComputeUnitPriceIx,
  sendTransaction,
} from "./helper";
import bs58 from "bs58";

export const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC!,
  "confirmed"
);
export const programId = new PublicKey(IDL.address);

export const getProgram = () => {
  const connection = new Connection(process.env.NEXT_PUBLIC_RPC!, "recent");
  return new Program<PumpLaunchpad>(IDL, { connection });
};

function getGlobalAddress() {
  const [global] = PublicKey.findProgramAddressSync(
    [Buffer.from(GLOBAL_SEED)],
    programId
  );

  return global;
}

export function getLaunchAddress(launchId: number) {
  const launchIdBuffer = Buffer.alloc(4);
  launchIdBuffer.writeUInt32LE(launchId);

  const [tokenStats] = PublicKey.findProgramAddressSync(
    [Buffer.from(LAUNCH_SEED), launchIdBuffer],
    programId
  );

  return tokenStats;
}

function getAllocationAddress(user: PublicKey, tokenId: number) {
  const launchIdBuffer = Buffer.alloc(4);
  launchIdBuffer.writeUInt32LE(tokenId);

  const [allocation] = PublicKey.findProgramAddressSync(
    [Buffer.from(ALLOCATION_SEED), user.toBuffer(), launchIdBuffer],
    programId
  );

  return allocation;
}

export async function getLaunches(user?: PublicKey, id?: number) {
  const program = getProgram();

  const filters = [];
  if (user)
    filters.push({
      memcmp: {
        offset: 44,
        bytes: user.toBase58(),
      },
    });
  else if (id) {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(id);

    filters.push({
      memcmp: {
        offset: 9,
        bytes: bs58.encode(buffer),
      },
    });
  }

  const launches = await program.account.launch.all(filters);
  return launches.map((launch) => launch.account);
}

export async function getAllocations(id?: number, user?: PublicKey) {
  const program = getProgram();

  const filters = [];
  if (user)
    filters.push({
      memcmp: {
        offset: 13,
        bytes: user.toBase58(),
      },
    });
  else if (id) {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(id);

    filters.push({
      memcmp: {
        offset: 9,
        bytes: bs58.encode(buffer),
      },
    });
  }

  const allocations = await program.account.allocation.all(filters);

  return allocations.map((allocation) => allocation.account);
}

export const createIx = async (user: PublicKey, args: CreateArgs) => {
  const program = getProgram();

  const global = getGlobalAddress();
  const globalInfo = await program.account.global.fetch(global);
  const launchId = globalInfo.tokens + 1;

  const launch = getLaunchAddress(launchId);

  const ix = await program.methods
    .create(args)
    .accounts({
      user,
      launch,
    })
    .instruction();

  return { ix, launchId };
};

const buyIx = async (user: PublicKey, args: BuyArgs) => {
  const program = getProgram();

  const launch = getLaunchAddress(args.id);
  const associatedLaunch = getAssociatedTokenAddressSync(
    NATIVE_MINT,
    launch,
    true
  );

  const associatedUser = getAssociatedTokenAddressSync(NATIVE_MINT, user);
  const allocation = getAllocationAddress(user, args.id);
  const solAmount = Math.floor(
    args.tokenAmount.mul(args.price).toNumber() / 10 ** 6
  );

  const ixs = [
    createAssociatedTokenAccountIdempotentInstruction(
      user,
      associatedUser,
      user,
      NATIVE_MINT
    ),
    SystemProgram.transfer({
      fromPubkey: user,
      toPubkey: associatedUser,
      lamports: solAmount,
    }),
    createSyncNativeInstruction(associatedUser),
    await program.methods
      .buy({ tokenAmount: args.tokenAmount })
      .accountsPartial({
        user,
        allocation,
        associatedUser,
        launch,
        associatedLaunch,
        feeRecipient: FEE_RECIPIENT,
      })
      .instruction(),
  ];

  return ixs;
};

const sellIx = async (user: PublicKey, args: SellArgs) => {
  const program = getProgram();

  const launch = getLaunchAddress(args.id);
  const associatedLaunch = getAssociatedTokenAddressSync(
    NATIVE_MINT,
    launch,
    true
  );

  const associatedUser = getAssociatedTokenAddressSync(NATIVE_MINT, user);
  const allocation = getAllocationAddress(user, args.id);

  const ixs = [
    await program.methods
      .sell({ tokenAmount: args.tokenAmount })
      .accountsPartial({
        user,
        allocation,
        associatedUser,
        launch,
        associatedLaunch,
        feeRecipient: FEE_RECIPIENT,
      })
      .instruction(),
    createCloseAccountInstruction(associatedUser, user, user),
  ];

  return ixs;
};

const claimIx = async (user: PublicKey, id: number) => {
  const program = getProgram();

  const launch = getLaunchAddress(id);
  const launchInfo = await program.account.launch.fetch(launch);
  const associatedLaunch = getAssociatedTokenAddressSync(
    launchInfo.mint,
    user,
    true
  );
  const associatedUser = getAssociatedTokenAddressSync(launchInfo.mint, user);

  const allocation = getAllocationAddress(user, id);

  const ix = await program.methods
    .claim()
    .accountsPartial({
      user,
      associatedUser,
      launch,
      associatedLaunch,
      tokenMint: launchInfo.mint,
      allocation,
    })
    .instruction();

  return ix;
};

export const buy = async (wallet: WalletContextState, args: BuyArgs) => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected");
  }

  const transaction = new Transaction();

  const walletPubkey = new PublicKey(wallet.publicKey);

  const blockhashWithContext = await connection.getLatestBlockhash("processed");
  transaction.recentBlockhash = blockhashWithContext.blockhash;
  transaction.feePayer = walletPubkey;

  const ixs = await buyIx(walletPubkey, args);

  addComputeUnitLimitIx(transaction);
  transaction.add(...ixs);
  await addComputeUnitPriceIx(transaction);

  const signedTxn = await wallet.signTransaction(transaction);

  return await sendTransaction(signedTxn, blockhashWithContext, connection);
};

export const sell = async (wallet: WalletContextState, args: SellArgs) => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected");
  }

  const transaction = new Transaction();

  const walletPubkey = new PublicKey(wallet.publicKey);

  const blockhashWithContext = await connection.getLatestBlockhash("processed");
  transaction.recentBlockhash = blockhashWithContext.blockhash;
  transaction.feePayer = walletPubkey;

  const ixs = await sellIx(walletPubkey, args);

  addComputeUnitLimitIx(transaction);
  transaction.add(...ixs);
  await addComputeUnitPriceIx(transaction);

  const signedTxn = await wallet.signTransaction(transaction);

  return await sendTransaction(signedTxn, blockhashWithContext, connection);
};

export const claim = async (wallet: WalletContextState, id: number) => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected");
  }

  const transaction = new Transaction();

  const walletPubkey = new PublicKey(wallet.publicKey);

  const blockhashWithContext = await connection.getLatestBlockhash("processed");
  transaction.recentBlockhash = blockhashWithContext.blockhash;
  transaction.feePayer = walletPubkey;

  const ix = await claimIx(walletPubkey, id);

  addComputeUnitLimitIx(transaction);
  transaction.add(ix);
  await addComputeUnitPriceIx(transaction);

  const signedTxn = await wallet.signTransaction(transaction);

  return await sendTransaction(signedTxn, blockhashWithContext, connection);
};
