import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

import modules from "./modules";

export const builder = new SlashCommandBuilder()
  .setName("counters")
  .setDescription("View guild counters")

  .addSubcommand(modules.view.builder);

export const moduleData = modules;

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.options.getSubcommand() === "view") {
    await modules.view.execute(interaction);
  }
};
