import { ActivitiesOptions, ActivityType, Client } from "discord.js";
import logger from "../utils/logger";

export default async (client: Client) => {
  const { guilds, user } = client;
  if (!user) {
    logger.error("No user found");
    throw new Error("No user found");
  }

  const memberCount = guilds.cache.reduce(
    (acc, guild) => acc + (guild.memberCount || 0),
    0
  );
  const guildCount = guilds.cache.size;

  const activities: ActivitiesOptions[] = [
    {
      name: `${memberCount} users`,
      type: ActivityType.Watching,
    },
    {
      name: `${guildCount} servers`,
      type: ActivityType.Watching,
    },
  ];

  const shuffleArray = <T>(array: T[]): T[] => {
    return array.sort(() => Math.random() - 0.5);
  };

  const shuffledActivities = shuffleArray(activities);
  const activity = shuffledActivities[0];

  try {
    await user.setActivity(activity);
    logger.debug({
      guildCount,
      memberCount,
      message: "Presence updated",
      activity,
    });
  } catch (error) {
    logger.error({
      guildCount,
      memberCount,
      message: "Failed to update presence",
      error,
    });
    throw new Error("Failed to update presence");
  }
};
