import guilds from "../helpers/database/models/guildSchema";
import users from "../helpers/database/models/userSchema";
import apis from "../helpers/database/models/apiSchema";
import counters from "../helpers/database/models/counterSchema";
import shopRoles from "../helpers/database/models/shopRolesSchema";
import timeouts from "../helpers/database/models/timeoutSchema";

import logger from "../handlers/logger";

import { Guild } from "discord.js";

export default {
  name: "guildDelete",
  async execute(guild: Guild) {
    // Destructure client
    const { client } = guild;

    guilds
      .deleteMany({ guildId: guild.id })
      .then(async () => {
        logger.debug(`Successfully deleted guild: ${guild.id}`);
      })
      .catch(async (e) => {
        logger.error(`Failed to delete guild: ${guild.id} ${e}`);
      });
    users
      .deleteMany({ guildId: guild.id })
      .then(async () => {
        logger.debug(`Successfully deleted guild: ${guild.id}'s users`);
      })
      .catch(async (e) => {
        logger.error(`Failed to delete guild: ${guild.id}'s users ${e}`);
      });
    apis
      .deleteMany({ guildId: guild.id })
      .then(async () => {
        logger.debug(`Successfully deleted guild: ${guild.id}'s apis`);
      })
      .catch(async (e) => {
        logger.error(`Failed to delete guild: ${guild.id}'s apis ${e}`);
      });
    counters
      .deleteMany({ guildId: guild.id })
      .then(async () => {
        logger.debug(`Successfully deleted guild: ${guild.id}'s counters`);
      })
      .catch(async (e) => {
        logger.error(`Failed to delete guild: ${guild.id}'s counters ${e}`);
      });
    shopRoles
      .deleteMany({ guildId: guild.id })
      .then(async () => {
        logger.debug(`Successfully deleted guild: ${guild.id}'s shop roles`);
      })
      .catch(async (e) => {
        logger.error(`Failed to delete guild: ${guild.id}'s shop roles ${e}`);
      });
    timeouts
      .deleteMany({ guildId: guild.id })
      .then(async () => {
        logger.debug(`Successfully deleted guild: ${guild.id}'s timeouts`);
      })
      .catch(async (e) => {
        logger.error(`Failed to delete guild: ${guild.id}'s timeouts ${e}`);
      });

    // Set client status
    await client?.user?.setPresence({
      activities: [
        { type: "WATCHING", name: `${client.guilds.cache.size} guilds` },
      ],
      status: "online",
    });
  },
};
