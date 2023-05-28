import {
  ButtonInteraction,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import sendResponse from "./sendResponse";

export default async (
  interaction: CommandInteraction | ButtonInteraction,
  ephemeral: boolean
) => {
  if (!interaction.isRepliable()) {
    throw new Error("Failed to reply to your request.");
  }

  await interaction.deferReply({ ephemeral });

  await sendResponse(interaction, {
    embeds: [
      new EmbedBuilder()
        .setTimestamp(new Date())
        .setTitle("🎉︱Hold on tight!")
        .setDescription(
          "We're working our magic. This might take a while, so prepare to be amazed! ✨"
        ),
    ],
  });
};
