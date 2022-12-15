import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import logger from "../../middlewares/logger";

// Subcommands
import {
  builder as MemeBuilder,
  execute as MemeExecute,
} from "./subcommands/meme";

export const builder = new SlashCommandBuilder()
  .setName("fun")
  .setDescription("Fun commands.")

  .addSubcommand(MemeBuilder);

// Execute function
export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options } = interaction;

  if (options.getSubcommand() === "meme") {
    await MemeExecute(interaction);
  } else {
    logger.silly(`Unknown subcommand ${options.getSubcommand()}`);
  }
};
