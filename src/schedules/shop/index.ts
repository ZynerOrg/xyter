// Dependencies
import { Client } from "discord.js";

import { execute as RolesExecute } from "./modules/roles";

export const options = {
  schedule: "*/5 * * * *", // https://crontab.guru/
};

export const execute = async (client: Client) => {
  await RolesExecute(client);
};
