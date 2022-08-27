import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

import modules from "./modules";
export const moduleData = modules;

export const builder = new SlashCommandBuilder()
  .setName("utility")
  .setDescription("Common utility.")

  .addSubcommand(modules.about.builder)
  .addSubcommand(modules.stats.builder)
  .addSubcommand(modules.avatar.builder)
  .addSubcommand(modules.ping.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "about":
      return modules.about.execute(interaction);
    case "stats":
      return modules.stats.execute(interaction);
    case "avatar":
      return modules.avatar.execute(interaction);
    case "ping":
      return modules.ping.execute(interaction);
    default:
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
  }
};
