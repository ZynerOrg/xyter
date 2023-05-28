import { SlashCommandSubcommandGroupBuilder } from "discord.js";
import * as give from "./subcommands/give";
import * as giveaway from "./subcommands/giveaway";
import * as set from "./subcommands/set";
import * as take from "./subcommands/take";
import * as transfer from "./subcommands/transfer";

export const builder = (group: SlashCommandSubcommandGroupBuilder) => {
  return group
    .setName("credits")
    .setDescription("Manage the credits of a user.")
    .addSubcommand(give.builder)
    .addSubcommand(set.builder)
    .addSubcommand(take.builder)
    .addSubcommand(transfer.builder)
    .addSubcommand(giveaway.builder);
};

export const subcommands = {
  give,
  set,
  take,
  transfer,
  giveaway,
};
