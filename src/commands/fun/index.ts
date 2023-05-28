import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Subcommands
import {
  SubcommandHandlers,
  executeSubcommand,
} from "../../handlers/executeSubcommand";
import * as meme from "./subcommands/meme";

const subcommandHandlers: SubcommandHandlers = {
  meme: meme.execute,
};

export const builder = new SlashCommandBuilder()
  .setName("fun")
  .setDescription("Fun commands.")

  .addSubcommand(meme.builder);

// Execute function
export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, subcommandHandlers);
};
