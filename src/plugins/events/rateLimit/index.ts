// Dependencies
import { Client } from "discord.js";
// Helpers
import { IEventOptions } from "../../../interfaces/EventOptions";
import logger from "../../../middlewares/logger";

export const options: IEventOptions = {
  type: "on",
};

export const execute = (client: Client) => {
  logger.warn(`Discord's API client (${client?.user?.tag}) is rate-limited!`);
};
