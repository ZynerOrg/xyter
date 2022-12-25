// Dependencies
import { ActivitiesOptions, ActivityType, Client } from "discord.js";
import logger from "../../middlewares/logger";

// Function
export default (client: Client) => {
  // 1. Destructure the client.
  const { guilds, user } = client;
  if (!user) throw new Error("No user found");

  // 2. Get the total number of guilds and members.
  const memberCount = guilds.cache.reduce((a, g) => a + g.memberCount, 0);
  const guildCount = guilds.cache.size;

  const activities: ActivitiesOptions[] = [
    {
      name: `${guildCount} servers︱${memberCount} users`,
      type: ActivityType.Watching,
    },
  ];

  const activity = activities[Math.floor(Math.random() * activities.length)];

  // 3. Set the presence.
  user.setActivity(activity);

  // 4. Log the presence.
  return logger.debug({
    guildCount,
    memberCount,
    message: `Presence updated`,
    activity,
  });
};
