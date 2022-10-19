import { Client } from "discord.js";

import * as command from "./command";
import * as event from "./event";
import * as schedule from "./schedule";

export const start = async (client: Client) => {
  // await database.connect();
  await schedule.start(client);
  await command.register(client);
  await event.register(client);
};
