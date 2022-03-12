const logger = require('../handlers/logger');

const {
  users,
  guilds,
  experiences,
  credits,
  timeouts,
} = require('../helpers/database/models');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Get guild object

    const guild = await guilds.findOne({ guildId: message.guild.id });

    // Stop if message author is bot

    if (message.author.bot) return;

    // Create user if not already created

    await users.findOne(
      { userId: message.author.id },
      { new: true, upsert: true }
    );

    // Stop if message content is shorter than guild configured minimum length

    if (message.content.length < guild.credits.minimumLength) return;

    // Needs to be updated for multi-guild to function properly
    // if (config.credits.excludedChannels.includes(message.channel.id)) return;

    // Check if user has a timeout

    const isTimeout = await timeouts.findOne({
      guildId: message.guild.id,
      userId: message.author.id,
      timeoutId: 1,
    });

    // If user is not on timeout

    if (!isTimeout) {
      // Add credits to user

      await credits
        .findOneAndUpdate(
          { userId: message.author.id, guildId: message.guild.id },
          { $inc: { balance: guild.credits.rate } },
          { new: true, upsert: true }
        )
        .then(async () =>
          logger.debug(
            `Guild: ${message.guild.id} Credits added to user: ${message.author.id}`
          )
        )
        .catch(async (err) => {
          await logger.error(err);
        });

      // Add points to user

      await experiences
        .findOneAndUpdate(
          { userId: message.author.id, guildId: message.guild.id },
          { $inc: { points: guild.points.rate } },
          { new: true, upsert: true }
        )
        .then(async () =>
          logger.debug(
            `Guild: ${message.guild.id} Points added to user: ${message.author.id}`
          )
        )
        .catch(async (err) => {
          await logger.error(err);
        });

      // Create a timeout for the user

      await timeouts.create({
        guildId: message.guild.id,
        userId: message.author.id,
        timeoutId: 1,
      });

      setTimeout(async () => {
        await logger.debug(
          `Guild: ${message.guild.id} User: ${
            message.author.id
          } has not talked within last ${
            guild.credits.timeout / 1000
          } seconds, credits can be given`
        );

        // When timeout is out, remove it from the database

        await timeouts.deleteOne({
          guildId: message.guild.id,
          userId: message.author.id,
          timeoutId: 1,
        });
      }, guild.credits.timeout);
    } else {
      await logger.debug(
        `Guild: ${message.guild.id} User: ${
          message.author.id
        } has talked within last ${
          guild.credits.timeout / 1000
        } seconds, no credits given`
      );
    }
  },
};
