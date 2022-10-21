import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { Client } from "discord.js";
import { ICommand } from "../../interfaces/Command";
import logger from "../../middlewares/logger";

export default async (client: Client) => {
  const commandList: Array<RESTPostAPIApplicationCommandsJSONBody> = [];

  if (!client.commands) {
    throw new Error("client.commands is not defined");
  }

  logger.info("Gathering command list");

  await Promise.all(
    client.commands.map((commandData: ICommand) => {
      commandList.push(commandData.builder.toJSON());

      logger.verbose(`${commandData.builder.name} pushed to list`);
    })
  )
    .then(() => {
      logger.info(`Finished gathering command list.`);
    })
    .catch((error) => {
      throw new Error(`Could not gather command list: ${error}`);
    });

  await client.application?.commands
    .set(commandList, process.env.DISCORD_GUILD_ID)
    .then(() => {
      logger.info(`Finished updating command list.`);
    });

  if (process.env.NODE_ENV !== "production") {
    await client.application?.commands
      .set(commandList)
      .then(() => logger.info(`Finished updating guild command list.`));
  }
};
