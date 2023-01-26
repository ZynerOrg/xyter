import { Client } from "discord.js";

import updatePresence from "../helpers/updatePresence";

export const options = {
  schedule: "*/5 * * * *", // https://crontab.guru/
};

export const execute = async (client: Client) => {
  updatePresence(client);
};
