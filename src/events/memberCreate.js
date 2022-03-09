const logger = require('../handlers/logger');

const users = require('../helpers/database/models/userSchema');

module.exports = {
  name: 'interactionCreate',
  async execute(user) {
    // const guildExist = await guilds
    //   .findOne({ guildId: guild.id })
    //   .then(logger.debug(`Found guild: ${guild.id}`))
    //   .catch(logger.error);

    // if (!guildExist) {
    //   await guilds
    //     .create({ guildId: guild.id })
    //     .then(() => logger.debug(`Create guild: ${guild.id} was success`))
    //     .catch((e) => logger.error(e));
    // }
  },
};
