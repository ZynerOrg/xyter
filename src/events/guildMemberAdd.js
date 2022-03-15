const { users } = require('../helpers/database/models');
const logger = require('../handlers/logger');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    await users
      .create({ userId: member.id, guildId: member.guild.id })
      .then(
        logger.debug(
          `Guild: ${member.guild.id} User: ${member.id} created successfully`
        )
      );
  },
};
