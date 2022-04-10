import { SlashCommandBuilder } from "@discordjs/builders";
import view from "./addons/view";
import { CommandInteraction } from "discord.js";
export default {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Your profile.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View a profile.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The profile you wish to view")
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
