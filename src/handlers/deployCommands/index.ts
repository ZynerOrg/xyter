import { Client, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import logger from "../../middlewares/logger";

export default async (client: Client) => {
  const { application } = client;
  if (!application) throw new Error("No application found");

  const builders: Array<RESTPostAPIApplicationCommandsJSONBody> = [];

  client.commands.forEach((command) => {
    builders.push(command.builder.toJSON());
  });

  await application.commands.set(builders).then(() => {
    logger.info({ builders, message: "Registered commands to users!" });
  });

  if (process.env.NODE_ENV === "development") {
    await application.commands
      .set(builders, process.env.DISCORD_GUILD_ID)
      .then(() => {
        logger.info({
          builders,
          devGuildId: process.env.DISCORD_GUILD_ID,
          message: "Registered commands to development guild!",
        });
      });
  }
};
