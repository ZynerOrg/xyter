import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";

// Modules
import {
  builder as GiveBuilder,
  execute as GiveExecute,
} from "./subcommands/give";
import {
  builder as GiveawayBuilder,
  execute as GiveawayExecute,
} from "./subcommands/giveaway";
import {
  builder as SetBuilder,
  execute as SetExecute,
} from "./subcommands/set";
import {
  builder as TakeBuilder,
  execute as TakeExecute,
} from "./subcommands/take";
import {
  builder as TransferBuilder,
  execute as TransferExecute,
} from "./subcommands/transfer";

export const builder = (group: SlashCommandSubcommandGroupBuilder) => {
  return group
    .setName("credits")
    .setDescription("Manage the credits of a user.")
    .addSubcommand(GiveBuilder)
    .addSubcommand(SetBuilder)
    .addSubcommand(TakeBuilder)
    .addSubcommand(TransferBuilder)
    .addSubcommand(GiveawayBuilder);
};
export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "give":
      await GiveExecute(interaction);
      break;
    case "set":
      await SetExecute(interaction);
      break;
    case "take":
      await TakeExecute(interaction);
      break;
    case "transfer":
      await TransferExecute(interaction);
      break;
    case "giveaway":
      await GiveawayExecute(interaction);
      break;
    default:
      throw new Error("No module found for that specific command");
  }
};
