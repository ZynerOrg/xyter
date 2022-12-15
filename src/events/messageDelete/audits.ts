import { EmbedBuilder, Message } from "discord.js";
import auditLogger from "../../helpers/auditLogger";

export default {
  execute: async (message: Message) => {
    const { guild } = message;
    if (!guild) throw new Error("Guild unavailable");

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(
        `
    **Message sent by** ${message.author} **deleted in** ${message.channel}
    ${message.content}
    `
      );

    await auditLogger(guild, embed);
  },
};
