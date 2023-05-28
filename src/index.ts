import { Client, Collection, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import registerEvents from "./handlers/registerEvents";
import scheduleJobs from "./handlers/scheduleJobs";
import logger from "./utils/logger";

(async () => {
  try {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    client.commands = new Collection();

    await registerEvents(client);
    await scheduleJobs(client);

    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    logger.error("An error occurred in the main process:", error);
  }
})();
