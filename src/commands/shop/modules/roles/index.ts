// Dependencies
import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";

// Handlers

// Modules
import moduleBuy from "./modules/buy";
import moduleCancel from "./modules/cancel";

import prisma from "../../../../handlers/database";

export default {
  builder: (group: SlashCommandSubcommandGroupBuilder) => {
    return (
      group
        .setName("roles")
        .setDescription("Shop for custom roles.")

        // Modules
        .addSubcommand(moduleBuy.builder)
        .addSubcommand(moduleCancel.builder)
    );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) return;
    const { options, guild } = interaction;

    const getGuild = await prisma.guild.findUnique({
      where: { id: guild.id },
    });
    if (!getGuild) throw new Error("Guild not found");

    if (!getGuild.shopRolesEnabled)
      throw new Error("This server has disabled shop roles.");

    if (options?.getSubcommand() === "buy") {
      await moduleBuy.execute(interaction);
    }

    if (options?.getSubcommand() === "cancel") {
      await moduleCancel.execute(interaction);
    }
  },
};
