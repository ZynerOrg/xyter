import { Permissions, CommandInteraction } from "discord.js";
import config from "../../../../../config.json";
import logger from "../../../../handlers/logger";

// Database models
import counters from "../../../../helpers/database/models/counterSchema";

export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { member } = interaction;

  // Check permission
  if (!interaction?.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: "Admin",
      color: config.colors.error as any,
      description: "You do not have permission to manage this!",
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // Get options
  const channel = await interaction.options.getChannel("channel");

  await counters
    .deleteOne({ guildId: interaction?.guild?.id, channelId: channel?.id })
    .then(async () => {
      interaction.editReply({ content: "Removed" });
    });

  // Send debug message
  await logger.debug(
    `Guild: ${interaction?.guild?.id} User: ${interaction?.user?.id} executed remove counter.`
  );
};
