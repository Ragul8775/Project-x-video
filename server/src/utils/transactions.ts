import {
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
  type BlockhashWithExpiryBlockHeight,
} from "@solana/web3.js";
import bs58 from "bs58";
import { IDL, type PumpLaunchpad } from "./pump_launchpad";
import { Program } from "@coral-xyz/anchor";
import { getAssociatedTokenAddressSync, NATIVE_MINT } from "@solana/spl-token";

const GLOBAL_SEED = "global";
const LAUNCH_SEED = "launch";
const ALLOCATION_SEED = "allocation";
export const FEE_RECIPIENT = new PublicKey(
  "HxW4EmTr2WhvrKuxXjB5t5hEpftNebxw6mXsVxcYDMHT"
);

export const connection = new Connection(process.env.RPC!, "confirmed");
export const programId = new PublicKey(IDL.address);

export const getProgram = () => {
  const connection = new Connection(process.env.RPC!, "recent");
  return new Program<PumpLaunchpad>(IDL, { connection });
};

function getGlobalAddress() {
  const [global] = PublicKey.findProgramAddressSync(
    [Buffer.from(GLOBAL_SEED)],
    programId
  );

  return global;
}

function getLaunchAddress(launchId: number) {
  const launchIdBuffer = Buffer.alloc(4);
  launchIdBuffer.writeUInt32LE(launchId);

  const [tokenStats] = PublicKey.findProgramAddressSync(
    [Buffer.from(LAUNCH_SEED), launchIdBuffer],
    programId
  );

  return tokenStats;
}

function getAllocationAddress(user: PublicKey, launchId: number) {
  const launchIdBuffer = Buffer.alloc(4);
  launchIdBuffer.writeUInt32LE(launchId);

  const [allocation] = PublicKey.findProgramAddressSync(
    [Buffer.from(ALLOCATION_SEED), user.toBuffer(), launchIdBuffer],
    programId
  );

  return allocation;
}

export async function getLaunches() {
  const program = getProgram();

  const buffer = Buffer.alloc(1);
  const filters = [];
  filters.push({
    memcmp: {
      offset: 413,
      bytes: bs58.encode(buffer),
    },
  });

  buffer.writeUInt8(1);
  filters.push({
    memcmp: {
      offset: 412,
      bytes: bs58.encode(buffer),
    },
  });

  const launches = await program.account.launch.all(filters);
  return launches.map((launch) => launch.account);
}

export const withdrawIx = async (
  program: Program<PumpLaunchpad>,
  user: PublicKey,
  id: number
) => {
  const launch = getLaunchAddress(id);
  const associatedUser = getAssociatedTokenAddressSync(NATIVE_MINT, user);
  const associatedLaunch = getAssociatedTokenAddressSync(
    NATIVE_MINT,
    launch,
    true
  );

  const ix = await program.methods
    .withdraw()
    .accountsPartial({
      user,
      associatedUser,
      launch,
      associatedLaunch,
    })
    .instruction();

  return ix;
};

export const depositIx = async (
  program: Program<PumpLaunchpad>,
  user: PublicKey,
  id: number,
  tokenMint: PublicKey
) => {
  const launch = getLaunchAddress(id);
  const associatedUser = getAssociatedTokenAddressSync(tokenMint, user);
  const associatedLaunch = getAssociatedTokenAddressSync(
    tokenMint,
    launch,
    true
  );
  const launchInfo = await program.account.launch.fetch(launch);
  const allocation = getAllocationAddress(launchInfo.creator, id);

  const ix = await program.methods
    .deposit()
    .accountsPartial({
      user,
      allocation,
      associatedUser,
      launch,
      associatedLaunch,
      tokenMint,
    })
    .instruction();

  return ix;
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

    priorityFeeEstimate =
      typeof data.result?.priorityFeeEstimate === "number"
        ? data.result.priorityFeeEstimate
        : priorityFeeEstimate;
  } catch (err) {
    console.error(err);
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
