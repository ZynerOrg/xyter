/* eslint-disable no-loops/no-loops */
import { Client } from "discord.js";
import registerCommands from "../../handlers/registerCommands";
import updatePresence from "../../handlers/updatePresence";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../utils/logger";
import importOldData from "./importOldData";

export const options: IEventOptions = {
  type: "once",
};

export const execute = async (client: Client) => {
  if (!client.user) {
    logger.error("Client user unavailable");
    throw new Error("Client user unavailable");
  }

  logger.info("Connected to Discord!");

  updatePresence(client);
  await registerCommands(client);

  if (process.env.IMPORT_DATA_FROM_V1 === "true") {
    await importOldData(client);
  }
};
