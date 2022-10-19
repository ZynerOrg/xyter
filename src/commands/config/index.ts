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
      await modules.cpgg.execute(interaction);
      break;
    case "credits":
      await modules.credits.execute(interaction);
      break;
    case "points":
      await modules.points.execute(interaction);
      break;
    case "welcome":
      await modules.welcome.execute(interaction);
      break;
    case "audits":
      await modules.audits.execute(interaction);
      break;
    case "shop":
      await modules.shop.execute(interaction);
      break;
    case "embeds":
      await modules.embeds.execute(interaction);
      break;
    default:
      throw new Error("No module found for that specific command.");
  }
};
