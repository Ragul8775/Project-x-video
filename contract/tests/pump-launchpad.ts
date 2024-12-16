import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { getAssociatedTokenAddressSync, NATIVE_MINT } from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import bs58 from "bs58";
import { config } from "dotenv";
import { PumpLaunchpad } from "../target/types/pump_launchpad";
config({ path: "./tests/.env" });

describe("pump-launchpad", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.PumpLaunchpad as Program<PumpLaunchpad>;

  const userKeypair = Keypair.fromSecretKey(
    bs58.decode(process.env.USER_PRIVATE_KEY!)
  );
  const user = userKeypair.publicKey;
  const feeRecipient = new PublicKey(
    "HxW4EmTr2WhvrKuxXjB5t5hEpftNebxw6mXsVxcYDMHT"
  );

  const launchId = 3;
  const launchIdBuffer = Buffer.alloc(4);
  launchIdBuffer.writeUInt32LE(launchId);

  const LAUNCH_SEED = "launch";
  const [launch] = PublicKey.findProgramAddressSync(
    [Buffer.from(LAUNCH_SEED), launchIdBuffer],
    program.programId
  );

  const ALLOCATION_SEED = "allocation";
  const buyer = new PublicKey("HtUaVzWiSNrrY2NSVKroE3883vnBfn8SMrLM2UxA2vDy");
  const [allocation] = PublicKey.findProgramAddressSync(
    [Buffer.from(ALLOCATION_SEED), buyer.toBuffer(), launchIdBuffer],
    program.programId
  );

  const logTxnSignature = (tx: string) => {
    console.log(
      "Your transaction signature",
      `https://explorer.solana.com/tx/${tx}?cluster=devnet`
    );
  };

  it.skip("Initialize", async () => {
    const tx = await program.methods.initialize().accounts({}).rpc();

    logTxnSignature(tx);
  });

  it.skip("Set Params", async () => {
    const args = {
      authority: program.provider.publicKey,
      feeRecipient,
      feeBasisPoints: 100,
      maxSupply: new BN(10 ** 11),
      creatorSupply: new BN(10 ** 10),
      price: new BN(10 ** 4),
      initialized: true,
    };
    const tx = await program.methods.setParams(args).accounts({}).rpc();

    logTxnSignature(tx);
  });

  it.skip("Create", async () => {
    const args = {
      name: "Test token#1",
      symbol: "TT1",
      uri: "",
    };
    const tx = await program.methods
      .create(args)
      .accounts({
        user,
        launch,
      })
      .rpc();

    logTxnSignature(tx);
  });

  it.skip("Buy", async () => {});

  it.skip("Sell", async () => {});

  it.skip("Claim", async () => {});

  it.skip("Withdraw", async () => {
    const associatedUser = getAssociatedTokenAddressSync(
      NATIVE_MINT,
      program.provider.publicKey
    );
    const associatedLaunch = getAssociatedTokenAddressSync(
      NATIVE_MINT,
      launch,
      true
    );

    const tx = await program.methods
      .withdraw()
      .accountsPartial({
        user: program.provider.publicKey,
        associatedUser,
        launch,
        associatedLaunch,
      })
      .rpc();

    logTxnSignature(tx);
  });

  it.skip("Deposit", async () => {
    const tokenMint = new PublicKey(
      "tzaQLuBPBrrqyvFatNVAkyuXbCNtkMxbAHac26vgpYb"
    );
    const associatedUser = getAssociatedTokenAddressSync(
      tokenMint,
      program.provider.publicKey
    );
    const associatedLaunch = getAssociatedTokenAddressSync(
      tokenMint,
      launch,
      true
    );

    const tx = await program.methods
      .deposit()
      .accountsPartial({
        user: program.provider.publicKey,
        allocation,
        associatedUser,
        launch,
        associatedLaunch,
        tokenMint,
      })
      .rpc();

    logTxnSignature(tx);
  });
});
