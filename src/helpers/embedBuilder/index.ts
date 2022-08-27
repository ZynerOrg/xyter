import { EmbedBuilder } from "discord.js";

export default new EmbedBuilder()
  .setFooter({
    text: process.env.EMBED_FOOTER_TEXT,
    iconURL: process.env.EMBED_FOOTER_ICON,
  })
  .setTimestamp(new Date());
