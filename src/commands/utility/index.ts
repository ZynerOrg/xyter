import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Modules
import moduleAbout from "./modules/about";
import moduleAvatar from "./modules/avatar";
import modulePing from "./modules/ping";
import moduleStats from "./modules/stats";

export const builder = new SlashCommandBuilder()
  .setName("utility")
  .setDescription("Common utility.")

  // Modules
  .addSubcommand(moduleAbout.builder)
  .addSubcommand(moduleStats.builder)
  .addSubcommand(moduleAvatar.builder)
  .addSubcommand(modulePing.builder);

// Execute the command
export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "about":
      await moduleAbout.execute(interaction);
      break;
    case "stats":
      await moduleStats.execute(interaction);
      break;
    case "avatar":
      await moduleAvatar.execute(interaction);
      break;
    case "ping":
      await modulePing.execute(interaction);
      break;
    default:
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
  }
};
