import { SlashCommandBuilder } from "@discordjs/builders";
import view from "./addons/view";

import { CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("counter")
    .setDescription("Manage counters.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View a counter.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The counter channel you want to view")
            .setRequired(true)
        )
    ),
  async execute(interaction: CommandInteraction) {
    // If subcommand is view
    if (interaction.options.getSubcommand() === "view") {
      // Execute view addon
      await view(interaction);
    }
  },
};
