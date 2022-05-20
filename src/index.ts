import "tsconfig-paths/register"; // Allows using tsconfig.json paths during runtime

import { token, intents } from "@config/discord";

import { Client } from "discord.js"; // discord.js

import database from "@root/events";
import schedules from "@handlers/schedules";
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
      await logger.silly("Database process started");
    })
    .catch(async (err) => {
      await logger.error(`${err}`);
    });

  // Start schedule manager
  await schedules(client)
    .then(async () => {
      await logger.silly("Schedules process started");
    })
    .catch(async (err) => {
      await logger.error(`${err}`);
    });

  // Start command handler
  await commands(client)
    .then(async () => {
      await logger.silly("Commands process started");
    })
    .catch(async (err) => {
      await logger.error(`${err}`);
    });

  // Start event handler
  await events(client)
    .then(async () => {
      await logger.silly("Events process started");
    })
    .catch(async (err) => {
      await logger.error(`${err}`);
    });

  // Authorize with Discord's API
  await client.login(token);
};

main()
