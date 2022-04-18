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

    if (content.length < module.minimumLength) return;

    const timeoutData = {
      guildId,
      userId,
      timeoutId: "2022-04-14-14-15-00",
    };

    const timeout = await timeouts.findOne(timeoutData);

    if (timeout) {
      logger.verbose(
        `User ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id} is on timeout 2022-04-14-14-15-00`
      );
      return;
    }

    const guildMemberData = await prisma.guildMember.upsert({
      where: {
        guildId_userId: { guildId, userId },
      },
      update: { points: { increment: 1 } },
      create: {
        guildId,
        userId,
        points: 1,
      },
    });

    logger.silly(guildMemberData);

    await timeouts
      .create(timeoutData)
      .then(async () => {
        logger.verbose(
          `Successfully created timeout for user ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`
        );
      })
      .catch(async (err) => {
        logger.error(
          `Error creating timeout 2022-04-14-14-15-00 for user ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`,
          err
        );
      });

    setTimeout(async () => {
      await timeouts
        .deleteOne(timeoutData)
        .then(async () => {
          logger.verbose(
            `Successfully deleted timeout 2022-04-14-14-15-00 for user ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`
          );
        })
        .catch(async (err) => {
          logger.error(
            `Error deleting timeout 2022-04-14-14-15-00 for user ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`,
            err
          );
        });
    }, module.timeout as number);
  },
};
