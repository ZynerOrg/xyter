// Dependencies
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Modules
import moduleCheck from "./modules/check";
import moduleGive from "./modules/give";

// Function
export const builder = new SlashCommandBuilder()
  .setName("reputation")
  .setDescription("Manage reputation.")
  .setDMPermission(false)

  // Modules
  .addSubcommand(moduleGive.builder)
  .addSubcommand(moduleCheck.builder);

// Execute function
export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.options.getSubcommand() === "give") {
    await moduleGive.execute(interaction);
    return;
  }
  if (interaction.options.getSubcommand() === "check") {
    await moduleCheck.execute(interaction);
    return;
  }
};
