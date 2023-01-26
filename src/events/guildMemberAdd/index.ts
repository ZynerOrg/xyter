// 3rd party dependencies
import { GuildMember } from "discord.js";
import upsertGuildMember from "../../helpers/upsertGuildMember";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../middlewares/logger";
import sendAuditEntry from "./components/sendAuditEntry";
import sendJoinMessage from "./components/sendJoinMessage";

export const options: IEventOptions = {
  type: "on",
};

// Execute the function
export const execute = async (member: GuildMember) => {
  const { user, guild } = member;

  logger.verbose({
    message: `User: ${user.tag} (${user.id}) joined guild: ${guild.name} (${guild.id})`,
    guild,
    user,
  });

  await sendAuditEntry(member);
  await sendJoinMessage(member);

  await upsertGuildMember(guild, user);
};
