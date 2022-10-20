// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Modules
import modules from "../commands/profile/modules";

// Handlers

export const moduleData = modules;

// Function
export const builder = new SlashCommandBuilder()
  .setName("profile")
  .setDescription("Check a profile.")
  .addSubcommand(modules.view.builder);

// Execute the command
export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options } = interaction;

  switch (options.getSubcommand()) {
    case "view": {
      await modules.view.execute(interaction);
      break;
    }
    default: {
      throw new Error("Could not find module for that command");
    }
  }
};
