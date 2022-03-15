// TODO This file will make sure that all guilds always has at least one entry in all collections with "guildId"

const { users, experiences, credits } = require('./database/models');
const logger = require('../handlers/logger');

module.exports = async (user, guild) => {
  const userData = await users.findOne({ userId: user.id, guildId: guild.id });
  if (!userData) {
    users.create({ userId: user.id, guildId: guild.id });
    logger.debug(`User: ${user.id} added user collection`);
  } else {
    logger.debug(`User: ${user.id} already in user collection`);
  }

  if (guild) {
    const credit = await credits.findOne({
      userId: user.id,
      guildId: guild.id,
    });
    if (!credit) {
      await credits.create({ userId: user.id, guildId: guild.id });
      await logger.debug(
        `Guild: ${guild.id} User: ${user.id} added credit collection`
      );
    } else {
      await logger.debug(
        `Guild: ${guild.id} User: ${user.id} already in credit collection`
      );
    }

    const experience = await experiences.findOne({
      userId: user.id,
      guildId: guild.id,
    });
    if (!experience) {
      await experiences.create({ userId: user.id, guildId: guild.id });
      await logger.debug(
        `Guild: ${guild.id} User: ${user.id} added experience collection`
      );
    } else {
      await logger.debug(
        `Guild: ${guild.id} User: ${user.id} already in experience collection`
      );
    }
  }

  // const guilds = client.guilds.cache;
  // await guilds.map(async (guild) => {
  //   await guild.members.fetch().then(async (members) => {
  //     await members.forEach(async (member) => {
  //       const { user } = member;
  //       dbMemberFix(user, guild);
  //     });
  //   });
  //   await dbGuildFix(guild);
  // });
};
