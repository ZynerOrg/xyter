const i18next = require('i18next');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { users, timeouts } = require('../../../helpers/database/models');

module.exports = async (interaction) => {
  // Destructure member

  const { member } = interaction;

  // Get options

  const target = await interaction.options.getUser('target');
  const type = await interaction.options.getString('type');

  // Get user object

  const user = await users.findOne({ userId: interaction.member.id });

  // Check if user has a timeout

  const isTimeout = await timeouts.findOne({
    guildId: member.guild.id,
    userId: member.id,
    timeoutId: 2,
  });

  // If user is not on timeout

  if (!isTimeout) {
    // Do not allow self reputation

    if (target.id === interaction.member.id) {
      // Build embed

      const embed = {
        title: i18next.t('commands:reputation:addons:give:version03:embed:title', {
          lng: await user.language,
        }),
        description: i18next.t('commands:reputation:addons:give:version02:embed:title', {
          lng: await user.language,
        }),
      };

      // Send reply

      return interaction.editReply({ embeds: [embed] });
    }

    // Math operators depending on type of reputation

    if (type === 'positive') {
      user.reputation += 1;
    }
    if (type === 'negative') {
      user.reputation -= 1;
    }

    // Save user

    await user.save();

    // Build embed

    const embed = {
      title: i18next.t('commands:reputation:addons:give:version02:embed:title', {
        lng: await user.language,
      }),
      description: i18next.t('commands:reputation:addons:give:version02:embed:description', {
        lng: await user.language,
        user: target,
        type,
      }),
      timestamp: new Date(),
      color: config.colors.success,
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send reply

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

    setTimeout(async () => {
      await logger.debug(
        `Guild: ${member.guild.id} User: ${member.id} has not repute within last day, reputation can be given`
      );

      // When timeout is out, remove it from the database

      await timeouts.deleteOne({
        guildId: member.guild.id,
        userId: member.id,
        timeoutId: 2,
      });
    }, 86400000);
  } else {
    const embed = {
      title: i18next.t('commands:reputation:addons:give:version01:embed:title', {
        lng: await user.language,
      }),
      description: i18next.t('commands:reputation:addons:give:version01:embed:description', {
        lng: await user.language,
      }),
      timestamp: new Date(),
      color: config.colors.error,
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    await interaction.editReply({ embeds: [embed] });

    await logger.debug(
      `Guild: ${member.guild.id} User: ${member.id} has repute within last day, no reputation can be given`
    );
  }
};
