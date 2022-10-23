import { Client, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { ICommand } from "../../interfaces/Command";
import logger from "../../middlewares/logger";

export default async (client: Client) => {
  // 1. Destructure the client.
  const { application } = client;
  if (!application) throw new Error("No application found");

  // 2. Log that we are starting the command management.
  logger.info("🔧 Started command deployment");

  // 3. Get the commands.
  const commands: Array<RESTPostAPIApplicationCommandsJSONBody> = [];
  client.commands.forEach((command: ICommand) => {
    commands.push(command.builder.toJSON());

    logger.verbose(`🔧 Loaded command "${command.builder.name}"`);
  });

  // 4. Set the commands.
  await application.commands.set(commands).then(() => {
    logger.info("🔧 Deployed commands globally");
  });

  // 5. Tell the user that development mode is enabled.
  if (process.env.NODE_ENV === "development") {
    logger.info("🔧 Development mode enabled");

    await application.commands
      .set(commands, process.env.DISCORD_GUILD_ID)
      .then(() => {
        logger.verbose(`🔧 Deployed commands to guild`);
      });
  }

  // 6. Log that we are done with the command management.
  logger.info("🔧 Finished command deployment");
};
