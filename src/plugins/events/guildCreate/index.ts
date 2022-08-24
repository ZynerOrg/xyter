import { Guild } from "discord.js";
import updatePresence from "../../../helpers/updatePresence";
import fetchGuild from "../../../helpers/fetchGuild";
import logger from "../../../middlewares/logger";
import { IEventOptions } from "../../../interfaces/EventOptions";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (guild: Guild) => {
  const { client } = guild;

  logger?.silly(`Added to guild: ${guild.name} (${guild.id})`);

  await fetchGuild(guild);
  await updatePresence(client);

  logger.silly(`guildCreate: ${guild}`);
};
