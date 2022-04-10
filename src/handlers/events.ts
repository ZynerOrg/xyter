import fs from "fs"; // fs
import { Client } from "discord.js"; // discord.js

export default async (client: Client) => {
  const eventFiles = fs.readdirSync("./src/events");

  for (const file of eventFiles) {
    const event = require(`../events/${file}`);
    if (event.once) {
      client.once(event.default.name, (...args) =>
        event.default.execute(...args)
      );
    } else {
      client.on(event.default.name, (...args) =>
        event.default.execute(...args)
      );
    }
  }
};
