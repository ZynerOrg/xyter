// Dependencies
import { ButtonInteraction, CommandInteraction, Message } from "discord.js";
import addSeconds from "../../helpers/addSeconds";
import logger from "../../middlewares/logger";
import prisma from "../database";

export const command = async (i: CommandInteraction, cooldown: number) => {
  const { guild, user, commandId } = i;

  if (!guild) throw new Error("Guild not found");

  // Check if user has a timeout
  const hasTimeout = await prisma.cooldown.findUnique({
    where: {
      guildId_userId_timeoutId: {
        guildId: guild.id,
        userId: user.id,
        timeoutId: commandId,
      },
    },
  });

  logger.silly(hasTimeout);

  // If user is not on timeout
  if (hasTimeout) {
    const { guildId, userId, timeoutId, createdAt } = hasTimeout;
    const overDue = (await addSeconds(cooldown, createdAt)) < new Date();

    if (!overDue) {
      const diff = Math.round(
        (new Date(hasTimeout.createdAt).getTime() - new Date().getTime()) / 1000
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
          timeoutId: commandId,
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
        timeoutId: commandId,
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
      timeoutId: commandId,
      cooldown,
    },
  });

  logger.silly(createCooldown);
};

export const button = async (i: ButtonInteraction, cooldown: number) => {
  const { guild, user, customId } = i;

  if (!guild) throw new Error("Guild not found");

  // Check if user has a timeout
  const hasTimeout = await prisma.cooldown.findUnique({
    where: {
      guildId_userId_timeoutId: {
        guildId: guild.id,
        userId: user.id,
        timeoutId: customId,
      },
    },
  });

  logger.silly(hasTimeout);

  // If user is not on timeout
  if (hasTimeout) {
    const { guildId, userId, timeoutId, createdAt } = hasTimeout;
    const overDue = (await addSeconds(cooldown, createdAt)) < new Date();

    if (!overDue) {
      const diff = Math.round(
        (new Date(hasTimeout.createdAt).getTime() - new Date().getTime()) / 1000
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
          timeoutId: customId,
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
        timeoutId: customId,
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
      timeoutId: customId,
      cooldown,
    },
  });

  logger.silly(createCooldown);
};

export const message = async (msg: Message, cooldown: number, id: string) => {
  const { guild, member } = msg;

  if (!guild) throw new Error("Guild not found");
  if (!member) throw new Error("Member is undefined");

  // Check if user has a timeout
  const hasTimeout = await prisma.cooldown.findUnique({
    where: {
      guildId_userId_timeoutId: {
        guildId: guild.id,
        userId: member.id,
        timeoutId: id,
      },
    },
  });

  logger.silly(hasTimeout);

  // If user is not on timeout
  if (hasTimeout) {
    const { guildId, userId, timeoutId, createdAt } = hasTimeout;
    const overDue = (await addSeconds(cooldown, createdAt)) < new Date();

    if (!overDue) {
      const diff = Math.round(
        (new Date(hasTimeout.createdAt).getTime() - new Date().getTime()) / 1000
      );

      return `User: ${userId} on timeout-id: ${id} with cooldown: ${cooldown} secs with remaining: ${diff} secs.`;
    }

    // Delete timeout
    const deleteCooldown = await prisma.cooldown.delete({
      where: {
        guildId_userId_timeoutId: {
          guildId: guild.id,
          userId: member.id,
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
        userId: member.id,
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
            id: member.id,
          },
          where: {
            id: member.id,
          },
        },
      },
      timeoutId: id,
      cooldown,
    },
  });

  logger.silly(createCooldown);
};
