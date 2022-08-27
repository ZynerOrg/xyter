import { Guild } from "discord.js";
import fetchGuild from "../../../helpers/fetchGuild";
import updatePresence from "../../../helpers/updatePresence";
import { IEventOptions } from "../../../interfaces/EventOptions";
import logger from "../../../middlewares/logger";

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
