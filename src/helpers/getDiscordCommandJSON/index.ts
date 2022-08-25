/* eslint-disable no-loops/no-loops */
import path from "path";

import listDir from "../listDir";
import getPlugins from "../getPlugins";
import getPluginCommands from "../getPluginCommands";
import getPluginMetadata from "../getPluginMetadata";
import getPluginCommandBuilder from "../getPluginCommandBuilder";
import { SlashCommandBuilder } from "discord.js";
import logger from "../../middlewares/logger";

export default async () => {
  logger.debug("Processing complete builder for plugins");
  const plugins = await getPlugins("plugins");
  const pluginBuilders = [];

  for await (const plugin of plugins) {
    logger.debug(`Processing builder for plugin: ${plugin}`);

    const commands = await getPluginCommands(plugin);

    const builderStructure = new SlashCommandBuilder()
      .setName(plugin)
      .setDescription("Get info about a user or a server!");

    for await (const command of commands) {
      logger.debug(`Processing builder of command: ${command.name}`);
      if (command?.options?.group) {
        logger.debug(`Processing subcommand group: ${command.builder.name}`);
        builderStructure.addSubcommandGroup(command.builder);
        logger.verbose(`Processed subcommand group: ${command.builder.name}!`);
      } else {
        logger.debug(`Processing subcommand: ${command.builder.name}`);
        builderStructure.addSubcommand(command.builder);
        logger.verbose(`Processed subcommand: ${command.builder.name}!`);
      }
      logger.verbose(`Processed builder of command: ${command.name}!`);
    }

    pluginBuilders.push(builderStructure);

    logger.verbose(`Processed builder for plugin: ${plugin}!`);
  }

  logger.verbose("Processed complete builder for plugins!");
  return pluginBuilders;
};
