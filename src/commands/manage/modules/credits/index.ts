import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

// Modules
import moduleGive from "./modules/give";
import moduleGiveaway from "./modules/giveaway";
import moduleSet from "./modules/set";
import moduleTake from "./modules/take";
import moduleTransfer from "./modules/transfer";

export default {
  builder: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("credits")
      .setDescription("Manage the credits of a user.")
      .addSubcommand(moduleGive.builder)
      .addSubcommand(moduleSet.builder)
      .addSubcommand(moduleTake.builder)
      .addSubcommand(moduleTransfer.builder)
      .addSubcommand(moduleGiveaway.builder);
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    switch (interaction.options.getSubcommand()) {
      case "give":
        await moduleGive.execute(interaction);
        break;
      case "set":
        await moduleSet.execute(interaction);
        break;
      case "take":
        await moduleTake.execute(interaction);
        break;
      case "transfer":
        await moduleTransfer.execute(interaction);
        break;
      case "giveaway":
        await moduleGiveaway.execute(interaction);
        break;
      default:
        throw new Error("No module found for that specific command");
    }
  },
};
