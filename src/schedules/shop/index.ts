// Dependencies
import { Client } from "discord.js";

import * as roles from "./modules/roles";

export const options = {
  schedule: "*/5 * * * *", // https://crontab.guru/
};

export const execute = async (client: Client) => {
  await roles.execute(client);
};
