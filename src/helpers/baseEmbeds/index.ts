import { EmbedBuilder, Guild } from "discord.js";
import getEmbedData from "../getEmbedData";

export const success = async (guild: Guild | null, title: string) => {
  const { successColor, footerText, footerIcon } = await getEmbedData(guild);

  return new EmbedBuilder()
    .setTimestamp(new Date())
    .setTitle(title)
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon });
};

export const wait = async (guild: Guild | null, title: string) => {
  const { waitColor, footerText, footerIcon } = await getEmbedData(guild);

  return new EmbedBuilder()
    .setTimestamp(new Date())
    .setTitle(title)
    .setColor(waitColor)
    .setFooter({ text: footerText, iconURL: footerIcon });
};

export const error = async (guild: Guild | null, title: string) => {
  const { errorColor, footerText, footerIcon } = await getEmbedData(guild);

  return new EmbedBuilder()
    .setTimestamp(new Date())
    .setTitle(title)
    .setColor(errorColor)
    .setFooter({ text: footerText, iconURL: footerIcon });
};
