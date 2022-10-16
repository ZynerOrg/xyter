// Dependencies
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

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

  switch (options.getSubcommand()) {
    case "add": {
      await modules.add.execute(interaction);
      break;
    }
    case "remove": {
      await modules.remove.execute(interaction);
      break;
    }
    default: {
      throw new Error("Could not found a module for that command.");
    }
  }
};
