// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Modules
import modules from "./modules";

// Handlers

export const moduleData = modules;

// Function
export const builder = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Shop for credits and custom roles.")
  .addSubcommand(modules.cpgg.builder)
  .addSubcommandGroup(modules.roles.builder);

// Execute the command
export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options } = interaction;

  switch (options.getSubcommand()) {
    case "cpgg": {
      await modules.cpgg.execute(interaction);
      break;
    }
    default: {
      throw new Error("Could not find module for that command.");
    }
  }

  switch (options.getSubcommandGroup()) {
    case "roles": {
      await modules.roles.execute(interaction);
      break;
    }
    default: {
      throw new Error("Could not find module for that command.");
    }
  }
};
