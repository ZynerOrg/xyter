import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as ctrlpanel from "./subcommands/ctrlpanel";

import {
  SubcommandHandlers,
  executeSubcommand,
} from "../../handlers/executeSubcommand";

const subcommandHandlers: SubcommandHandlers = {
  ctrlpanel: ctrlpanel.execute,
};

export const builder = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Guild shop")
  .setDMPermission(false)
  .addSubcommand(ctrlpanel.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, subcommandHandlers);
};
