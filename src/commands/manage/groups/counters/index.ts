// Dependencies
import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";

// Modules
import {
  builder as AddBuilder,
  execute as AddExecute,
} from "./subcommands/add";
import {
  builder as RemoveBuilder,
  execute as RemoveExecute,
} from "./subcommands/remove";

export const builder = (group: SlashCommandSubcommandGroupBuilder) => {
  return group
    .setName("counters")
    .setDescription("Manage guild counters.")
    .addSubcommand(AddBuilder)
    .addSubcommand(RemoveBuilder);
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options } = interaction;

  switch (options.getSubcommand()) {
    case "add": {
      await AddExecute(interaction);
      break;
    }
    case "remove": {
      await RemoveExecute(interaction);
      break;
    }
    default: {
      throw new Error("Could not found a module for that command.");
    }
  }
};
