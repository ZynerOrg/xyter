// Dependencies
import { ActivityType, Client } from "discord.js";
import logger from "../../middlewares/logger";

// Function
export default (client: Client) => {
  // 1. Destructure the client.
  const { guilds, user } = client;
  if (!user) throw new Error("No user found");

  // 2. Get the total number of guilds and members.
  const memberCount = guilds.cache.reduce((a, g) => a + g.memberCount, 0);
  const guildCount = guilds.cache.size;

  // 3. Set the presence.
  user.setPresence({
    activities: [
      {
        name: `${guildCount} guilds | ${memberCount} members`,
        type: ActivityType.Watching,
      },
    ],
  });

  // 4. Log the presence.
  return logger.info(
    `👀 Presence set to "${guildCount} guilds | ${memberCount} members"`
  );
};
