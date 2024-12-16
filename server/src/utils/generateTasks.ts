import Agent from "../models/agent";
import { generateRandomInterval } from "./helper";

const generateTasks = async () => {
  const agents = await Agent.find({ isInitialized: true });

  const tasks = new Map<number, string>();
  const currentTime = Date.now();

  for (const [index, agent] of agents.entries()) {
    // Generate a random number between 40 to 60 mins in secs
    const randomInterval = generateRandomInterval();

    const nextExecutionTime = agent.lastExecutedAt
      ? agent.lastExecutedAt + randomInterval
      : currentTime + index * 10;

    tasks.set(nextExecutionTime, agent._id.toString());
  }
  return tasks;
};
export default generateTasks;
