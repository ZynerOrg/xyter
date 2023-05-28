import { GuildMember } from "discord.js";
import prisma from "../../handlers/prisma";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../utils/logger";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (member: GuildMember) => {
  const { user, guild } = member;

  try {
    await prisma.guildMember.delete({
      where: {
        guildId_userId: {
          guildId: guild.id,
          userId: user.id,
        },
      },
    });
  } catch (error) {
    logger.error(`Error deleting guild member: ${error}`);
    // Handle the error appropriately (e.g., sending an error message, etc.)
  }
};
