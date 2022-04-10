import logger from "../../../handlers/logger";
import timeouts from "../../../helpers/database/models/timeoutSchema";

import { Message } from "discord.js";
export default async (guildDB: any, userDB: any, message: Message) => {
  const { author, guild, channel, content } = message;

  // If message length is below guild minimum length
  if (content.length < guildDB.points.minimumLength) return;

  // Check if user has a timeout
  const isTimeout = await timeouts.findOne({
    guildId: guild?.id,
    userId: author.id,
    timeoutId: "2022-03-15-17-41",
  });

  // If user is not on timeout
  if (!isTimeout) {
    // Add points to user
    userDB.points += guildDB.points.rate;

    await userDB
      .save()
      .then(async () => {
        // Send debug message
        await logger.debug(
          `Guild: ${guild?.id} User: ${author.id} Channel: ${channel.id} points add: ${guildDB.points.rate} balance: ${userDB.points}`
        );
      })
      .catch(async (e: any) => {
        // Send error message
        await logger.error(e);
      });

    // Create a timeout for the user
    await timeouts.create({
      guildId: guild?.id,
      userId: author.id,
      timeoutId: "2022-03-15-17-41",
    });

    setTimeout(async () => {
      // Send debug message
      await logger.debug(
        `Guild: ${guild?.id} User: ${author.id} Channel: ${
          channel.id
        } has not talked within last ${
          guildDB.points.timeout / 1000
        } seconds, points can be given`
      );

      // When timeout is out, remove it from the database
      await timeouts.deleteOne({
        guildId: guild?.id,
        userId: author.id,
        timeoutId: "2022-03-15-17-41",
      });
    }, guildDB.points.timeout);
  } else {
    // Send debug message
    await logger.debug(
      `Guild: ${guild?.id} User: ${author.id} Channel: ${
        channel.id
      } has talked within last ${
        guildDB.points.timeout / 1000
      } seconds, no points given`
    );
  }
};
