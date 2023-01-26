import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";
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

export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "give":
      await give.execute(interaction);
      break;
    case "set":
      await set.execute(interaction);
      break;
    case "take":
      await take.execute(interaction);
      break;
    case "transfer":
      await transfer.execute(interaction);
      break;
    case "giveaway":
      await giveaway.execute(interaction);
      break;
    default:
      throw new Error("Invalid subcommand");
  }
};
