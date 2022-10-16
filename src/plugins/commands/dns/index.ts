import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

import modules from "./modules";
export const moduleData = modules;

export const builder = new SlashCommandBuilder()
  .setName("dns")
  .setDescription("DNS commands.")

  .addSubcommand(modules.lookup.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "lookup":
      await modules.lookup.execute(interaction);
      break;
    default:
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
  }
};
