import logger from "../../../handlers/logger";
import timeouts from "../../../helpers/database/models/timeoutSchema";
import { Message } from "discord.js";
export default async (guildDB: any, userDB: any, message: Message) => {
  const { guild, author, channel, content } = message;

  // If message length is below guild minimum length
  if (content.length < guildDB.credits.minimumLength) return;

  // Check if user has a timeout
  const isTimeout = await timeouts.findOne({
    guildId: guild?.id,
    userId: author.id,
    timeoutId: "2022-03-15-17-42",
  });

  // If user is not on timeout
  if (!isTimeout) {
    // Add credits to user

    userDB.credits += guildDB.credits.rate;

    await userDB
      .save()
      .then(async () => {
        // Send debug message
        await logger.debug(
          `Guild: ${guild?.id} User: ${author.id} Channel: ${channel.id} credits add ${guildDB.credits.rate} balance: ${userDB.credits}`
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
      timeoutId: "2022-03-15-17-42",
    });

    setTimeout(async () => {
      // Send debug message
      await logger.debug(
        `Guild: ${guild?.id} User: ${author.id} Channel: ${
          channel.id
        } has not talked within last ${
          guildDB.credits.timeout / 1000
        } seconds, credits can be given`
      );

      // When timeout is out, remove it from the database
      await timeouts.deleteOne({
        guildId: guild?.id,
        userId: author.id,
        timeoutId: "2022-03-15-17-42",
      });
    }, guildDB.credits.timeout);
  } else {
    // Send debug message
    await logger.debug(
      `Guild: ${guild?.id} User: ${author.id} Channel: ${
        channel.id
      } has talked within last ${
        guildDB.credits.timeout / 1000
      } seconds, no credits given`
    );
  }
};
