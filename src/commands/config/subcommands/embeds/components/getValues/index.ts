import { ChatInputCommandInteraction, ColorResolvable } from "discord.js";
import prisma from "../../../../../../handlers/database";
import getEmbedConfig from "../../../../../../helpers/getEmbedData";
import logger from "../../../../../../middlewares/logger";

export default async (interaction: ChatInputCommandInteraction) => {
  const { options, guild } = interaction;

  if (!guild) throw new Error("Guild not found");

  const embedConfig = await getEmbedConfig(guild);
  if (!embedConfig) throw new Error("Embed config not found");

  const newSuccessColor = <ColorResolvable>options.getString("success-color");
  const newWaitColor = <ColorResolvable>options.getString("wait-color");
  const newErrorColor = <ColorResolvable>options.getString("error-color");
  const newFooterIcon = options.getString("footer-icon");
  const newFooterText = options.getString("footer-text");

  if (!newSuccessColor) throw new Error("Success color not found");
  if (!newWaitColor) throw new Error("Wait color not found");
  if (!newErrorColor) throw new Error("Error color not found");
  if (!newFooterIcon) throw new Error("Footer icon not found");
  if (!newFooterText) throw new Error("Footer text not found");

  const createGuild = await prisma.guildConfigEmbeds.upsert({
    where: {
      id: guild.id,
    },
    update: {
      successColor: <string>newSuccessColor,
      waitColor: <string>newWaitColor,
      errorColor: <string>newErrorColor,
      footerIcon: newFooterIcon,
      footerText: newFooterText,
    },
    create: {
      id: guild.id,
      successColor: <string>newSuccessColor,
      waitColor: <string>newWaitColor,
      errorColor: <string>newErrorColor,
      footerIcon: newFooterIcon,
      footerText: newFooterText,
    },
  });

  logger.silly(createGuild);

  const successColor = <ColorResolvable>createGuild.successColor;
  const waitColor = <ColorResolvable>createGuild.waitColor;
  const errorColor = <ColorResolvable>createGuild.errorColor;
  const footerText = createGuild.footerText;
  const footerIcon = createGuild.footerIcon;

  return { successColor, waitColor, errorColor, footerText, footerIcon };
};
