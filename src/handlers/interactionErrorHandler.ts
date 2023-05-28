import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  codeBlock,
} from "discord.js";
import sendResponse from "../utils/sendResponse";

export default async (
  interaction: CommandInteraction | ButtonInteraction,
  error: unknown
) => {
  if (error instanceof Error) {
    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Report Problem")
        .setStyle(ButtonStyle.Link)
        .setEmoji("✏️")
        .setURL("https://discord.zyner.org")
    );

    const errorEmbed = new EmbedBuilder()
      .setAuthor({ name: "⚠️ | Request Failed" })
      .setDescription(
        "An error occurred while processing your request. Please try again later."
      )
      .setColor("#FFCC66")
      .setTimestamp();

    if (error.message !== undefined) {
      errorEmbed.addFields({
        name: "Error Message",
        value: codeBlock(error.message),
      });
    }

    if (process.env.NODE_ENV === "development" && error.stack !== undefined) {
      errorEmbed.addFields({
        name: "Error Stack",
        value: codeBlock(error.stack),
      });
    }

    const response = {
      embeds: [errorEmbed],
      components: [buttons],
      ephemeral: true,
    };

    await sendResponse(interaction, response);
  }
};
