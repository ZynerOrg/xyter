import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import logger from "../../middlewares/logger";

// Modules
import moduleMeme from "./modules/meme";

export const builder = new SlashCommandBuilder()
  .setName("fun")
  .setDescription("Fun commands.")

  .addSubcommand(moduleMeme.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options } = interaction;

  if (options.getSubcommand() === "meme") {
    await moduleMeme.execute(interaction);
  } else {
    logger.silly(`Unknown subcommand ${options.getSubcommand()}`);
  }
};
