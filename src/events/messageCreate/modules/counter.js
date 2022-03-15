const logger = require('../../../handlers/logger');

const {
  users,
  guilds,
  experiences,
  credits,
  counters,
  timeouts,
} = require('../../../helpers/database/models');
module.exports = async (guildDB, userDB, message) => {
  const { guild, channel, content } = message;

  // Get counter object
  const counter = await counters.findOne({
    guildId: guild.id,
    channelId: channel.id,
  });

  // If counter for the message channel
  if (counter) {
    // If message content is not strictly the same as counter word
    if (content !== counter.word) {
      // Delete the message
      await message.delete();
    } else {
      // Add 1 to the counter object
      await counters.findOneAndUpdate(
        {
          guildId: guild.id,
          channelId: channel.id,
        },
        { $inc: { counter: 1 } }
      );
    }
  }
};
