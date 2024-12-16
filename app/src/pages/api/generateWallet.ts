import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import Agent from "src/models/agent";
import connectToDatabase from "src/utils/database";
import { encryptData } from "src/utils/helper";
import fs from "fs";

const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

type ResponseData = {
  walletPublicKey: string;
  message: string;
  tokenMetadata: {
    metadata: {
      createdOn: string;
      name: string;
      description: string;
      image: string;
      symbol: string;
      showName: boolean;
    };
    metadataUri: string;
  };
};

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

const parseForm = (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);

    // Create a new FormData instance
    const formData = new FormData();

    // Handle file upload
    const file = files.file?.[0];

    if (!file || !file.filepath || !file.originalFilename || !file.mimetype) {
      return res.status(400).json({ error: "File not found" });
    }

    const fileBlob = new Blob([fs.readFileSync(file.filepath)], {
      type: file.mimetype,
    });

    const name = fields.name?.[0];
    const symbol = fields.symbol?.[0];
    const description = fields.description?.[0];

    if (!name || !symbol || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Append form fields
    formData.append("file", fileBlob, file.originalFilename);
    formData.append("name", name);
    formData.append("symbol", symbol);
    formData.append("description", description);
    formData.append("twitter", "");
    formData.append("telegram", "");
    formData.append("website", "");
    formData.append("showName", "true");

    // Make a request to the external API
    const response = await fetch("https://pump.fun/api/ipfs", {
      method: "POST",
      body: formData as unknown as BodyInit,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload to IPFS: ${response.statusText}`);
    }
    const tokenMetadata = await response.json();

    await connectToDatabase();

    const agentKeypair = Keypair.generate();
    const dataToEncrypt = bs58.encode(agentKeypair.secretKey);

    const agentPrivateKey = encryptData(dataToEncrypt, encryptionKey);

    const walletPublicKey = agentKeypair.publicKey.toBase58();

    await Agent.create({
      walletPublicKey,
      name,
      symbol,
      description,
      imageUrl: tokenMetadata.metadata.image,
      metadataUri: tokenMetadata.metadataUri,
      encryptedWalletPrivateKey: agentPrivateKey.encryptedData,
      ivWalletPrivateKey: agentPrivateKey.iv,
      isInitialized: false,
    });

    return res.status(201).json({
      walletPublicKey,
      tokenMetadata,
      message: "Wallet created",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    console.error(errorMessage);
    return res.status(500).json({ error: errorMessage });
  }
}
