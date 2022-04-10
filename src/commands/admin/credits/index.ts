import { Permissions, CommandInteraction } from "discord.js";
import config from "../../../../config.json";
import logger from "../../../handlers/logger";
import give from "./addons/give";
import take from "./addons/take";
import set from "./addons/set";
import transfer from "./addons/transfer";

export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { user, guild } = interaction;

  // Check permission
  if (!interaction?.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: ":toolbox: Admin - Credits" as string,
      color: config.colors.error as any,
      description: "You do not have permission to manage this!" as string,
      timestamp: new Date(),
      footer: {
        iconURL: config.footer.icon as string,
        text: config.footer.text as string,
      },
    };

    // Send interaction reply
    await interaction.editReply({ embeds: [embed] });
  }

  // If subcommand is give
  if (interaction.options.getSubcommand() === "give") {
    // Execute give addon
    await give(interaction);
  }

  // If subcommand is take
  else if (interaction.options.getSubcommand() === "take") {
    // Execute take addon
    await take(interaction);
  }

  // If subcommand is set
  else if (interaction.options.getSubcommand() === "set") {
    // Execute set addon
    await set(interaction);
  }

  // If subcommand is transfer
  else if (interaction.options.getSubcommand() === "transfer") {
    // Execute transfer addon
    await transfer(interaction);
  }

  // Send debug message
  await logger.debug(
    `Guild: ${guild?.id} User: ${user?.id} executed /${
      interaction.commandName
    } ${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}`
  );
};
