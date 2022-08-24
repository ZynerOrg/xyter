// Dependencies
import { Message } from "discord.js";

// Models
import counterSchema from "../../../../models/counter";
import logger from "../../../../middlewares/logger";

export default async (message: Message) => {
  const { guild, channel, author, content } = message;

  const counter = await counterSchema?.findOne({
    guildId: guild?.id,
    channelId: channel?.id,
  });

  if (counter === null)
    return logger?.silly(
      `No counter found for guild: ${guild?.name} (${guild?.id})`
    );
  const { word } = counter;

  const messages = await message.channel.messages.fetch({ limit: 1 });
  const lastMessage = messages.last();

  if (!lastMessage) return;

  if (content !== word) return;

  if (lastMessage.author.id === message.author.id) return;

  channel?.send(`${author} said **${word}**.`);
  logger?.silly(`${author} said ${word} in ${channel}`);
  return logger?.silly(
    `User: ${author?.tag} (${author?.id}) in guild: ${guild?.name} (${guild?.id}) said the counter word: ${word}`
  );
};
