import { SlashCommandSubcommandGroupBuilder } from "discord.js";
import * as daily from "./subcommands/daily";
import * as monthly from "./subcommands/monthly";
import * as weekly from "./subcommands/weekly";

export const builder = (group: SlashCommandSubcommandGroupBuilder) => {
  return group
    .setName("bonus")
    .setDescription("Get bonuses")
    .addSubcommand(daily.builder)
    .addSubcommand(weekly.builder)
    .addSubcommand(monthly.builder);
};

export const subcommands = {
  daily,
  weekly,
  monthly,
};
