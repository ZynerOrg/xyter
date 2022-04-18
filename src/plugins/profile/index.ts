// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import view from "./modules/view";

// Handlers
import logger from "@logger";

// Function
export default {
  metadata: { author: "Zyner" },
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Check a profile.")
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
    const { options } = interaction;

    if (options?.getSubcommand() === "view") {
      logger?.verbose(`Executing view subcommand`);
      return view(interaction);
    }

    logger?.verbose(`No subcommand found`);
  },
};
