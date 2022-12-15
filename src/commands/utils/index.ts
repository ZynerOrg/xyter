import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Modules
import {
  builder as AboutBuilder,
  execute as AboutExecute,
} from "./modules/about";
import {
  builder as AvatarBuilder,
  execute as AvatarExecute,
} from "./modules/avatar";

export const builder = new SlashCommandBuilder()
  .setName("utils")
  .setDescription("Common utility.")

  // Modules
  .addSubcommand(AboutBuilder)
  .addSubcommand(AvatarBuilder);

// Execute the command
export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "about":
      await AboutExecute(interaction);
      break;
    case "avatar":
      await AvatarExecute(interaction);
      break;
    default:
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
  }
};
