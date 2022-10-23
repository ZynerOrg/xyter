import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Modules
import { builder as ViewBuilder, execute as ViewExecute } from "./modules/view";

//
export const builder = new SlashCommandBuilder()
  .setName("counters")
  .setDescription("View guild counters")
  .setDMPermission(false)

  // Modules
  .addSubcommand(ViewBuilder);

// Execute function
export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "view":
      await ViewExecute(interaction);
      break;
    default:
      throw new Error("No module found for that command.");
  }
};
