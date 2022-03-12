const { Permissions } = require('discord.js');

const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

module.exports = async (interaction) => {
  try {
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      const embed = {
        title: 'Users failed',
        description:
          'You need to have permission to manage this guild (MANAGE_GUILD)',
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    // eslint-disable-next-line max-len
    const userList = await interaction.client.users.cache.filter(
      (user) => !user.bot
    );

    userList.map((user) => {
      logger.info(user);
    });

    // await interaction.client.guilds.cache.get(interaction.member.guild.id).then((user) => logger.info(user));

    // await interaction.client.users.fetch().then(async (user) => await logger.info(`${user}`));
    // // interaction.client.users.fetch().then((user) => {
    // //   console.log(user);
    // // }).catch(console.error);
  } catch {
    await logger.error();
  }
};
