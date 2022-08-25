/* eslint-disable no-loops/no-loops */
import logger from "../../middlewares/logger";
import getPluginCommandBuilder from "../getPluginCommandBuilder";
import getPluginCommandOptions from "../getPluginCommandOptions";
import listDir from "../listDir";

export default async (plugin: string) => {
  logger.debug(`Processing commands for plugin: ${plugin}`);
  const commands = (await listDir(`plugins/${plugin}/commands`)) || [];
  const commandStructure = [];

  for await (const command of commands) {
    logger.debug(`Processing command: ${command}`);

    const builder = await getPluginCommandBuilder(plugin, command);
    const options = await getPluginCommandOptions(plugin, command);

    commandStructure.push({ name: command, builder, options });
    logger.verbose(`Processed command: ${command}!`);
  }

  logger.verbose(`Processed commands for plugin: ${plugin}!`);
  return commandStructure;
};
