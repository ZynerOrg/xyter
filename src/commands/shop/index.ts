// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Modules
import moduleCpgg from "./modules/cpgg";
import moduleRoles from "./modules/roles";

// Function
export const builder = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Shop for credits and custom roles.")
  .setDMPermission(false)

  // Modules
  .addSubcommand(moduleCpgg.builder)
  .addSubcommandGroup(moduleRoles.builder);

// Execute the command
export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options } = interaction;

  switch (options.getSubcommand()) {
    case "cpgg": {
      await moduleCpgg.execute(interaction);
      break;
    }
    default: {
      throw new Error("Could not find module for that command.");
    }
  }

  switch (options.getSubcommandGroup()) {
    case "roles": {
      await moduleRoles.execute(interaction);
      break;
    }
    default: {
      throw new Error("Could not find module for that command.");
    }
  }
};
