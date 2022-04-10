import fs from "fs"; // fs
import { Collection } from "discord.js"; // discord.js
import { Client } from "../types/common/discord";
export default async (client: Client) => {
  client.commands = new Collection();
  const commandFiles = fs.readdirSync("./src/commands");

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    client.commands.set(command.default.data.name, command.default);
  }
};
