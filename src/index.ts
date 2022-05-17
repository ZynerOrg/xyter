import "tsconfig-paths/register"; // Allows using tsconfig.json paths during runtime

import { token, intents } from "@config/discord";

import { Client } from "discord.js"; // discord.js

import database from "@database";
import schedules from "@schedules";
import events from "@handlers/events";
import commands from "@handlers/commands";

const main = async () => {
  const client = new Client({
    intents,
  });

  database()
    .then(async () => {
      logger.silly("Database process started");
    })
    .catch(async (err) => {
      logger.error(err);
    });
  schedules(client)
    .then(async () => {
      logger.silly("Schedules process started");
    })
    .catch(async (err) => {
      logger.error(err);
    });

  commands(client)
    .then(async () => {
      logger.silly("Commands process started");
    })
    .catch(async (err) => {
      logger.error(err);
    });

  events(client)
    .then(async () => {
      logger.silly("Events process started");
    })
    .catch(async (err) => {
      logger.error(err);
    });

  client.login(token);
};

main()
  .then(async () => {
    logger.silly("Main process started");
  })
  .catch(async (err) => {
    logger.error(err);
  });
