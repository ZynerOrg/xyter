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

    const createGuildMember = await prisma.guildMember.upsert({
      where: {
        userId_guildId: {
          userId: author.id,
          guildId: guild.id,
        },
      },
      update: {},
      create: {
        user: {
          connectOrCreate: {
            create: {
              id: author.id,
            },
            where: {
              id: author.id,
            },
          },
        },
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
        user: true,
        guild: true,
      },
    });

    logger.silly(createGuildMember);

    if (content.length < createGuildMember.guild.pointsMinimumLength) return;

    await cooldown(
      guild,
      author,
      "event-messageCreate-points",
      createGuildMember.guild.pointsTimeout,
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
          increment: createGuildMember.guild.pointsRate,
        },
      },
    });

    logger.silly(updateGuildMember);

    if (!updateGuildMember)
      throw new Error("Failed to update guildMember object");
  },
};
