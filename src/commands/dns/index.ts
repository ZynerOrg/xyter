import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Modules
import moduleLookup from "./modules/lookup";

export const builder = new SlashCommandBuilder()
  .setName("dns")
  .setDescription("DNS commands.")

  // Modules
  .addSubcommand(moduleLookup.builder);

// Execute the command
export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "lookup":
      await moduleLookup.execute(interaction);
      break;
    default:
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
  }
};
