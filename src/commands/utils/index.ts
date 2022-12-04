import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Modules
import moduleAbout from "./modules/about";
import moduleAvatar from "./modules/avatar";

export const builder = new SlashCommandBuilder()
  .setName("utils")
  .setDescription("Common utility.")

  // Modules
  .addSubcommand(moduleAbout.builder)
  .addSubcommand(moduleAvatar.builder);

// Execute the command
export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "about":
      await moduleAbout.execute(interaction);
      break;
    case "avatar":
      await moduleAvatar.execute(interaction);
      break;
    default:
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
  }
};
