//Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Modules
import moduleCounters from "./modules/counters";
import moduleCredits from "./modules/credits";

// Function
export const builder = new SlashCommandBuilder()
  .setName("manage")
  .setDescription("Manage the bot.")
  .setDMPermission(false)

  // Modules
  .addSubcommandGroup(moduleCounters.builder)
  .addSubcommandGroup(moduleCredits.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  // Destructure
  const { options } = interaction;

  switch (options.getSubcommandGroup()) {
    case "credits": {
      await moduleCredits.execute(interaction);
      break;
    }
    case "counters": {
      await moduleCounters.execute(interaction);
      break;
    }
    default: {
      throw new Error("Could not find an module for the command.");
    }
  }
};
