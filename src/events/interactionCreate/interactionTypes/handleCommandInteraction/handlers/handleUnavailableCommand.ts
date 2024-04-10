import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import logger from "../../../../../utils/logger";
import sendResponse from "../../../../../utils/sendResponse";

export default async function handleUnavailableCommand(
  interaction: CommandInteraction,
  commandName: string
) {
  const commandErrorMessage = `Command '${commandName}' is unavailable`;
  logger.error(commandErrorMessage);

  const errorEmbed = new EmbedBuilder()
    .setAuthor({ name: "⚠️ | Request Failed" })
    .setDescription("Sorry, the command is currently unavailable.")
    .setColor("#FFCC66")
    .setTimestamp();

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Report Problem")
      .setStyle(ButtonStyle.Link)
      .setEmoji("✏️")
      .setURL("https://s.zyner.org/discord")
  );

  const response = {
    embeds: [errorEmbed],
    components: [buttons],
  };

  await sendResponse(interaction, response);
}
