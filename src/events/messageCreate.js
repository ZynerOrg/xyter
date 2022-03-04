const logger = require(`${__basedir}/handlers/logger`);

const credits = require(`${__basedir}/helpers/database/models/creditSchema`);

const talkedRecently = new Set();

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;
    if (message.content.length < __config.credits.minimumLength) return;

    if (!talkedRecently.has(message.author.id)) {
      await credits
        .findOneAndUpdate(
          { userId: message.author.id },
          { $inc: { balance: __config.credits.rate } },
          { new: true, upsert: true }
        )
        .then(async () => await logger.debug(`Credits added to user: ${message.author.id}`))
        .catch(async (err) => {
          await logger.error(err);
        });
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        logger.debug(
          `User: ${message.author.id} has not talked within last ${
            __config.credits.timeout / 1000
          } seconds, credits can be given`
        );
        talkedRecently.delete(message.author.id);
      }, __config.credits.timeout);
    } else {
      logger.debug(
        `User: ${message.author.id} has talked within last ${
          __config.credits.timeout / 1000
        } seconds, no credits given`
      );
    }
  },
};
