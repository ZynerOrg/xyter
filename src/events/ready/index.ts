// Dependencies
import { Client } from "discord.js";
// Helpers
import deployCommands from "../../handlers/deployCommands";
import devMode from "../../handlers/devMode";
import updatePresence from "../../handlers/updatePresence";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../middlewares/logger";

export const options: IEventOptions = {
  type: "once",
};

// Execute the event
export const execute = async (client: Client) => {
  logger.info("Discord's API client is ready!");

  updatePresence(client);
  await devMode(client);
  await deployCommands(client);
};
