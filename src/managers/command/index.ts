import { Client } from "discord.js";
import listDir from "../../helpers/checkDirectory";
import { ICommand } from "../../interfaces/Command";
import logger from "../../middlewares/logger";

export const register = async (client: Client) => {
  // Get name of directories containing commands
  const commandNames = await listDir("plugins/commands");
  if (!commandNames) throw new Error("📦 No commands available");

  const amountOfCommands = commandNames.length;
  let importedCommandAmount = 0;
  logger.info(`📦 Trying to load ${amountOfCommands} commands`);

  const importCommand = async (commandName: string) => {
    // Import command from plugins/commands
    const command: ICommand = await import(
      `../../plugins/commands/${commandName}`
    );
    if (!command)
      throw new Error(`📦 No command found while importing "${commandName}"`);
    if (!command.builder)
      throw new Error(
        `📦 No command builder found while importing "${commandName}"`
      );
    if (!command.execute)
      throw new Error(
        `📦 No command execute found while importing "${commandName}"`
      );
    if (!command.moduleData)
      throw new Error(
        `📦 No command moduleData found while importing "${commandName}"`
      );

    // Add command to collection
    client.commands.set(command.builder.name, command);
    importedCommandAmount += 1;
  };

  // Send log message when it's done loading commands
  const doneImporting = async () => {
    if (importedCommandAmount !== amountOfCommands) {
      return logger.warn(
        `📦 Failed importing ${
          amountOfCommands - importedCommandAmount
        } of ${amountOfCommands} commands`
      );
    }

    return logger.info(`📦 Managed to load all commands`);
  };

  // Start importing commands
  commandNames.forEach(async (commandName: string, index: number) => {
    await importCommand(commandName)
      .then(async () => {
        logger.debug(`📦 Imported the "${commandName}" command`);
      })
      .catch(async (err) => {
        logger.error(err);
      });

    // If done importing
    if (index + 1 === amountOfCommands) {
      await doneImporting();
    }
  });
};
