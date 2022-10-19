import { Client, Collection, GatewayIntentBits } from "discord.js"; // discord.js
import "dotenv/config";
import * as managers from "./managers";


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

  await managers.start(client);

  // Authorize with Discord's API
  await client.login(process.env.DISCORD_TOKEN);
};

main();
