import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Modules
import modulePrune from "./modules/prune";

export const builder = new SlashCommandBuilder()
  .setName("moderation")
  .setDescription("Moderation.")
  .setDMPermission(false)

  .addSubcommand(modulePrune.builder);

// Execute the command
export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "prune": {
      await modulePrune.execute(interaction);
      break;
    }
    default: {
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
    }
  }
};
