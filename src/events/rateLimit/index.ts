import { Client } from "discord.js";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../utils/logger";

export const options: IEventOptions = {
  type: "on",
};

export const execute = (client: Client) => {
  const clientTag = client?.user?.tag ?? "unknown";
  logger.info(`Discord API client (${clientTag}) is rate-limited.`);
};
