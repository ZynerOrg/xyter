import { Guild, User } from "discord.js";
import prisma from "../../handlers/database";
import addSeconds from "../../helpers/addSeconds";
import logger from "../logger";

export default async (
  guild: Guild,
  user: User,
  id: string,
  cooldown: number,
  silent?: boolean
) => {
  // Check if user has a timeout
  const hasTimeout = await prisma.cooldown.findUnique({
    where: {
      guildId_userId_timeoutId: {
        guildId: guild.id,
        userId: user.id,
        timeoutId: id,
      },
    },
  });

  logger.silly(hasTimeout);

  // If user is not on timeout
  if (hasTimeout) {
    const { userId, timeoutId, createdAt } = hasTimeout;
    const overDue = addSeconds(cooldown, createdAt) < new Date();

    if (!overDue) {
      const diff = Math.round(
        (new Date(hasTimeout.createdAt).getTime() - new Date().getTime()) / 1000
      );

      if (silent)
        return logger.verbose(
          `User ${userId} is on cooldown for ${timeoutId} for ${diff} seconds`
        );

      throw new Error(
        `You must wait ${diff} seconds before using this command.`
      );
    }

    // Delete timeout
    const deleteCooldown = await prisma.cooldown.delete({
      where: {
        guildId_userId_timeoutId: {
          guildId: guild.id,
          userId: user.id,
          timeoutId: id,
        },
      },
    });

    logger.silly(deleteCooldown);

    logger.debug(
      `Timeout document ${timeoutId} has been deleted from user ${userId}.`
    );
  }

  // Create timeout
  const createCooldown = await prisma.cooldown.upsert({
    where: {
      guildId_userId_timeoutId: {
        userId: user.id,
        guildId: guild.id,
        timeoutId: id,
      },
    },
    update: {},
    create: {
      guild: {
        connectOrCreate: {
          create: {
            id: guild.id,
          },
          where: {
            id: guild.id,
          },
        },
      },
      user: {
        connectOrCreate: {
          create: {
            id: user.id,
          },
          where: {
            id: user.id,
          },
        },
      },
      timeoutId: id,
      cooldown,
    },
  });

  logger.silly(createCooldown);
};
