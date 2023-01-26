import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Modules
import * as prune from "./subcommands/prune";

export const builder = new SlashCommandBuilder()
  .setName("moderation")
  .setDescription("Moderation.")
  .setDMPermission(false)

  .addSubcommand(prune.builder);

// Execute the command
export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "prune": {
      await prune.execute(interaction);
      break;
    }
    default: {
      throw new Error("Invalid subcommand");
    }
  }
};
