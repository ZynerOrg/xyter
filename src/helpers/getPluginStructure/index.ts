/* eslint-disable no-loops/no-loops */

import { Client } from "discord.js";
import logger from "../../middlewares/logger";
import getPluginCommands from "../getPluginCommands";
import getPluginMetadata from "../getPluginMetadata";
import getPlugins from "../getPlugins";

export default async (client: Client, dir: string) => {
  const plugins = await getPlugins(dir);
  const pluginStructure = [];

  logger.debug("Processing structure of plugins...");

  for await (const plugin of plugins) {
    logger.debug(`Processing structure of plugin: ${plugin}`);
    const commands = await getPluginCommands(plugin);
    const metadata = await getPluginMetadata(plugin);

    pluginStructure.push({
      plugin,
      commands,
      metadata,
    });

    client.commands.set(plugin, commands);

    logger.verbose(`Processed structure of plugin: ${plugin}!`);
  }

  logger.verbose("Processed structure of plugins!");

  return pluginStructure;
};
