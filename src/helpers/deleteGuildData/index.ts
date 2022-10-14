import apiSchema from "../../models/api";
import counterSchema from "../../models/counter";
import guildSchema from "../../models/guild";
import shopRoleSchema from "../../models/shopRole";
import timeoutSchema from "../../models/timeout";
import userSchema from "../../models/user";

import logger from "../../middlewares/logger";

import { Guild } from "discord.js";

export default async (guild: Guild) => {
  await guildSchema
    .deleteMany({ guildId: guild.id })
    .then(async () => {
      return logger?.silly(`Deleted guild: ${guild.id}`);
    })
    .catch(async (error) => {
      logger?.error(`Error deleting guild: ${guild.id} - ${error}`);
    });

  await userSchema
    .deleteMany({ guildId: guild.id })
    .then(async () => {
      logger?.silly(`Deleted users for guild: ${guild.id} from database`);
    })
    .catch(async (error) => {
      logger?.error(`Error deleting users for guild: ${guild.id} - ${error}`);
    });

  await apiSchema
    .deleteMany({ guildId: guild.id })
    .then(async () => {
      logger?.silly(`Deleted apis for guild: ${guild.id} from database`);
    })
    .catch(async (error) => {
      logger?.error(`Error deleting apis for guild: ${guild.id} - ${error}`);
    });

  await counterSchema
    .deleteMany({ guildId: guild.id })
    .then(async () => {
      logger?.silly(`Deleted counters for guild: ${guild.id} from database`);
    })
    .catch(async (error) => {
      logger?.error(
        `Error deleting counters for guild: ${guild.id} - ${error}`
      );
    });

  await shopRoleSchema
    .deleteMany({ guildId: guild.id })
    .then(async () => {
      logger?.silly(`Deleted shop roles for guild: ${guild.id} from database`);
    })
    .catch(async (error) => {
      logger?.error(
        `Error deleting shop roles for guild: ${guild.id} - ${error}`
      );
    });

  await timeoutSchema
    .deleteMany({ guildId: guild.id })
    .then(async () => {
      logger?.silly(`Deleted timeouts for guild: ${guild.id} from database`);
    })
    .catch(async (error) => {
      logger?.error(
        `Error deleting timeouts for guild: ${guild.id} - ${error}`
      );
    });
};
