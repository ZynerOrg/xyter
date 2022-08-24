import "dotenv/config";
import { Client } from "discord.js";

import * as database from "./database";
import * as schedule from "./schedule";
import * as event from "./event";
import * as command from "./command";

export const start = async (client: Client) => {
  await database.connect();
  await schedule.start(client);
  await command.register(client);
  await event.register(client);
};
