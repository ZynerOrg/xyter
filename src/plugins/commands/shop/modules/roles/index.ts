// Dependencies
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Handlers

// Modules
import modules from "./modules";

import guildSchema from "../../../../../models/guild";

export const moduleData = modules;

// Function
export const builder = (group: SlashCommandSubcommandGroupBuilder) => {
  return group
    .setName("roles")
    .setDescription("Shop for custom roles.")
    .addSubcommand(modules.buy.builder)
    .addSubcommand(modules.cancel.builder);
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.guild == null) return;
  const { options, guild } = interaction;

  const guildDB = await guildSchema?.findOne({
    guildId: guild?.id,
  });

  if (guildDB === null) return;

  if (!guildDB.shop.roles.status)
    throw new Error("This server has disabled shop roles.");

  if (options?.getSubcommand() === "buy") {
    await modules.buy.execute(interaction);
  }

  if (options?.getSubcommand() === "cancel") {
    await modules.cancel.execute(interaction);
  }
};
