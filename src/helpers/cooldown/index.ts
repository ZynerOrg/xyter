// Dependencies
import { ButtonInteraction, CommandInteraction, Message } from "discord.js";

import logger from "../../middlewares/logger";

import addSeconds from "../../helpers/addSeconds";
import timeoutSchema from "../../models/timeout";

export const command = async (i: CommandInteraction, cooldown: number) => {
  const { guild, user, commandId } = i;

  // Check if user has a timeout
  const hasTimeout = await timeoutSchema.findOne({
    guildId: guild?.id || "0",
    userId: user.id,
    cooldown: cooldown,
    timeoutId: commandId,
  });

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
    await timeoutSchema
      .deleteOne({
        guildId,
        userId,
        timeoutId,
        cooldown,
      })
      .then(async () => {
        logger.debug(
          `Timeout document ${timeoutId} has been deleted from user ${userId}.`
        );
      });
  }
  // Create timeout
  await timeoutSchema.create({
    guildId: guild?.id || "0",
    userId: user.id,
    cooldown: cooldown,
    timeoutId: commandId,
  });
};

export const button = async (i: ButtonInteraction, cooldown: number) => {
  const { guild, user, customId } = i;

  // Check if user has a timeout
  const hasTimeout = await timeoutSchema.findOne({
    guildId: guild?.id || "0",
    userId: user.id,
    cooldown: cooldown,
    timeoutId: customId,
  });

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
    await timeoutSchema
      .deleteOne({
        guildId,
        userId,
        timeoutId,
        cooldown,
      })
      .then(async () => {
        logger.debug(
          `Timeout document ${timeoutId} has been deleted from user ${userId}.`
        );
      });
  }
  // Create timeout
  await timeoutSchema.create({
    guildId: guild?.id || "0",
    userId: user.id,
    cooldown: cooldown,
    timeoutId: customId,
  });
};

export const message = async (msg: Message, cooldown: number, id: string) => {
  const { guild, member } = msg;
  if (!guild) throw new Error("Guild is undefined");
  if (!member) throw new Error("Member is undefined");

  // Check if user has a timeout
  const hasTimeout = await timeoutSchema.findOne({
    guildId: guild?.id || "0",
    userId: member.id,
    cooldown: cooldown,
    timeoutId: id,
  });

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
    await timeoutSchema
      .deleteOne({
        guildId,
        userId: member.id,
        timeoutId: id,
        cooldown,
      })
      .then(async () => {
        logger.debug(
          `Timeout document ${timeoutId} has been deleted from user ${userId}.`
        );
      });
  }
  // Create timeout
  await timeoutSchema.create({
    guildId: guild?.id || "0",
    userId: member.id,
    cooldown: cooldown,
    timeoutId: id,
  });
};
