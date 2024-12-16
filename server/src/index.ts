import {
  agentListener,
  connectToDatabase,
  generateTasks,
  // migrateTokens,
  taskWorker,
} from "./utils";
import { config } from "dotenv";
config();

const main = async () => {
  await connectToDatabase();

  // // Migrate tokens to pumpfun
  // await migrateTokens();

  // Generate a queue of all the tasks to execute
  const tasks = await generateTasks();

  // Listener to add new tasks to the queue
  await agentListener(tasks);

  // Worker to execute the tasks
  await taskWorker(tasks);
};
main();
