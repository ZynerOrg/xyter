/* eslint-disable no-loops/no-loops */
import { Client } from "discord.js";
import checkDirectory from "../../helpers/checkDirectory";
import { ICommand } from "../../interfaces/Command";
import logger from "../../middlewares/logger";

// Register the commands.
export const register = async (client: Client) => {
  await checkDirectory("commands").then(async (commandNames) => {
    for await (const commandName of commandNames) {
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
    }
  });
};
