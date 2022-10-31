/* eslint-disable no-loops/no-loops */
import { Client } from "discord.js";
import checkDirectory from "../../helpers/checkDirectory";
import { ICommand } from "../../interfaces/Command";
import logger from "../../middlewares/logger";

// Register the commands.
export const register = async (client: Client) => {
  logger.info("🔧 Started command management");

  const commandNames = await checkDirectory("commands");
  if (!commandNames) return logger.warn("No available commands found");

  const totalCommands = commandNames.length;
  let loadedCommands = 0;

  logger.info(`🔧 Loading ${totalCommands} commands`);

  // Import an command.
  const importCommand = async (name: string) => {
    const command: ICommand = await import(`../../commands/${name}`);

    client.commands.set(command.builder.name, command);
    loadedCommands++;
  };

  for await (const commandName of commandNames) {
    await importCommand(commandName).then(() => {
      logger.verbose(`🔧 Loaded command "${commandName}"`);
    });

    if (loadedCommands === totalCommands) {
      logger.info("🔧 All commands loaded");
    }
  }
};
