import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

import modules from "./modules";

export const builder = new SlashCommandBuilder()
  .setName("config")
  .setDescription("Manage guild configurations.")

  .addSubcommand(modules.cpgg.builder)
  .addSubcommand(modules.credits.builder)
  .addSubcommand(modules.points.builder)
  .addSubcommand(modules.welcome.builder)
  .addSubcommand(modules.audits.builder)
  .addSubcommand(modules.shop.builder)
  .addSubcommand(modules.embeds.builder);

export const moduleData = modules;

export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options?.getSubcommand()) {
    case "cpgg":
      return modules.cpgg.execute(interaction);
    case "credits":
      return modules.credits.execute(interaction);
    case "points":
      return modules.points.execute(interaction);
    case "welcome":
      return modules.welcome.execute(interaction);
    case "audits":
      return modules.audits.execute(interaction);
    case "shop":
      return modules.shop.execute(interaction);
    case "embeds":
      return modules.embeds.execute(interaction);
  }
};
