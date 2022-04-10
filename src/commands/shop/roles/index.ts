import logger from "../../../handlers/logger";
import buy from "./addons/buy";
import cancel from "./addons/cancel";
import { CommandInteraction } from "discord.js";
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { member } = interaction;

  // If subcommand is buy
  if (interaction.options.getSubcommand() === "buy") {
    // Execute buy addon
    await buy(interaction);
  }

  // If subcommand is cancel
  if (interaction.options.getSubcommand() === "cancel") {
    // Execute cancel addon
    await cancel(interaction);
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
