// Dependencies
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

import logger from "../../../../../middlewares/logger";

// Modules
import modules from "./modules";

// Function
export const moduleData = modules;

export const builder = (group: SlashCommandSubcommandGroupBuilder) => {
  return group
    .setName("counters")
    .setDescription("Manage guild counters.")
    .addSubcommand(modules.add.builder)
    .addSubcommand(modules.remove.builder);
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options } = interaction;

  if (options?.getSubcommand() === "add") {
    logger?.silly(`Executing create subcommand`);

    return modules.add.execute(interaction);
  }

  if (options?.getSubcommand() === "remove") {
    logger?.silly(`Executing delete subcommand`);

    return modules.remove.execute(interaction);
  }

  logger?.silly(`Unknown subcommand ${options?.getSubcommand()}`);
};
