import { Guild } from "discord.js";
import fetchGuild from "../../../helpers/guildData";
import updatePresence from "../../../helpers/updatePresence";
import { IEventOptions } from "../../../interfaces/EventOptions";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (guild: Guild) => {
  const { client } = guild;

  await fetchGuild(guild);
  await updatePresence(client);
};
