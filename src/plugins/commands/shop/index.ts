// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import modules from "./modules";

// Handlers
import logger from "../../../middlewares/logger";

export const moduleData = modules;

// Function
export const builder = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Shop for credits and custom roles.")
  .addSubcommand(modules.cpgg.builder)
  .addSubcommandGroup(modules.roles.builder);

export const execute = async (interaction: CommandInteraction) => {
  const { options } = interaction;

  if (options?.getSubcommand() === "cpgg") {
    logger.silly(`Executing cpgg subcommand`);

    return modules.cpgg.execute(interaction);
  }

  if (options?.getSubcommandGroup() === "roles") {
    logger?.silly(`Subcommand group is roles`);

    return modules.roles.execute(interaction);
  }

  logger?.silly(`No subcommand found.`);
};
