// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Modules
import modules from "./modules";

// Handlers

export const moduleData = modules;

// Function
export const builder = new SlashCommandBuilder()
  .setName("reputation")
  .setDescription("Manage reputation.")
  .addSubcommand(modules.give.builder)
  .addSubcommand(modules.view.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.options.getSubcommand() === "give") {
    await modules.give.execute(interaction);
    return;
  }
  if (interaction.options.getSubcommand() === "view") {
    await modules.view.execute(interaction);
    return;
  }
};
