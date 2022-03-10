const logger = require('../handlers/logger');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    await logger.info(`Ready! Logged in as ${client.user.tag}`);
    await client.user.setPresence({
      activities: [{ type: 'WATCHING', name: `${client.guilds.cache.size} guilds` }],
      status: 'online',
    });
  },
};
