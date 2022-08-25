// Dependencies
import { Client } from "discord.js";
import logger from "../../../middlewares/logger";

// Helpers
import deployCommands from "../../../handlers/deployCommands";
import devMode from "../../../handlers/devMode";
import updatePresence from "../../../helpers/updatePresence";
import { IEventOptions } from "../../../interfaces/EventOptions";

export const options: IEventOptions = {
  type: "once",
};

export const execute = async (client: Client) => {
  logger.info("Discord's API client is ready!");

  await updatePresence(client);
  await devMode(client);
  await deployCommands(client);
};
