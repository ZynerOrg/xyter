import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Subcommands
import {
  SubcommandHandlers,
  executeSubcommand,
} from "../../handlers/executeSubcommand";
import * as post from "./subcommands/post";

const subcommandHandlers: SubcommandHandlers = {
  post: post.execute,
};

export const builder = new SlashCommandBuilder()
  .setName("quotes")
  .setDescription("Fun commands.")

  .addSubcommand(post.builder);

// Execute function
export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, subcommandHandlers);
};
