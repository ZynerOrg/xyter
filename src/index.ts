import "tsconfig-paths/register"; // Allows using tsconfig.json paths during runtime

import { token, intents } from "@config/discord";

import { Client } from "discord.js"; // discord.js

import database from "@database";
import schedules from "@schedules";
import events from "@handlers/events";
import commands from "@handlers/commands";

// Main process that starts all other sub processes
const main = async () => {
  // Initiate client object
  const client = new Client({
    intents,
  });

  // Start database manager
  await database()
    .then(async () => {
      logger.silly("Database process started");
    })
    .catch(async (err) => {
      logger.error(err);
    });

  // Start schedule manager
  await schedules(client)
    .then(async () => {
      logger.silly("Schedules process started");
    })
    .catch(async (err) => {
      logger.error(err);
    });

  // Start command handler
  await commands(client)
    .then(async () => {
      logger.silly("Commands process started");
    })
    .catch(async (err) => {
      logger.error(err);
    });

  // Start event handler
  await events(client)
    .then(async () => {
      logger.silly("Events process started");
    })
    .catch(async (err) => {
      logger.error(err);
    });

  // Authorize with Discord's API
  await client.login(token);
};
main()
  .then(async () => {
    logger.silly("Main process started");
  })
  .catch(async (err) => {
    logger.error(err);
  });
