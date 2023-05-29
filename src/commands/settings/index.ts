import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import {
  SubcommandHandlers,
  executeSubcommand,
} from "../../handlers/executeSubcommand";
import * as credits from "./subcommands/credits";
import * as ctrlpanel from "./subcommands/ctrlpanel";
import * as quotes from "./subcommands/quotes";

const subcommandHandlers: SubcommandHandlers = {
  ctrlpanel: ctrlpanel.execute,
  credits: credits.execute,
  quotes: quotes.execute,
};

export const builder = new SlashCommandBuilder()
  .setName("settings")
  .setDescription("Manage guild configurations.")
  .setDMPermission(false)
  .addSubcommand(ctrlpanel.builder)
  .addSubcommand(credits.builder)
  .addSubcommand(quotes.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, subcommandHandlers);
};
