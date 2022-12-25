import { add, formatDuration, intervalToDuration } from "date-fns";
import { Guild, User } from "discord.js";
import prisma from "../../handlers/database";
import logger from "../logger";

export default async (
  guild: Guild,
  user: User,
  id: string,
  cooldown: number,
  silent?: boolean
) => {
  // Check if user has a timeout
  const isOnCooldown = await prisma.cooldown.findUnique({
    where: {
      guildId_userId_timeoutId: {
        guildId: guild.id,
        userId: user.id,
        timeoutId: id,
      },
    },
  });
  logger.silly(isOnCooldown);

  if (isOnCooldown) {
    const { userId, timeoutId, createdAt } = isOnCooldown;
    const dueDate = add(createdAt, { seconds: cooldown });

    const duration = formatDuration(
      intervalToDuration({
        start: new Date(),
        end: dueDate,
      })
    );

    if (silent) {
      return logger.verbose(
        `User ${userId} is on cooldown for ${timeoutId}, it ends in ${duration}.`
      );
    }

    throw new Error(
      `You need to wait for ${duration} before you can do that again`
    );
  }

  await prisma.cooldown.upsert({
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

  return setTimeout(async () => {
    await prisma.cooldown.delete({
      where: {
        guildId_userId_timeoutId: {
          guildId: guild.id,
          userId: user.id,
          timeoutId: id,
        },
      },
    });
  }, cooldown * 1000);
};
