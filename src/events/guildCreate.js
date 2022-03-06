const config = require('../../config.json');
const logger = require('../handlers/logger');

const guilds = require('../helpers/database/models/guildSchema');

module.exports = {
  name: 'interactionCreate',
  async execute(guild) {
    const guildExist = await guilds.findOne({ guildId: guild.id });

    if (!guildExist) { await guilds.create({ guildId: guild.id }); }
  },
};
