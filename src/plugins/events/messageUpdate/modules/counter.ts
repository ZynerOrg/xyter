// Dependencies
import { Message } from "discord.js";

// Models
import logger from "../../../../middlewares/logger";
import counterSchema from "../../../../models/counter";

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
  if (content === word)
    return logger?.silly(
      `User: ${author?.tag} (${author?.id}) in guild: ${guild?.name} (${guild?.id}) said the counter word: ${word}`
    );

  await message
    ?.delete()
    ?.then(async () => {
      await channel?.send(`${author} said **${word}**.`);
      logger?.silly(`${author} said ${word} in ${channel}`);
    })
    ?.catch(async (error) => {
      logger?.error(error);
    });
};
