import { ChannelType, Message } from "discord.js";
import prisma from "../../../handlers/prisma";
import logger from "../../../middlewares/logger";

export default async (message: Message) => {
  const { guild, channel, author } = message;

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

  await channel.send(
    `${author} deleted his message saying: **${counter.triggerWord}**.`
  );
  return;
};
