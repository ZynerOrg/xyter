// 3rd party dependencies
import { Guild } from "discord.js";
// Dependencies
import dropGuild from "../../../helpers/deleteGuildData";
import updatePresence from "../../../helpers/updatePresence";
import { IEventOptions } from "../../../interfaces/EventOptions";
import logger from "../../../middlewares/logger";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (guild: Guild) => {
  const { client } = guild;

  logger?.silly(`Deleted from guild: ${guild.name} (${guild.id})`);

  await dropGuild(guild);
  await updatePresence(client);

  logger.silly(`guildDelete: ${guild}`);
};
