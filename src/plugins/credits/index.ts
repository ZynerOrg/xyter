import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import logger from "@logger";
import modules from "@plugins/credits/modules";

export default {
  data: new SlashCommandBuilder()
    .setName("credits")
    .setDescription("Manage your credits.")
    .addSubcommand(modules.balance.data)
    .addSubcommand(modules.gift.data)
    .addSubcommand(modules.top.data)
    .addSubcommand(modules.work.data),
  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    switch (options.getSubcommand()) {
      case "balance":
        logger?.verbose(`Executing balance subcommand`);
        return modules.balance.execute(interaction);
      case "gift":
        logger?.verbose(`Executing gift subcommand`);
        return modules.gift.execute(interaction);
      case "top":
        logger?.verbose(`Executing top subcommand`);
        return modules.top.execute(interaction);
      case "work":
        logger?.verbose(`Executing work subcommand`);
        return modules.work.execute(interaction);
      default:
        logger?.verbose(`Unknown subcommand ${options?.getSubcommand()}`);
    }
  },
};
