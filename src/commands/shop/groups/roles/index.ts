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

  const getGuild = await prisma.guild.findUnique({
    where: { id: guild.id },
  });
  if (!getGuild) throw new Error("Guild not found");

  if (!getGuild.shopRolesEnabled)
    throw new Error("This server has disabled shop roles.");

  if (options?.getSubcommand() === "buy") {
    await BuyExecute(interaction);
  }

  if (options?.getSubcommand() === "cancel") {
    await CancelExecute(interaction);
  }
};
