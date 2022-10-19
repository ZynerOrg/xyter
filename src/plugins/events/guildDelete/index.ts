// 3rd party dependencies
import { Guild } from "discord.js";
// Dependencies
import dropGuild from "../../../helpers/deleteGuildData";
import updatePresence from "../../../helpers/updatePresence";
import { IEventOptions } from "../../../interfaces/EventOptions";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (guild: Guild) => {
  const { client } = guild;

  await dropGuild(guild);
  await updatePresence(client);
};
