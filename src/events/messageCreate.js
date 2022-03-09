const config = require('../../config.json');
const logger = require('../handlers/logger');

const users = require('../helpers/database/models/userSchema');
const guilds = require('../helpers/database/models/guildSchema');
const experiences = require('../helpers/database/models/experienceSchema');
const credits = require('../helpers/database/models/creditSchema');
const timeouts = require('../helpers/database/models/timeoutSchema');

const talkedRecently = new Set();

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    const guild = await guilds.findOne({ guildId: message.guild.id });

    if (message.author.bot) return;

    const userExist = await users.findOne({ userId: message.author.id });

    if (!userExist) { await users.create({ userId: message.author.id }); }

    if (message.content.length < guild.credits.minimumLength) return;
    if (config.credits.excludedChannels.includes(message.channel.id)) return;

    const isTimeout = await timeouts.findOne(
      {
        guildId: message.guild.id,
        userId: message.author.id,
        timeoutId: 1,
      },
    );

    if (!isTimeout) {
      await credits
        .findOneAndUpdate(
          { userId: message.author.id, guildId: message.guild.id },
          { $inc: { balance: guild.credits.rate } },
          { new: true, upsert: true },
        )
        .then(async () => logger.debug(`Credits added to user: ${message.author.id}`))
        .catch(async (err) => {
          await logger.error(err);
        });

      // Experience System
      await experiences
        .findOneAndUpdate(
          { userId: message.author.id, guildId: message.guild.id },
          { $inc: { points: guild.points.rate } },
          { new: true, upsert: true },
        )
        .then(async () => logger.debug(`Credits added to user: ${message.author.id}`))
        .catch(async (err) => {
          await logger.error(err);
        });

      await timeouts.create(
        {
          guildId: message.guild.id,
          userId: message.author.id,
          timeoutId: 1,
        },
      );

      // talkedRecently.add(message.author.id);
      setTimeout(async () => {
        await logger.debug(
          `User: ${message.author.id} has not talked within last ${
            guild.credits.timeout / 1000
          } seconds, credits can be given`,
        );
        await timeouts.deleteOne({
          guildId: message.guild.id,
          userId: message.author.id,
          timeoutId: 1,
        });
        // talkedRecently.delete(message.author.id);
      }, guild.credits.timeout);
    } else {
      await logger.debug(
        `User: ${message.author.id} has talked within last ${
          guild.credits.timeout / 1000
        } seconds, no credits given`,
      );
    }
  },
};
