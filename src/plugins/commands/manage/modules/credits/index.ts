import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import modules from "./modules";

export const moduleData = modules;

export const builder = (group: SlashCommandSubcommandGroupBuilder) => {
  return group
    .setName("credits")
    .setDescription("Manage the credits of a user.")
    .addSubcommand(modules.give.builder)
    .addSubcommand(modules.set.builder)
    .addSubcommand(modules.take.builder)
    .addSubcommand(modules.transfer.builder)
    .addSubcommand(modules.giveaway.builder);
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "give":
      await modules.give.execute(interaction);
      break;
    case "set":
      await modules.set.execute(interaction);
      break;
    case "take":
      await modules.take.execute(interaction);
      break;
    case "transfer":
      await modules.transfer.execute(interaction);
      break;
    case "giveaway":
      await modules.giveaway.execute(interaction);
      break;
    default:
      throw new Error("No module found for that specific command");
  }
};
