import { Permissions, CommandInteraction } from "discord.js";
import config from "../../../../../config.json";
import logger from "../../../../handlers/logger";

// Database models

import apis from "../../../../helpers/database/models/apiSchema";

export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { member } = interaction;

  // Check permission
  if (!interaction?.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: ":hammer: Settings - Guild [Pterodactyl]",
      color: config.colors.error as any,
      description: "You do not have permission to manage this!",
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // Get options

  const url = await interaction.options.getString("url");
  const token = await interaction.options.getString("token");

  // Update API credentials

  await apis
    .findOneAndUpdate(
      { guildId: interaction?.guild?.id },
      { url, token },
      { new: true, upsert: true }
    )
    .then(async () => {
      // Build embed

      const embed = {
        title: ":hammer: Settings - Guild [Pterodactyl]",
        color: config.colors.success as any,
        description: "Pterodactyl settings is saved!",
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send reply

      await interaction.editReply({ embeds: [embed] });

      // Send debug message

      await logger.debug(
        `Guild: ${interaction?.guild?.id} User: ${interaction?.user?.id} has changed api credentials.`
      );
    });
};
