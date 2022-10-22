import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Modules
import {
  builder as BalanceBuilder,
  execute as BalanceExecute,
} from "./modules/balance";
import { builder as GiftBuilder, execute as GiftExecute } from "./modules/gift";
import { builder as TopBuilder, execute as TopExecute } from "./modules/top";
import { builder as WorkBuilder, execute as WorkExecute } from "./modules/work";

// 1. Export a builder function.
export const builder = new SlashCommandBuilder()
  .setName("credits")
  .setDescription("Manage your credits.")
  .setDMPermission(false)

  // Modules
  .addSubcommand(BalanceBuilder)
  .addSubcommand(GiftBuilder)
  .addSubcommand(TopBuilder)
  .addSubcommand(WorkBuilder);

// 2. Export an execute function.
export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "balance":
      await BalanceExecute(interaction);
      break;
    case "gift":
      await GiftExecute(interaction);
      break;
    case "top":
      await TopExecute(interaction);
      break;
    case "work":
      await WorkExecute(interaction);
      break;
    default:
      throw new Error("Subcommand not found");
  }
};
