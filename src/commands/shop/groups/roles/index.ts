// Dependencies
import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";

// Handlers

// Modules
import {
  builder as BuyBuilder,
  execute as BuyExecute,
} from "./subcommands/buy";
import {
  builder as CancelBuilder,
  execute as CancelExecute,
} from "./subcommands/cancel";

import prisma from "../../../../handlers/database";

export const builder = (group: SlashCommandSubcommandGroupBuilder) => {
  return (
    group
      .setName("roles")
      .setDescription("Shop for custom roles.")

      // Modules
      .addSubcommand(BuyBuilder)
      .addSubcommand(CancelBuilder)
  );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.guild) return;
  const { options, guild } = interaction;

  const getGuildConfigShopRoles = await prisma.guildConfigShopRoles.findUnique({
    where: { id: guild.id },
  });
  if (!getGuildConfigShopRoles) throw new Error("Guild not found");

  if (!getGuildConfigShopRoles.status)
    throw new Error("This server has disabled shop roles.");

  if (options?.getSubcommand() === "buy") {
    await BuyExecute(interaction);
  }

  if (options?.getSubcommand() === "cancel") {
    await CancelExecute(interaction);
  }
};
