import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "src/utils/database";
import Agent from "src/models/agent";

type Agent = {
  id: string;
  name: string;
  symbol: string;
  imageUrl: string;
  description: string;
  creatorWallet: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Agent[] | { message: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    const agents = await Agent.find({ isInitialized: true })
      .select("launchId name symbol imageUrl description creatorWallet twitterUsername") // Inclusive projection
      .lean();

    const typedAgents = agents.map((agent) => ({
      id: agent.launchId,
      name: agent.name,
      symbol: agent.symbol,
      imageUrl: agent.imageUrl,
      description: agent.description,
      creatorWallet: agent.creatorWallet,
      agentTwitter: agent.twitterUsername 
    }));

    return res.status(200).json(typedAgents);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching agents" });
  }
}
