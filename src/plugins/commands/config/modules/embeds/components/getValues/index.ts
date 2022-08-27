import { ChatInputCommandInteraction, ColorResolvable } from "discord.js";
import getEmbedConfig from "../../../../../../../helpers/getEmbedConfig";
import guildSchema from "../../../../../../../models/guild";

export default async (interaction: ChatInputCommandInteraction) => {
  const { options, guild } = interaction;

  if (!guild) throw new Error("Guild not found");

  const embedConfig = await getEmbedConfig(guild);
  if (!embedConfig) throw new Error("Embed config not found");

  const newSuccessColor = options.getString("success-color") as ColorResolvable;
  const newWaitColor = options.getString("wait-color") as ColorResolvable;
  const newErrorColor = options.getString("error-color") as ColorResolvable;
  const newFooterIcon = options.getString("footer-icon");
  const newFooterText = options.getString("footer-text");

  const guildData = await guildSchema.findOne({
    guildId: guild.id,
  });
  if (!guildData) throw new Error("Guild data not found");
  if (!guildData?.embeds)
    throw new Error("Guild embed configuration not found");
  let { successColor, waitColor, errorColor, footerText, footerIcon } =
    guildData.embeds;

  successColor = newSuccessColor || successColor;
  waitColor = newWaitColor || waitColor;
  errorColor = newErrorColor || errorColor;
  footerIcon = newFooterIcon || footerIcon;
  footerText = newFooterText || footerText;

  return { successColor, waitColor, errorColor, footerText, footerIcon };
};
