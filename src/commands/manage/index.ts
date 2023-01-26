import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as counters from "./groups/counters";
import * as credits from "./groups/credits";

export const builder = new SlashCommandBuilder()
  .setName("manage")
  .setDescription("Manage the bot.")
  .setDMPermission(false)
  .addSubcommandGroup(counters.builder)
  .addSubcommandGroup(credits.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommandGroup()) {
    case "counters": {
      await counters.execute(interaction);
      break;
    }
    case "credits": {
      await credits.execute(interaction);
      break;
    }
    default: {
      throw new Error("Invalid group");
    }
  }
};
