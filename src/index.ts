import { Client, Collection, GatewayIntentBits } from "discord.js"; // discord.js
import "dotenv/config";
import * as command from "./handlers/command";
import * as event from "./handlers/event";
import * as schedule from "./handlers/schedule";

// Main process that starts all other sub processes
const main = async () => {
  // Initiate client object
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  // Create command collection
  client.commands = new Collection();

  await schedule.start(client);
  await event.register(client);
  await command.register(client);

  // Authorize with Discord's API
  await client.login(process.env.DISCORD_TOKEN);
};

main();
