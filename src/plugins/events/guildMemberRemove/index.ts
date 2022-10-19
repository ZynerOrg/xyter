// 3rd party dependencies
import { GuildMember } from "discord.js";
import prisma from "../../../handlers/database";
import updatePresence from "../../../handlers/updatePresence";
import { IEventOptions } from "../../../interfaces/EventOptions";
import logger from "../../../middlewares/logger";
import audits from "./audits";
import leaveMessage from "./leaveMessage";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (member: GuildMember) => {
  const { client, user, guild } = member;

  logger?.silly(
    `Removed member: ${user.tag} (${user.id}) from guild: ${guild.name} (${guild.id})`
  );

  await audits.execute(member);
  await leaveMessage.execute(member);
  await updatePresence(client);

  // Delete guildMember object
  const deleteGuildMember = await prisma.guildMember.deleteMany({
    where: {
      userId: user.id,
      guildId: guild.id,
    },
  });

  logger.silly(deleteGuildMember);
};
