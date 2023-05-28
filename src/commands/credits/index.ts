import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
  SubcommandGroupHandlers,
  SubcommandHandlers,
  executeSubcommand,
} from "../../handlers/executeSubcommand";
import * as balance from "./subcommands/balance";
import * as gift from "./subcommands/gift";
import * as top from "./subcommands/top";
import * as work from "./subcommands/work";

import * as bonus from "./groups/bonus";

const subcommandHandlers: SubcommandHandlers = {
  balance: balance.execute,
  gift: gift.execute,
  top: top.execute,
  work: work.execute,
};

const subcommandGroupHandlers: SubcommandGroupHandlers = {
  bonus: {
    daily: bonus.subcommands.daily.execute,
    weekly: bonus.subcommands.weekly.execute,
    monthly: bonus.subcommands.monthly.execute,
  },
};

export const builder = new SlashCommandBuilder()
  .setName("credits")
  .setDescription("Manage your credits.")
  .setDMPermission(false)
  .addSubcommandGroup(bonus.builder)
  .addSubcommand(balance.builder)
  .addSubcommand(gift.builder)
  .addSubcommand(top.builder)
  .addSubcommand(work.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(
    interaction,
    subcommandHandlers,
    subcommandGroupHandlers
  );
};
