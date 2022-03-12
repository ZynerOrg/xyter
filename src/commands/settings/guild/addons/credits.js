const { Permissions } = require('discord.js');
const config = require('../../../../../config.json');
const logger = require('../../../../handlers/logger');

// Database models

const { guilds } = require('../../../../helpers/database/models');

module.exports = async (interaction) => {
  // Destructure member

  const { member } = interaction;

  // Check permission

  if (!member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
    const embed = {
      title: 'Settings',
      color: config.colors.error,
      description: 'You do not have permission to manage this!',
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Get options

  const status = await interaction.options.getBoolean('status');
  const rate = await interaction.options.getNumber('rate');
  const timeout = await interaction.options.getNumber('timeout');
  const minimumLength = await interaction.options.getNumber('minimum-length');
  const workRate = await interaction.options.getNumber('work-rate');
  const workTimeout = await interaction.options.getNumber('work-timeout');

  // Get guild object

  const guild = await guilds.findOne({ guildId: interaction.member.guild.id });

  // Modify values

  guild.credits.status = status !== null ? status : guild.credits.status;
  guild.credits.rate = rate !== null ? rate : guild.credits.rate;
  guild.credits.timeout = timeout !== null ? timeout : guild.credits.timeout;
  guild.credits.workRate =
    workRate !== null ? workRate : guild.credits.workRate;
  guild.credits.workTimeout =
    workTimeout !== null ? workTimeout : guild.credits.workTimeout;
  guild.credits.minimumLength =
    minimumLength !== null ? minimumLength : guild.credits.minimumLength;

  // Save guild

  await guild.save().then(async () => {
    // Build embed

    const embed = {
      title: 'Credits',
      description: 'Following settings is set!',
      color: config.colors.success,
      fields: [
        { name: '🤖 Status', value: `${guild.credits.status}`, inline: true },
        { name: '📈 Rate', value: `${guild.credits.rate}`, inline: true },
        {
          name: '📈 Work Rate',
          value: `${guild.credits.workRate}`,
          inline: true,
        },
        {
          name: '🔨 Minimum Length',
          value: `${guild.credits.minimumLength}`,
          inline: true,
        },
        { name: '⏰ Timeout', value: `${guild.credits.timeout}`, inline: true },
        {
          name: '⏰ Work Timeout',
          value: `${guild.credits.workTimeout}`,
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send reply

    await interaction.editReply({ embeds: [embed], ephemeral: true });

    // Send debug message

    await logger.debug(
      `Guild: ${member.guild.id} User: ${member.id} has changed credit details.`
    );
  });
};
