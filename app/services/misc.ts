import { PastRequest } from "./db";

export const calculatePromptWeightage = (
  balances: number,
  pastRequests: PastRequest[],
  type: string
) => {
  // Example logic: Use wallet balance to prioritize prompts

  let buyWeight = 0;
  let sellWeight = 0;
  let userWeight = balances / Number(Math.pow(10, 8));

  if (type == "BUY") buyWeight += userWeight;
  else sellWeight += userWeight;

  pastRequests.reduce(
    (weights, doc) => {
      if (doc.type === "buy") {
        weights.buyWeight += doc.holding;
      } else if (doc.type === "sell") {
        weights.sellWeight += doc.holding;
      }
      return weights;
    },
    { buyWeight: 0, sellWeight: 0 } // Initial weights
  );

  return {
    buyWeight,
    sellWeight,
    weight: userWeight,
  };
};
