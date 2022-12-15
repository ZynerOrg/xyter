import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// Subcommands
import {
  builder as AuditsBuilder,
  execute as AuditsExecute,
} from "./subcommands/audits";
import {
  builder as CpggBuilder,
  execute as CpggExecute,
} from "./subcommands/cpgg";
import {
  builder as CreditsBuilder,
  execute as CreditsExecute,
} from "./subcommands/credits";
import {
  builder as EmbedsBuilder,
  execute as EmbedsExecute,
} from "./subcommands/embeds";
import {
  builder as PointsBuilder,
  execute as PointsExecute,
} from "./subcommands/points";
import {
  builder as ShopBuilder,
  execute as ShopExecute,
} from "./subcommands/shop";
import {
  builder as WelcomeBuilder,
  execute as WelcomeExecute,
} from "./subcommands/welcome";

export const builder = new SlashCommandBuilder()
  .setName("config")
  .setDescription("Manage guild configurations.")
  .setDMPermission(false)

  // Subcommands
  .addSubcommand(AuditsBuilder)
  .addSubcommand(CpggBuilder)
  .addSubcommand(CreditsBuilder)
  .addSubcommand(EmbedsBuilder)
  .addSubcommand(PointsBuilder)
  .addSubcommand(ShopBuilder)
  .addSubcommand(WelcomeBuilder);

// Execute function
export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "audits":
      await AuditsExecute(interaction);
      break;
    case "cpgg":
      await CpggExecute(interaction);
      break;
    case "credits":
      await CreditsExecute(interaction);
      break;
    case "embeds":
      await EmbedsExecute(interaction);
      break;
    case "points":
      await PointsExecute(interaction);
      break;
    case "shop":
      await ShopExecute(interaction);
      break;
    case "welcome":
      await WelcomeExecute(interaction);
      break;
    default:
      throw new Error("No module found for that specific command.");
  }
};
