import { MessageEmbed } from "discord.js";

export default new MessageEmbed()
  .setFooter({
    text: process.env.EMBED_FOOTER_TEXT,
    iconURL: process.env.EMBED_FOOTER_ICON,
  })
  .setTimestamp(new Date());
