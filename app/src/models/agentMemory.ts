import mongoose from "mongoose";

const agentMemorySchema = new mongoose.Schema(
  {
    agentId: {
      type: String,
      required: true,
    },
    tokenMint: {
      type: String,
      required: true,
    },
    wallet: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    shouldExecute: {
      type: String,
      required: true,
    },
    holding: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    signature: { type: String, required: false },
  },
  { timestamps: true }
);

const AgentMemory =
  mongoose.models.AgentMemory ||
  mongoose.model("AgentMemory", agentMemorySchema);

export default AgentMemory;
