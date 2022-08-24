// Dependencies
import { Guild } from "discord.js";

// Models
import guildSchema from "../../models/guild";

// Handlers
import logger from "../../middlewares/logger";

// Function
export default async (guild: Guild) => {
  const guildObj = await guildSchema?.findOne({ guildId: guild.id });
  if (guildObj === null) {
    const newGuildObj = new guildSchema({ guildId: guild.id });

    await newGuildObj
      .save()
      .then(async () => {
        logger?.silly(`Created guild: ${guild.id}`);
      })
      .catch(async (error) => {
        logger?.error(`Error creating guild: ${guild.id} - ${error}`);
      });

    return newGuildObj;
  } else {
    return guildObj;
  }
};
