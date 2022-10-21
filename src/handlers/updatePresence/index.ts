// Dependencies
import { ActivityType, Client } from "discord.js";
import logger from "../../middlewares/logger";

// Function
export default (client: Client) => {
  if (!client?.user) throw new Error("Client's user is undefined.");
  const { guilds } = client;

  const memberCount = guilds.cache.reduce((a, g) => a + g.memberCount, 0);
  const guildCount = guilds.cache.size;

  const status = `${memberCount} users in ${guildCount} guilds.`;
  client.user.setPresence({
    activities: [{ type: ActivityType.Watching, name: status }],
    status: "online",
  });

  logger.info(`Client's presence is set to "${status}"`);
};
