const logger = require('../handlers/logger');
const config = require('../../config.json');

const { deployCommands, dbGuildFix, dbMemberFix } = require('../helpers');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    // Send info message
    await logger.info(`Ready! Logged in as ${client.user.tag}`);

    // Set client status
    await client.user.setPresence({
      activities: [
        { type: 'WATCHING', name: `${client.guilds.cache.size} guilds` },
      ],
      status: 'online',
    });

    if (config.importToDB) {
      const guilds = client.guilds.cache;
      await guilds.map(async (guild) => {
        await guild.members.fetch().then(async (members) => {
          await members.forEach(async (member) => {
            const { user } = member;
            dbMemberFix(user, guild);
          });
        });
        await dbGuildFix(guild);
      });
    }

    await deployCommands();
  },
};
