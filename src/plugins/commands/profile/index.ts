// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Modules
import modules from "../../commands/profile/modules";

// Handlers
import logger from "../../../middlewares/logger";

export const moduleData = modules;

// Function
export const builder = new SlashCommandBuilder()
  .setName("profile")
  .setDescription("Check a profile.")
  .addSubcommand(modules.view.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options } = interaction;

  if (options?.getSubcommand() === "view") {
    logger?.silly(`Executing view subcommand`);

    return modules.view.execute(interaction);
  }

  logger?.silly(`No subcommand found`);
};
