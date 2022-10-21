// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Modules
import moduleGive from "./modules/give";
import moduleView from "./modules/view";

// Function
export const builder = new SlashCommandBuilder()
  .setName("reputation")
  .setDescription("Manage reputation.")
  .setDMPermission(false)

  // Modules
  .addSubcommand(moduleGive.builder)
  .addSubcommand(moduleView.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.options.getSubcommand() === "give") {
    await moduleGive.execute(interaction);
    return;
  }
  if (interaction.options.getSubcommand() === "view") {
    await moduleView.execute(interaction);
    return;
  }
};
