import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';

const MEMO_PROGRAM_ID = new PublicKey(
  'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
);

export const connection = new Connection(process.env.NEXT_PUBLIC_RPC!);

export const buildAuthTx = (nonce: string): Transaction => {
  const tx = new Transaction();
  tx.add(
    new TransactionInstruction({
      programId: MEMO_PROGRAM_ID,
      keys: [],
      data: Buffer.from(nonce, 'utf8'),
    })
  );
  return tx;
};

export const validateAuthTx = (tx: Transaction, nonce: string): boolean => {
  try {
    const inx = tx.instructions.filter(
      (data) => data.programId.toBase58() == MEMO_PROGRAM_ID.toBase58()
    )[0];

    if (!inx.programId.equals(MEMO_PROGRAM_ID)) return false;
    if (inx.data.toString() != nonce) return false;
    if (!tx.verifySignatures()) return false;
  } catch (e) {
    return false;
  }
  return true;
};

type SignMessage = {
  domain: string;
  publicKey: string;
  nonce: string;
  statement: string;
};

export class SigninMessage {
  domain: any;
  publicKey: any;
  nonce: any;
  statement: any;

  constructor({ domain, publicKey, nonce, statement }: SignMessage) {
    this.domain = domain;
    this.publicKey = publicKey;
    this.nonce = nonce;
    this.statement = statement;
  }

  prepare() {
    return `${this.statement}${this.nonce}`;
  }

  async validate(signature: string) {
    const msg = this.prepare();
    const signatureUint8 = bs58.decode(signature);
    const msgUint8 = new TextEncoder().encode(msg);
    const pubKeyUint8 = bs58.decode(this.publicKey);

    return nacl.sign.detached.verify(msgUint8, signatureUint8, pubKeyUint8);
  }
}
