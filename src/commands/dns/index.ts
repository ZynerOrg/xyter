import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
  SubcommandHandlers,
  executeSubcommand,
} from "../../handlers/executeSubcommand";

import * as lookup from "./subcommands/lookup";

const subcommandHandlers: SubcommandHandlers = {
  lookup: lookup.execute,
};

export const builder = new SlashCommandBuilder()
  .setName("dns")
  .setDescription("DNS commands.")
  .addSubcommand(lookup.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, subcommandHandlers);
};
