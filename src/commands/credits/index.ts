import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import logger from "../../middlewares/logger";

import modules from "./modules";

export const builder = new SlashCommandBuilder()
  .setName("credits")
  .setDescription("Manage your credits.")

  .addSubcommand(modules.balance.builder)
  .addSubcommand(modules.gift.builder)
  .addSubcommand(modules.top.builder)
  .addSubcommand(modules.work.builder);

export const moduleData = modules;

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options } = interaction;

  switch (options.getSubcommand()) {
    case "balance":
      await modules.balance.execute(interaction);
      break;
    case "gift":
      await modules.gift.execute(interaction);
      break;
    case "top":
      await modules.top.execute(interaction);
      break;
    case "work":
      await modules.work.execute(interaction);
      break;
    default:
      logger.silly(`Unknown subcommand ${options.getSubcommand()}`);
  }
};
