//Dependencies
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Modules
import {
  builder as CountersBuilder,
  execute as CountersExecute,
} from "./groups/counters";
import {
  builder as CreditsBuilder,
  execute as CreditsExecute,
} from "./groups/credits";

// Function
export const builder = new SlashCommandBuilder()
  .setName("manage")
  .setDescription("Manage the bot.")
  .setDMPermission(false)

  // Modules
  .addSubcommandGroup(CountersBuilder)
  .addSubcommandGroup(CreditsBuilder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  // Destructure
  const { options } = interaction;

  switch (options.getSubcommandGroup()) {
    case "credits": {
      await CreditsExecute(interaction);
      break;
    }
    case "counters": {
      await CountersExecute(interaction);
      break;
    }
    default: {
      throw new Error("Could not find an module for the command.");
    }
  }
};
