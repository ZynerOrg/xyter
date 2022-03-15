const { users } = require('../helpers/database/models');
const logger = require('../handlers/logger');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    await users
      .deleteOne({ userId: member.id, guildId: member.guild.id })
      .then(
        logger.debug(
          `Guild: ${member.guild.id} User: ${member.id} deleted successfully`
        )
      );
  },
};
