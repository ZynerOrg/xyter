import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Modules
import {
  builder as PruneBuilder,
  execute as PruneExecute,
} from "./subcommands/prune";

export const builder = new SlashCommandBuilder()
  .setName("moderation")
  .setDescription("Moderation.")
  .setDMPermission(false)

  .addSubcommand(PruneBuilder);

// Execute the command
export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "prune": {
      await PruneExecute(interaction);
      break;
    }
    default: {
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
    }
  }
};
