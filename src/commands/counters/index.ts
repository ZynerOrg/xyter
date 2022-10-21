import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Modules
import moduleView from "./modules/view";

export const builder = new SlashCommandBuilder()
  .setName("counters")
  .setDescription("View guild counters")
  .setDMPermission(false)

  // Modules
  .addSubcommand(moduleView.builder);

// Execute function
export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "view":
      await moduleView.execute(interaction);
      break;
    default:
      throw new Error("No module found for that command.");
  }
};
