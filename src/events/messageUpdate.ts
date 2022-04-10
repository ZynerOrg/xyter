import counters from "../helpers/database/models/counterSchema";
import { Message } from "discord.js";
export default {
  name: "messageUpdate",
  async execute(oldMessage: Message, newMessage: Message) {
    // If message author is bot
    if (newMessage.author.bot) return;

    // Get counter object
    const counter = await counters.findOne({
      guildId: newMessage.guild?.id,
      channelId: newMessage.channel.id,
    });

    // If counter for the message channel
    if (counter) {
      // If message content is not strictly the same as counter word
      if (newMessage.content !== counter.word) {
        // Delete the message
        await newMessage.delete();
        await newMessage.channel.send(
          `${newMessage.author} said **${counter.word}**.`
        );
      }
    }
  },
};
