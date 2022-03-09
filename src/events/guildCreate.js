const guilds = require('../helpers/database/models/guildSchema');

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    await guilds
      .findOne(
        { guildId: guild.id },
        { new: true, upsert: true },
      );
  },
};
