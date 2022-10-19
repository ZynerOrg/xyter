import { Guild } from "discord.js";

export default async (guild?: Guild | null) => {
  const {
    EMBED_COLOR_SUCCESS,
    EMBED_COLOR_WAIT,
    EMBED_COLOR_ERROR,
    EMBED_FOOTER_TEXT,
    EMBED_FOOTER_ICON,
  } = process.env;

  const defaultEmbedConfig = {
    successColor: EMBED_COLOR_SUCCESS,
    waitColor: EMBED_COLOR_WAIT,
    errorColor: EMBED_COLOR_ERROR,
    footerText: EMBED_FOOTER_TEXT,
    footerIcon: EMBED_FOOTER_ICON,
  };

  if (!guild) {
    return defaultEmbedConfig;
  }

  return defaultEmbedConfig;

  // const guildConfig = await guildSchema.findOne({ guildId: guild.id });
  // if (!guildConfig) {
  // return defaultEmbedConfig;
  // }

  // return guildConfig.embeds;
};
