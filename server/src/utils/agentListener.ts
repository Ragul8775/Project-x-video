import Agent from "../models/agent";

const agentListener = async (existingsTasks: Map<number, string>) => {
  const changeStream = Agent.watch();

  changeStream.on("change", async (change) => {
    const { operationType, documentKey, updateDescription } = change;
    if (operationType === "insert") return;

    const agentId = documentKey._id.toString();

    if (!updateDescription?.updatedFields?.isInitialized) return;
    if (existingsTasks.has(agentId)) return;

    const currentTime = Date.now();
    existingsTasks.set(currentTime, agentId);
  });

  changeStream.on("error", (error) => {
    console.log("Change stream error:", error);
  });

  changeStream.on("close", () => {
    console.log("Change stream closed");
  });
};

export default agentListener;
