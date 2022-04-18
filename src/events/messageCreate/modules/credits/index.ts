import logger from "@logger";
import timeouts from "@schemas/timeout";
import { Message } from "discord.js";

import prisma from "@root/database/prisma";

import getModuleData from "@root/helpers/getModule";

export default {
  execute: async (message: Message) => {
    const { guild, author, content, channel } = message;

    if (guild == null) return;
    if (author.bot) return;
    if (channel?.type !== "GUILD_TEXT") return;

    const { id: guildId } = guild;
    const { id: userId } = author;

    const module = await getModuleData(guild.id, "credits");

    if (!module) return;

    if (module.minimumLength == null) return;
    if (module.timeout == null) return;
    if (module.rate == null) return;

    if (content.length < module.minimumLength) return;

    const timeoutData = {
      guildId,
      userId,
      timeoutId: "2022-04-14-13-51-00",
    };

    const timeout = await timeouts.findOne(timeoutData);

    if (timeout) {
      logger.verbose(
        `User ${userId} in guild ${guildId} is on timeout 2022-04-14-13-51-00`
      );
      return;
    }

    const guildMemberData = await prisma.guildMember.upsert({
      where: {
        guildId_userId: { guildId, userId },
      },
      update: { credits: { increment: module.rate as number } },
      create: {
        guildId,
        userId,
        credits: 1,
      },
    });

    logger.silly(guildMemberData);

    await timeouts
      .create(timeoutData)
      .then(async () => {
        logger.verbose(
          `Timeout 2022-04-14-13-51-00 for user ${userId} in guild ${guildId} has been created`
        );
      })
      .catch(async (err) => {
        logger.error(
          `Error creating timeout 2022-04-14-13-51-00 for user ${userId} in guild ${guildId}`,
          err
        );
      });

    setTimeout(async () => {
      await timeouts
        .deleteOne(timeoutData)
        .then(async () => {
          logger.verbose(
            `Timeout 2022-04-14-13-51-00 for user ${userId} in guild ${guildId} has been deleted`
          );
        })
        .catch(async (err) => {
          logger.error(
            `Error deleting timeout 2022-04-14-13-51-00 for user ${userId} in guild ${guildId}`,
            err
          );
        });
    }, module.timeout as number);
  },
};
