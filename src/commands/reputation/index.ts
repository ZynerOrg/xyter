// Dependencies
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Modules
import {
  builder as CheckBuilder,
  execute as CheckExecute,
} from "./subcommands/check";
import {
  builder as ReputeBuilder,
  execute as ReputeExecute,
} from "./subcommands/repute";

// Function
export const builder = new SlashCommandBuilder()
  .setName("reputation")
  .setDescription("See and repute users to show other how trustworthy they are")
  .setDMPermission(false)

  // Modules
  .addSubcommand(ReputeBuilder)
  .addSubcommand(CheckBuilder);

// Execute function
export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.options.getSubcommand() === "repute") {
    await ReputeExecute(interaction);
    return;
  }
  if (interaction.options.getSubcommand() === "check") {
    await CheckExecute(interaction);
    return;
  }
};
