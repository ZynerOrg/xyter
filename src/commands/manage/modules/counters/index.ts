// Dependencies
import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";

// Modules
import moduleAdd from "./modules/add";
import moduleRemove from "./modules/remove";

export default {
  builder: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("counters")
      .setDescription("Manage guild counters.")
      .addSubcommand(moduleAdd.builder)
      .addSubcommand(moduleRemove.builder);
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { options } = interaction;

    switch (options.getSubcommand()) {
      case "add": {
        await moduleAdd.execute(interaction);
        break;
      }
      case "remove": {
        await moduleRemove.execute(interaction);
        break;
      }
      default: {
        throw new Error("Could not found a module for that command.");
      }
    }
  },
};
