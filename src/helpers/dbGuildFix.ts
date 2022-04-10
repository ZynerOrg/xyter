// TODO This file will make sure that all guilds always has at least one entry in all collections with "guildId"

import apis from "./database/models/apiSchema";
import guilds from "./database/models/guildSchema";

import logger from "../handlers/logger";
import { Guild } from "discord.js";

export default async (guild: Guild) => {
  const api = await apis.findOne({ guildId: guild.id });
  const guildData = await guilds.findOne({ guildId: guild.id });
  if (!api) {
    apis.create({ guildId: guild.id });
    logger.debug(`Guild: ${guild.id} added api collection`);
  } else {
    logger.debug(`Guild: ${guild.id} already in api collection`);
  }
  if (!guildData) {
    guilds.create({ guildId: guild.id });
    logger.debug(`Guild: ${guild.id} added guild collection`);
  } else {
    logger.debug(`Guild: ${guild.id} already in guild collection`);
  }
};
