import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Modules
import moduleAudits from "./modules/audits";
import moduleCpgg from "./modules/cpgg";
import moduleCredits from "./modules/credits";
import moduleEmbeds from "./modules/embeds";
import modulePoints from "./modules/points";
import moduleShop from "./modules/shop";
import moduleWelcome from "./modules/welcome";

export const builder = new SlashCommandBuilder()
  .setName("config")
  .setDescription("Manage guild configurations.")
  .setDMPermission(false)

  // Modules
  .addSubcommand(moduleAudits.builder)
  .addSubcommand(moduleCpgg.builder)
  .addSubcommand(moduleCredits.builder)
  .addSubcommand(moduleEmbeds.builder)
  .addSubcommand(modulePoints.builder)
  .addSubcommand(moduleShop.builder)
  .addSubcommand(moduleWelcome.builder);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "audits":
      await moduleAudits.execute(interaction);
      break;
    case "cpgg":
      await moduleCpgg.execute(interaction);
      break;
    case "credits":
      await moduleCredits.execute(interaction);
      break;
    case "embeds":
      await moduleEmbeds.execute(interaction);
      break;
    case "points":
      await modulePoints.execute(interaction);
      break;
    case "shop":
      await moduleShop.execute(interaction);
      break;
    case "welcome":
      await moduleWelcome.execute(interaction);
      break;
    default:
      throw new Error("No module found for that specific command.");
  }
};
