// Dependencies
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Handlers

// Modules
import moduleBuy from "./modules/buy";
import moduleCancel from "./modules/cancel";

import guildSchema from "../../../../models/guild";

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

    const guildDB = await guildSchema?.findOne({
      guildId: guild?.id,
    });

    if (guildDB === null) return;

    if (!guildDB.shop.roles.status)
      throw new Error("This server has disabled shop roles.");

    if (options?.getSubcommand() === "buy") {
      await moduleBuy.execute(interaction);
    }

    if (options?.getSubcommand() === "cancel") {
      await moduleCancel.execute(interaction);
    }
  },
};
