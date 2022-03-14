const logger = require('../handlers/logger');

const {
  users,
  guilds,
  experiences,
  credits,
  counters,
  timeouts,
} = require('../helpers/database/models');

module.exports = {
  name : 'messageCreate',
  async execute(message) {
    // Get guild object
    const guild = await guilds.findOne({guildId : message.guild.id});

    // If message author is bot
    if (message.author.bot)
      return;

    // Get counter object
    const counter = await counters.findOne({
      guildId : message.guild.id,
      channelId : message.channel.id,
    });

    // If counter for the message channel
    if (counter) {
      // If message content is not strictly the same as counter word
      if (message.content !== counter.word) {
        // Delete the message
        await message.delete();
      } else {
        // Add 1 to the counter object
        await counters.findOneAndUpdate({
          guildId : message.guild.id,
          channelId : message.channel.id,
        },
                                        {$inc : {counter : 1}});
      }
    }

    // Create user if not already created
    await users.findOne({userId : message.author.id},
                        {new : true, upsert : true});

    if (guild.credits && guild.points) {
      // If message length is below guild minimum length
      if (message.content.length < guild.credits.minimumLength)
        return;

      // Needs to be updated for multi-guild to function properly
      // if (config.credits.excludedChannels.includes(message.channel.id))
      // return;

      // Check if user has a timeout
      const isTimeout = await timeouts.findOne({
        guildId : message.guild.id,
        userId : message.author.id,
        timeoutId : 1,
      });

      // If user is not on timeout
      if (!isTimeout) {
        // Add credits to user
        await credits
            .findOneAndUpdate(
                {userId : message.author.id, guildId : message.guild.id},
                {$inc : {balance : guild.credits.rate}},
                {new : true, upsert : true})

            // If successful
            .then(async () => {
              // Send debug message
              logger.debug(`Guild: ${message.guild.id} Credits added to user: ${
                  message.author.id}`);
            })

            // If error
            .catch(async (err) => {
              // Send error message
              await logger.error(err);
            });

        // Add points to user
        await experiences
            .findOneAndUpdate(
                {userId : message.author.id, guildId : message.guild.id},
                {$inc : {points : guild.points.rate}},
                {new : true, upsert : true})

            // If successful
            .then(async () => {
              // Send debug message
              logger.debug(`Guild: ${message.guild.id} Points added to user: ${
                  message.author.id}`);
            })

            // If error
            .catch(async (err) => {
              // Send error message
              await logger.error(err);
            });

        // Create a timeout for the user
        await timeouts.create({
          guildId : message.guild.id,
          userId : message.author.id,
          timeoutId : 1,
        });

        setTimeout(async () => {
          // Send debug message
          await logger.debug(`Guild: ${message.guild.id} User: ${
              message.author.id} has not talked within last ${
              guild.credits.timeout / 1000} seconds, credits can be given`);

          // When timeout is out, remove it from the database
          await timeouts.deleteOne({
            guildId : message.guild.id,
            userId : message.author.id,
            timeoutId : 1,
          });
        }, guild.credits.timeout);
      }
    } else {
      // Send debug message
      await logger.debug(`Guild: ${message.guild.id} User: ${
          message.author.id} has talked within last ${
          guild.credits.timeout / 1000} seconds, no credits given`);
    }
  },
};
