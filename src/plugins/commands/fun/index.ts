import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import logger from "../../../middlewares/logger";

import modules from "../../commands/fun/modules";

export const builder = new SlashCommandBuilder()
  .setName("fun")
  .setDescription("Fun commands.")

  .addSubcommand(modules.meme.builder);

export const moduleData = modules;

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options } = interaction;

  if (options.getSubcommand() === "meme") {
    await modules.meme.execute(interaction);
  } else {
    logger.silly(`Unknown subcommand ${options.getSubcommand()}`);
  }
};
