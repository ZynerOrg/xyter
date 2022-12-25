import { Client } from "discord.js";
import checkDirectory from "../../helpers/checkDirectory";
import { ICommand } from "../../interfaces/Command";
import logger from "../../middlewares/logger";

// Register the commands.
export const register = async (client: Client) => {
  const profiler = logger.startTimer();

  await checkDirectory("commands").then((commandNames) => {
    commandNames.forEach(async (commandName) => {
      const commandProfiler = logger.startTimer();

      await import(`../../commands/${commandName}`)
        .then((command: ICommand) => {
          client.commands.set(command.builder.name, command);

          commandProfiler.done({
            commandName,
            message: `Registered command '${commandName}'`,
            level: "debug",
          });

          return command;
        })
        .catch((error) => {
          commandProfiler.done({
            message: `Failed to register command '${commandName}'`,
            commandName,
            error,
            level: "error",
          });
        });
    });
  });

  return profiler.done({
    message: "Successfully registered all commands!",
  });
};
