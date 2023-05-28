import { Client, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { ICommand } from "../interfaces/Command";
import logger from "../utils/logger";
import checkDirectory from "../utils/readDirectory";

export default async (client: Client) => {
  const profiler = logger.startTimer();
  const { application } = client;

  if (!application) throw new Error("No application found");

  const builders: RESTPostAPIApplicationCommandsJSONBody[] = [];

  const commandNames = await checkDirectory("commands");

  await Promise.all(
    commandNames.map(async (commandName) => {
      const commandProfiler = logger.startTimer();

      try {
        const command: ICommand = await import(`../commands/${commandName}`);
        const commandBuilder = command.builder.toJSON();

        const existingCommand = client.commands.get(commandBuilder.name);
        if (existingCommand) {
          client.commands.delete(commandBuilder.name);
          commandProfiler.done({
            message: `Removed existing command '${commandBuilder.name}'`,
            commandName,
            level: "debug",
          });
        }

        client.commands.set(commandBuilder.name, command);
        builders.push(commandBuilder);

        commandProfiler.done({
          commandName,
          message: `Registered command '${commandBuilder.name}'`,
          level: "debug",
        });
      } catch (error) {
        commandProfiler.done({
          message: `Failed to register command '${commandName}'`,
          commandName,
          error,
          level: "error",
        });
      }
    })
  );

  await Promise.all([
    application.commands.set(builders),
    process.env.NODE_ENV === "development"
      ? application.commands.set(builders, process.env.DISCORD_GUILD_ID)
      : Promise.resolve(),
  ]).then(() => {
    logger.info({ builders, message: "Registered commands!" });
  });

  return profiler.done({
    message: "Successfully registered all commands!",
  });
};
