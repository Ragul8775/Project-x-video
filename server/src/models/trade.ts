import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema(
  {
    agentId: {
      type: String,
      required: true,
    },
    tokenMint: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    txn: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Trade = mongoose.models.Trade || mongoose.model("Trade", TradeSchema);
export default Trade;
