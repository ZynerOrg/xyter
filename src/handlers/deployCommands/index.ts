import logger from "../../middlewares/logger";
import { Client } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { ICommand } from "../../interfaces/Command";

export default async (client: Client) => {
  const commandList: Array<RESTPostAPIApplicationCommandsJSONBody> = [];

  if (!client.commands) {
    throw new Error("client.commands is not defined");
  }

  logger.info("Gathering command list");

  await Promise.all(
    client.commands.map(async (commandData: ICommand) => {
      commandList.push(commandData.builder.toJSON());

      logger.verbose(`${commandData.builder.name} pushed to list`);
    })
  )
    .then(async () => {
      logger.info(`Finished gathering command list.`);
    })
    .catch(async (error) => {
      throw new Error(`Could not gather command list: ${error}`);
    });

  const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

  await rest
    .put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commandList,
    })
    .then(async () => {
      logger.info(`Finished updating command list.`);
    })
    .catch(async (error) => {
      logger.error(`${error}`);
    });

  if (process.env.NODE_ENV !== "production") {
    await rest
      .put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          process.env.DISCORD_GUILD_ID
        ),
        {
          body: commandList,
        }
      )
      .then(async () => logger.info(`Finished updating guild command list.`))
      .catch(async (error) => {
        logger.error(`${error}`);
      });
  }
};
