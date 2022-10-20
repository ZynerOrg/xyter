//Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Groups
import modules from "./modules";

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

  switch (options.getSubcommandGroup()) {
    case "credits": {
      await modules.credits.execute(interaction);
      break;
    }
    case "counters": {
      await modules.counters.execute(interaction);
      break;
    }
    default: {
      throw new Error("Could not find an module for the command.");
    }
  }
};
