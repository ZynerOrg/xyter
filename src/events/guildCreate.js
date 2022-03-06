const logger = require('../handlers/logger');

const guilds = require('../helpers/database/models/guildSchema');

module.exports = {
  name : 'interactionCreate',
  async execute(guild) {
    const guildExist = await guilds.findOne({guildId : guild.id})
                           .then(logger.debug(`Found guild: ${guild.id}`))
                           .catch(logger.error);

    if (!guildExist) {
      await guilds.create({guildId : guild.id})
          .then(() => logger.debug(`Create guild: ${guild.id} was success`))
          .catch((e) => logger.error(e));
    }
  },
};
