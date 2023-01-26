import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as about from "./subcommands/about";
import * as avatar from "./subcommands/avatar";

export const builder = new SlashCommandBuilder()
  .setName("utils")
  .setDescription("Common utility.")
  .addSubcommand(about.builder)
  .addSubcommand(avatar.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "about":
      await about.execute(interaction);
      break;
    case "avatar":
      await avatar.execute(interaction);
      break;
    default:
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
  }
};
