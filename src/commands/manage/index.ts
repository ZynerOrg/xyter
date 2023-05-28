import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
  SubcommandGroupHandlers,
  executeSubcommand,
} from "../../handlers/executeSubcommand";
import * as credits from "./groups/credits";

const subcommandGroupHandlers: SubcommandGroupHandlers = {
  credits: {
    give: credits.subcommands.give.execute,
    giveaway: credits.subcommands.giveaway.execute,
    set: credits.subcommands.set.execute,
    take: credits.subcommands.take.execute,
    transfer: credits.subcommands.transfer.execute,
  },
};

export const builder = new SlashCommandBuilder()
  .setName("manage")
  .setDescription("Manage the bot.")
  .setDMPermission(false)
  .addSubcommandGroup(credits.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, {}, subcommandGroupHandlers);
};
