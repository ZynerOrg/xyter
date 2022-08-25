import { ChannelType, Message } from "discord.js";

import logger from "../../../../../middlewares/logger";
import counterSchema from "../../../../../models/counter";

export default {
  execute: async (message: Message) => {
    const { guild, author, content, channel } = message;

    if (!guild) return;
    if (author.bot) return;
    if (channel?.type !== ChannelType.GuildText) return;

    const messages = await message.channel.messages.fetch({ limit: 2 });
    const lastMessage = messages.last();

    const { id: guildId } = guild;
    const { id: channelId } = channel;

    const counter = await counterSchema.findOne({
      guildId,
      channelId,
    });

    if (counter === null) {
      logger.silly(
        `No counter found for guild ${guildId} and channel ${channelId}`
      );
      return;
    }

    if (
      lastMessage?.author.id === author.id &&
      channel.id === counter.channelId
    ) {
      logger.silly(
        `${author.username} sent the last message therefor not allowing again.`
      );
      await message.delete();
      return;
    }

    if (content !== counter.word) {
      logger.silly(
        `Counter word ${counter.word} does not match message ${content}`
      );

      await message.delete();
      return;
    }

    counter.counter += 1;
    await counter
      .save()
      .then(async () => {
        logger.silly(
          `Counter for guild ${guildId} and channel ${channelId} is now ${counter.counter}`
        );
      })
      .catch(async (err) => {
        logger.error(
          `Error saving counter for guild ${guildId} and channel ${channelId}`,
          err
        );
      });

    logger.silly(
      `Counter word ${counter.word} was found in message ${content} from ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`
    );
  },
};
