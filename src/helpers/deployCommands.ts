import config from "../../config.json";
import logger from "../handlers/logger";
import fs from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

export default async () => {
  const commands = [];
  const commandFiles = fs.readdirSync("./src/commands");

  for (const file of commandFiles) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const command = require(`../commands/${file}`);
    commands.push(command.default.data.toJSON());
  }

  const rest = new REST({ version: "9" }).setToken(config.bot.token);

  await rest.put(Routes.applicationCommands(config.bot.clientId), {
    body: commands,
  });

  await rest
    .put(
      Routes.applicationGuildCommands(config.bot.clientId, config.bot.guildId),
      {
        body: commands,
      }
    )
    .then(async () =>
      logger.info("Successfully registered application commands.")
    )
    .catch(async (err) => {
      await logger.error(err);
    });
};
