import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as check from "./subcommands/check";
import * as repute from "./subcommands/repute";

export const builder = new SlashCommandBuilder()
  .setName("reputation")
  .setDescription(
    "See and give reputation to users to show others how trustworthy they are"
  )
  .setDMPermission(false)
  .addSubcommand(repute.builder)
  .addSubcommand(check.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "repute":
      await repute.execute(interaction);
      break;
    case "check":
      await check.execute(interaction);
      break;
    default:
      break;
  }
};
