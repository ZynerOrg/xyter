const config = require('../../config.json');
const logger = require('../handlers/logger');

const credits = require('../helpers/database/models/creditSchema');

const talkedRecently = new Set();

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;
    if (message.content.length < config.credits.minimumLength) return;
    if (config.credits.excludedChannels.includes(message.channel.id)) return;
    if (!talkedRecently.has(message.author.id)) {
      await credits
        .findOneAndUpdate(
          { userId: message.author.id },
          { $inc: { balance: config.credits.rate } },
          { new: true, upsert: true },
        )
        .then(async () => logger.debug(`Credits added to user: ${message.author.id}`))
        .catch(async (err) => {
          await logger.error(err);
        });
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        logger.debug(
          `User: ${message.author.id} has not talked within last ${
            config.credits.timeout / 1000
          } seconds, credits can be given`,
        );
        talkedRecently.delete(message.author.id);
      }, config.credits.timeout);
    } else {
      logger.debug(
        `User: ${message.author.id} has talked within last ${
          config.credits.timeout / 1000
        } seconds, no credits given`,
      );
    }
  },
};
