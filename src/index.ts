import { Client, Collection, GatewayIntentBits } from "discord.js"; // discord.js
import "dotenv/config";
import { register as commandRegister } from "./handlers/command";
import { register as eventRegister } from "./handlers/event";
import { start as scheduleStart } from "./handlers/schedule";

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

  // Start critical handlers
  await scheduleStart(client);
  await eventRegister(client);
  await commandRegister(client);

  // Authorize with Discord's API
  await client.login(process.env.DISCORD_TOKEN);
};

main();
