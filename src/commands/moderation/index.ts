import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
  SubcommandHandlers,
  executeSubcommand,
} from "../../handlers/executeSubcommand";

import * as prune from "./subcommands/prune";

const subcommandHandlers: SubcommandHandlers = {
  prune: prune.execute,
};

export const builder = new SlashCommandBuilder()
  .setName("moderation")
  .setDescription("Moderation.")
  .setDMPermission(false)
  .addSubcommand(prune.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, subcommandHandlers);
};
