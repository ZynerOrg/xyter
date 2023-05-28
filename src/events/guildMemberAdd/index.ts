import { GuildMember } from "discord.js";
import handleGuildMemberJoin from "../../handlers/handleGuildMemberJoin";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../utils/logger";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (member: GuildMember) => {
  const { user, guild } = member;

  logger.info({
    message: `User: ${user.tag} (${user.id}) joined guild: ${guild.name} (${guild.id})`,
    guild,
    user,
  });

  await handleGuildMemberJoin(guild, user);
};
