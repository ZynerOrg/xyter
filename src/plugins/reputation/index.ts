import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import give from "@plugins/reputation/modules/give";
import logger from "@logger";

export default {
  data: new SlashCommandBuilder()
    .setName("reputation")
    .setDescription("Manage reputation.")
    .addSubcommand(give.data),
  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    if (options?.getString("subcommand") === "give") {
      logger?.verbose(`Executing give subcommand`);
      return give.execute(interaction);
    } else {
      logger?.verbose(`No subcommand found`);
    }
  },
};
