// 3rd party dependencies
import { GuildMember } from "discord.js";

// Dependencies
import updatePresence from "@helpers/updatePresence";
import dropUser from "@helpers/dropUser";
import logger from "@logger";
import leaveMessage from "./leaveMessage";
import audits from "./audits";

import prisma from "@root/database/prisma";

export default {
  name: "guildMemberRemove",
  async execute(member: GuildMember) {
    const { client, user, guild } = member;

    logger?.verbose(
      `Removed member: ${user.tag} (${user.id}) from guild: ${guild.name} (${guild.id})`
    );

    const guildMemberData = await prisma.guildMember.delete({
      where: {
        guildId_userId: { guildId: guild.id, userId: user.id },
      },
    });

    logger.silly(guildMemberData);

    await audits.execute(member);
    await leaveMessage.execute(member);
    await dropUser(user, guild);
    await updatePresence(client);
  },
};
