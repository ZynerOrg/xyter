import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import logger from "../../middlewares/logger";

// Modules
import moduleBalance from "./modules/balance";
import moduleGift from "./modules/gift";
import moduleTop from "./modules/top";
import moduleWork from "./modules/work";

export const builder = new SlashCommandBuilder()
  .setName("credits")
  .setDescription("Manage your credits.")
  .setDMPermission(false)

  // Modules
  .addSubcommand(moduleBalance.builder)
  .addSubcommand(moduleGift.builder)
  .addSubcommand(moduleTop.builder)
  .addSubcommand(moduleWork.builder);

// Execute function
export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options } = interaction;

  switch (options.getSubcommand()) {
    case "balance":
      await moduleBalance.execute(interaction);
      break;
    case "gift":
      await moduleGift.execute(interaction);
      break;
    case "top":
      await moduleTop.execute(interaction);
      break;
    case "work":
      await moduleWork.execute(interaction);
      break;
    default:
      logger.silly(`Unknown subcommand ${options.getSubcommand()}`);
  }
};
