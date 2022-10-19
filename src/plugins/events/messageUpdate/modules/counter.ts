// Dependencies
import { Message } from "discord.js";
// Models
import prisma from "../../../../handlers/database";
import logger from "../../../../middlewares/logger";

export default async (message: Message) => {
  const { guild, channel, author, content } = message;

  if (!guild) throw new Error("Guild not found");

  if (!channel) throw new Error("Channel not found");

  const channelCounter = await prisma.guildCounter.findUnique({
    where: {
      guildId_channelId: {
        guildId: guild.id,
        channelId: channel.id,
      },
    },
  });

  if (!channelCounter) throw new Error("No counters found in channel.");

  if (content === channelCounter.triggerWord)
    return logger?.silly(
      `User: ${author?.tag} (${author?.id}) in guild: ${guild?.name} (${guild?.id}) said the counter word: ${channelCounter.triggerWord}`
    );

  await message
    .delete()
    .then(async () => {
      await channel?.send(`${author} said **${channelCounter.triggerWord}**.`);
      logger?.silly(
        `${author} said ${channelCounter.triggerWord} in ${channel}`
      );
    })
    .catch((error) => {
      logger.error(error);
    });
};
