import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as cpgg from "./subcommands/cpgg";

export const builder = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Guild shop")
  .setDMPermission(false)
  .addSubcommand(cpgg.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "cpgg": {
      await cpgg.execute(interaction);
      break;
    }
    default: {
      throw new Error("Unknown command");
    }
  }
};
