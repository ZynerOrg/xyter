// Dependencies
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Modules
import moduleCheck from "./modules/check";
import moduleRepute from "./modules/repute";

// Function
export const builder = new SlashCommandBuilder()
  .setName("reputation")
  .setDescription("See and repute users to show other how trustworthy they are")
  .setDMPermission(false)

  // Modules
  .addSubcommand(moduleRepute.builder)
  .addSubcommand(moduleCheck.builder);

// Execute function
export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.options.getSubcommand() === "repute") {
    await moduleRepute.execute(interaction);
    return;
  }
  if (interaction.options.getSubcommand() === "check") {
    await moduleCheck.execute(interaction);
    return;
  }
};
