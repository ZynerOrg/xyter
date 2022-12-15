/* eslint-disable no-loops/no-loops */
import { EmbedBuilder, Message } from "discord.js";
import auditLogger from "../../helpers/auditLogger";

export default {
  execute: async (oldMessage: Message, newMessage: Message) => {
    const { guild } = newMessage;
    if (!guild) throw new Error("Guild unavailable");

    const embed = new EmbedBuilder()
      .setAuthor({
        name: newMessage.author.username,
        iconURL: newMessage.author.displayAvatarURL(),
      })
      .setDescription(
        `
      **Message edited in** ${newMessage.channel} [jump to message](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})
    `
      );

    await auditLogger(guild, embed);
  },
};
