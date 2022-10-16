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
      await modules.about.execute(interaction);
      break;
    case "stats":
      await modules.stats.execute(interaction);
      break;
    case "avatar":
      await modules.avatar.execute(interaction);
      break;
    case "ping":
      await modules.ping.execute(interaction);
      break;
    default:
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
  }
};
