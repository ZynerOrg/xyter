// 3rd party dependencies
import { GuildMember } from "discord.js";
import prisma from "../../handlers/prisma";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../middlewares/logger";
import sendAuditEntry from "./components/sendAuditEntry";
import sendLeaveMessage from "./components/sendLeaveMessage";

export const options: IEventOptions = {
  type: "on",
};

// Execute the function
export const execute = async (member: GuildMember) => {
  const { user, guild } = member;

  logger.verbose({
    message: `User: ${user.tag} (${user.id}) left guild: ${guild.name} (${guild.id})`,
    guild,
    user,
  });

  await sendAuditEntry(member);
  await sendLeaveMessage(member);

  await prisma.guildMember.delete({
    where: {
      userId_guildId: {
        userId: user.id,
        guildId: guild.id,
      },
    },
  });
};
