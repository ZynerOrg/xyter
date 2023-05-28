import { Client } from "discord.js";

import updatePresence from "../handlers/updatePresence";

export const options = {
  schedule: "*/1 * * * *", // https://crontab.guru/
};

export const execute = async (client: Client) => {
  updatePresence(client);
};
