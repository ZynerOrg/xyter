//Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Groups
import modules from "../../commands/manage/modules";

export const moduleData = modules;

// Function
export const builder = new SlashCommandBuilder()
  .setName("manage")
  .setDescription("Manage the bot.")
  .addSubcommandGroup(modules.counters.builder)
  .addSubcommandGroup(modules.credits.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  // Destructure
  const { options } = interaction;

  if (options?.getSubcommandGroup() === "credits") {
    return modules.credits.execute(interaction);
  }

  if (options?.getSubcommandGroup() === "counters") {
    return modules.counters.execute(interaction);
  }
};
