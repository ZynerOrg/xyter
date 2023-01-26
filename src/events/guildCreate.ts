import { Guild } from "discord.js";
import upsertGuildMember from "../helpers/upsertGuildMember";
import { IEventOptions } from "../interfaces/EventOptions";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (guild: Guild) => {
  const guildMember = await guild.fetchOwner();
  await upsertGuildMember(guild, guildMember.user);
};
