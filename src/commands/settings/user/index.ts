import { Permissions, CommandInteraction } from "discord.js";
import config from "../../../../config.json";
import logger from "../../../handlers/logger";
import appearance from "./addons/appearance";

export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { member } = interaction;

  // If subcommand is appearance
  if (interaction.options.getSubcommand() === "appearance") {
    // Execute appearance addon
    await appearance(interaction);
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
