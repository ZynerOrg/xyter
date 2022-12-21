import { ChannelType, Message } from "discord.js";
import prisma from "../../../../handlers/database";
import logger from "../../../../middlewares/logger";

export default async (message: Message) => {
  const { guild, author, content, channel } = message;

  if (!guild) return;
  if (author.bot) return;
  if (channel?.type !== ChannelType.GuildText) return;

  const messages = await message.channel.messages.fetch({ limit: 2 });
  const lastMessage = messages.last();

  const channelCounter = await prisma.guildCounters.findUnique({
    where: {
      guildId_channelId: {
        guildId: guild.id,
        channelId: channel.id,
      },
    },
  });

  if (!channelCounter) {
    logger.debug("No counters found in channel.");
    return;
  }

  if (
    lastMessage?.author.id === author.id &&
    channel.id === channelCounter.channelId
  ) {
    logger.silly(
      `${author.username} sent the last message therefor not allowing again.`
    );
    await message.delete();
    return;
  }

  if (content !== channelCounter.triggerWord) {
    logger.silly(
      `Counter word ${channelCounter.triggerWord} does not match message ${content}`
    );

    await message.delete();
    return;
  }

  const updateGuildCounter = await prisma.guildCounters.update({
    where: {
      guildId_channelId: {
        guildId: guild.id,
        channelId: channel.id,
      },
    },
    data: {
      count: {
        increment: 1,
      },
    },
  });

  logger.silly(updateGuildCounter);

  if (!updateGuildCounter)
    logger.error(`Failed to update counter - ${updateGuildCounter}`);
};
