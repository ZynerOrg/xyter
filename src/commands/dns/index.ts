import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Subcommands
import {
  builder as LookupBuilder,
  execute as LookupExecute,
} from "./subcommands/lookup";

export const builder = new SlashCommandBuilder()
  .setName("dns")
  .setDescription("DNS commands.")

  // Subcommands
  .addSubcommand(LookupBuilder);

// Execute the command
export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "lookup":
      await LookupExecute(interaction);
      break;
    default:
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
  }
};
