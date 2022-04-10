import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions, CommandInteraction } from "discord.js";
import logger from "../../handlers/logger";
import give from "./addons/give";

export default {
  data: new SlashCommandBuilder()
    .setName("reputation")
    .setDescription("Manage reputation.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("give")
        .setDescription("Give reputation for a user")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user you want to repute.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("What type of reputation you want to repute")
            .setRequired(true)
            .addChoice("Positive", "positive")
            .addChoice("Negative", "negative")
        )
    ),
  async execute(interaction: CommandInteraction) {
    // Destructure member
    const { member } = interaction;

    // If subcommand is give
    if (interaction.options.getSubcommand() === "give") {
      // Execute give addon
      await give(interaction);
    }

    // Send debug message
    await logger.debug(
      `Guild: ${interaction?.guild?.id} User: ${
        interaction?.user?.id
      } executed /${
        interaction.commandName
      } ${interaction.options.getSubcommand()}`
    );
  },
};
