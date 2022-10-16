import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

import modules from "./modules";
export const moduleData = modules;

export const builder = new SlashCommandBuilder()
  .setName("moderation")
  .setDescription("Moderation.")

  .addSubcommand(modules.prune.builder);

// Execute the command
export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "prune": {
      await modules.prune.execute(interaction);
      break;
    }
    default: {
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
    }
  }
};
