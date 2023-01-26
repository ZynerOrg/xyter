import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as roles from "./groups/roles";
import * as cpgg from "./subcommands/cpgg";

export const builder = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Shop for credits and custom roles.")
  .setDMPermission(false)
  .addSubcommand(cpgg.builder)
  .addSubcommandGroup(roles.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options } = interaction;

  switch (options.getSubcommand()) {
    case "cpgg": {
      await cpgg.execute(interaction);
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
      await roles.execute(interaction);
      break;
    }
    default: {
      throw new Error("Could not find module for that command.");
    }
  }
};
