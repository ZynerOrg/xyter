// Dependencies
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Modules
import {
  builder as RolesBuilder,
  execute as RolesExecute,
} from "./groups/roles";
import {
  builder as CpggBuilder,
  execute as CpggExecute,
} from "./subcommands/cpgg";

// Function
export const builder = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Shop for credits and custom roles.")
  .setDMPermission(false)

  // Modules
  .addSubcommand(CpggBuilder)
  .addSubcommandGroup(RolesBuilder);

// Execute the command
export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options } = interaction;

  switch (options.getSubcommand()) {
    case "cpgg": {
      await CpggExecute(interaction);
      break;
    }
    default: {
      throw new Error("Could not find module for that command.");
    }
  }

  if (!options.getSubcommandGroup()) {
    return;
  }

  switch (options.getSubcommandGroup()) {
    case "roles": {
      await RolesExecute(interaction);
      break;
    }
    default: {
      throw new Error("Could not find module for that command.");
    }
  }
};
