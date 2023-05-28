import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
  SubcommandHandlers,
  executeSubcommand,
} from "../../handlers/executeSubcommand";
import * as about from "./subcommands/about";
import * as avatar from "./subcommands/avatar";

const subcommandHandlers: SubcommandHandlers = {
  about: about.execute,
  avatar: avatar.execute,
};

export const builder = new SlashCommandBuilder()
  .setName("utils")
  .setDescription("Common utility.")
  .addSubcommand(about.builder)
  .addSubcommand(avatar.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, subcommandHandlers);
};
