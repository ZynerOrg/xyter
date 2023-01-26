import { ChannelType, Message } from "discord.js";
import prisma from "../../../handlers/prisma";
import logger from "../../../middlewares/logger";

export default async (message: Message) => {
  const { guild, author, content, channel } = message;

  if (!guild) return;
  if (author.bot) return;
  if (channel?.type !== ChannelType.GuildText) return;

  const counter = await prisma.guildCounters.findUnique({
    where: {
      guildId_channelId: {
        guildId: guild.id,
        channelId: channel.id,
      },
    },
  });

  if (!counter) {
    logger.debug({
      message: `Channel: ${channel.name} (${channel.id}) in guild: ${guild.name} (${guild.id}) has no counter`,
      channel,
      guild,
      counter,
    });
    return;
  }

  const messages = await message.channel.messages.fetch({ limit: 2 });
  const lastMessage = messages.last();
  if (!lastMessage) {
    logger.error({
      message: `Failed to get last message in channel: ${channel.name} (${channel.id}) in guild ${guild.name} (${guild.id})`,
      channel,
      guild,
      messages,
      counter,
    });
    return;
  }

  if (lastMessage.author.id === author.id && channel.id === counter.channelId) {
    logger.verbose({
      message: `Message sent by user: ${author.tag} (${author.id}) ${author.username} was deleted since nobody else wrote in the counter channel since last message`,
      author,
      channel,
      lastMessage,
      counter,
    });

    await message.delete();
    return;
  }

  if (content !== counter.triggerWord) {
    logger.verbose({
      message: `Message sent by user: ${author.tag} (${author.id}) ${author.username} was deleted since it did not match the trigger word: ${counter.triggerWord}`,
      author,
      channel,
      lastMessage,
      counter,
    });

    await message.delete();
    return;
  }

  await prisma.guildCounters.update({
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
};
