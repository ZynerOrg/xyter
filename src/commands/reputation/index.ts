import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
  SubcommandHandlers,
  executeSubcommand,
} from "../../handlers/executeSubcommand";

import * as check from "./subcommands/check";
import * as repute from "./subcommands/repute";

const subcommandHandlers: SubcommandHandlers = {
  repute: repute.execute,
  check: check.execute,
};

export const builder = new SlashCommandBuilder()
  .setName("reputation")
  .setDescription(
    "See and give reputation to users to show others how trustworthy they are"
  )
  .setDMPermission(false)
  .addSubcommand(repute.builder)
  .addSubcommand(check.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, subcommandHandlers);
};
