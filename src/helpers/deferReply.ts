import { BaseInteraction, EmbedBuilder } from "discord.js";
import getEmbedData from "./getEmbedConfig";

export default async (interaction: BaseInteraction, ephemeral: boolean) => {
  if (!interaction.isRepliable())
    throw new Error(`Failed to reply to your request`);

  await interaction.deferReply({ ephemeral });

  const embedConfig = await getEmbedData(interaction.guild);

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setFooter({
          text: embedConfig.footerText,
          iconURL: embedConfig.footerIcon,
        })
        .setTimestamp(new Date())
        .setTitle("⏳︱Your request are being processed")
        .setColor(embedConfig.waitColor)
        .setDescription("This might take a while, please wait..."),
    ],
  });
};
