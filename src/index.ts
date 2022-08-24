import { Client, Collection } from "discord.js"; // discord.js

import * as managers from "./managers";

// Main process that starts all other sub processes
const main = async () => {
  // Initiate client object
  const client = new Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
  });

  // Create command collection
  client.commands = new Collection();

  await managers.start(client);

  // Authorize with Discord's API
  await client.login(process.env.DISCORD_TOKEN);
};

main();
