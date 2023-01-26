// Dependencies
import { Client } from "discord.js";
// Helpers
import deployCommands from "../handlers/deployCommands";
import updatePresence from "../helpers/updatePresence";
import { IEventOptions } from "../interfaces/EventOptions";
import logger from "../middlewares/logger";

export const options: IEventOptions = {
  type: "once",
};

// Execute the event
export const execute = async (client: Client) => {
  if (!client.user) throw new Error("Client user unavailable");

  logger.info({
    message: `Connected to Discord!`,
  });

  updatePresence(client);
  await deployCommands(client);
};
