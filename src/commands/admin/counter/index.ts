import { Permissions, CommandInteraction } from "discord.js";
import config from "../../../../config.json";
import logger from "../../../handlers/logger";
import add from "./addons/add";
import remove from "./addons/remove";

export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { member } = interaction;

  // Check permission
  if (!interaction?.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: ":toolbox: Admin - Counter",
      color: config.colors.error as any,
      description: "You do not have permission to manage this!",
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    await interaction.editReply({ embeds: [embed] });
  }

  // If subcommand is give
  if (interaction.options.getSubcommand() === "add") {
    // Execute give addon
    await add(interaction);
  }

  // If subcommand is take
  else if (interaction.options.getSubcommand() === "remove") {
    // Execute take addon
    await remove(interaction);
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
