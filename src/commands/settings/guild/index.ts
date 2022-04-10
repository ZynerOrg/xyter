import { Permissions, CommandInteraction } from "discord.js";
import config from "../../../../config.json";
import logger from "../../../handlers/logger";
import pterodactyl from "./addons/pterodactyl";
import credits from "./addons/credits";
import points from "./addons/points";

export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { member } = interaction;

  // Check permission
  if (!interaction?.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: "Settings - Guild",
      color: config.colors.error as any,
      description: "You do not have permission to manage this!",
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    await interaction.editReply({ embeds: [embed] });
  }

  // If subcommand is pterodactyl
  if (interaction.options.getSubcommand() === "pterodactyl") {
    // Execute pterodactyl addon
    await pterodactyl(interaction);
  }

  // If subcommand is credits
  else if (interaction.options.getSubcommand() === "credits") {
    // Execute credits addon
    await credits(interaction);
  }

  // If subcommand is points
  else if (interaction.options.getSubcommand() === "points") {
    // Execute points addon
    await points(interaction);
  }

  // Send debug message
  await logger.debug(
    `Guild: ${interaction?.guild?.id} User: ${
      interaction?.user?.id
    } executed /${
      interaction.commandName
    } ${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}`
  );
};
