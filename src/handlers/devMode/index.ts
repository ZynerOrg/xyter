import { Client } from "discord.js";
import logger from "../../middlewares/logger";

export default async (client: Client) => {
  if (process.env.NODE_ENV !== "production") {
    await client?.application?.commands
      ?.set([], process.env.DISCORD_GUILD_ID)
      .then(() => {
        return logger.verbose(`Development mode is disabled.`);
      });
  }

  return logger.info(`Development mode is enabled.`);
};
