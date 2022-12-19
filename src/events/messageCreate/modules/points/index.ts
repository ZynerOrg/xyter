import { ChannelType, Message } from "discord.js";
import prisma from "../../../../handlers/database";
import cooldown from "../../../../middlewares/cooldown";
import logger from "../../../../middlewares/logger";

export default {
  execute: async (message: Message) => {
    const { guild, author, content, channel } = message;

    if (!guild) return;
    if (author.bot) return;
    if (channel.type !== ChannelType.GuildText) return;

    const upsertGuildConfigPoints = await prisma.guildConfigPoints.upsert({
      where: {
        id: guild.id,
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
      },
      include: {
        guild: true,
      },
    });

    logger.silly(upsertGuildConfigPoints);

    if (content.length < upsertGuildConfigPoints.minimumLength) return;

    await cooldown(
      guild,
      author,
      "event-messageCreate-points",
      upsertGuildConfigPoints.timeout,
      true
    );

    const updateGuildMember = await prisma.guildMember.update({
      where: {
        userId_guildId: {
          userId: author.id,
          guildId: guild.id,
        },
      },
      data: {
        pointsEarned: {
          increment: upsertGuildConfigPoints.rate,
        },
      },
    });

    logger.silly(updateGuildMember);

    if (!updateGuildMember)
      throw new Error("Failed to update guildMember object");
  },
};
