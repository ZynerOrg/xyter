const i18next = require('i18next');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { users, timeouts } = require('../../../helpers/database/models');

module.exports = async (interaction) => {
  // Destructure member
  const { member } = interaction;
  const { guild } = member;

  // Get options
  const target = await interaction.options.getUser('target');
  const type = await interaction.options.getString('type');

  // Get user object
  const userDB = await users.findOne({
    userId: member.id,
    guildId: guild.id,
  });

  // Check if user has a timeout
  const isTimeout = await timeouts.findOne({
    guildId: guild.id,
    userId: member.id,
    timeoutId: 2,
  });

  // If user is not on timeout
  if (!isTimeout) {
    // Do not allow self reputation
    if (target.id === interaction.member.id) {
      // Create embed object
      const embed = {
        title: ':loudspeaker: Reputation - Give',
        description: 'You can not repute yourself.',
        timestamp: new Date(),
        color: config.colors.error,
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return interaction.editReply({ embeds: [embed] });
    }

    // If type is positive
    if (type === 'positive') {
      userDB.reputation += 1;
    }

    // If type is negative
    if (type === 'negative') {
      userDB.reputation -= 1;
    }

    // Save user
    await userDB.save().then(async () => {
      // Create embed object
      const embed = {
        title: ':loudspeaker: Reputation - Give',
        description: `You have given ${target} a ${type} reputation!`,
        timestamp: new Date(),
        color: config.colors.success,
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      await interaction.editReply({ embeds: [embed] });

      // Send debug message
      await logger.debug(
        `Guild: ${member.guild.id} User: ${member.id} has given ${target.id} a ${type} reputation.`
      );

      // Create a timeout for the user
      await timeouts.create({
        guildId: member.guild.id,
        userId: member.id,
        timeoutId: 2,
      });
    });

    setTimeout(async () => {
      // send debug message
      await logger.debug(
        `Guild: ${member.guild.id} User: ${
          member.id
        } has not repute within last ${
          config.reputation.timeout / 1000
        } seconds, reputation can be given`
      );

      // When timeout is out, remove it from the database
      await timeouts.deleteOne({
        guildId: member.guild.id,
        userId: member.id,
        timeoutId: 2,
      });
    }, config.reputation.timeout);
  } else {
    // Create embed object
    const embed = {
      title: ':loudspeaker: Reputation - Give',
      description: `You have given reputation within the last ${
        config.reputation.timeout / 1000
      } seconds, you can not repute now!`,
      timestamp: new Date(),
      color: config.colors.error,
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    await interaction.editReply({ embeds: [embed] });

    // Send debug message
    await logger.debug(
      `Guild: ${member.guild.id} User: ${member.id} has repute within last ${
        config.reputation.timeout / 1000
      } seconds, no reputation can be given`
    );
  }
};
