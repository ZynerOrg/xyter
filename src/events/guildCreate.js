const guilds = require('../helpers/database/models/guildSchema');

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    const { client } = guild;
    await guilds
      .findOne(
        { guildId: guild.id },
        { new: true, upsert: true },
      );
    await client.user.setPresence({ activities: [{ type: 'WATCHING', name: `${client.guilds.cache.size} guilds` }], status: 'online' });
  },
};
