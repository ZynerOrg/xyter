const { Permissions } = require('discord.js');
const config = require('../../../../../config.json');
const logger = require('../../../../handlers/logger');

// Database models
const { guilds } = require('../../../../helpers/database/models');

module.exports = async (interaction) => {
  // Destructure member
  const { member } = interaction;
  const { guild } = member;

  // Check permission
  if (!member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: ':hammer: Settings - Guild [Points]',
      color: config.colors.error,
      description: `You don't have permission to manage this!`,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Get options
  const status = await interaction.options.getBoolean('status');
  const rate = await interaction.options.getNumber('rate');
  const timeout = await interaction.options.getNumber('timeout');
  const minimumLength = await interaction.options.getNumber('minimum-length');

  // Get guild object
  const guildDB = await guilds.findOne({
    guildId: guild.id,
  });

  // Modify values
  guildDB.credits.status = status !== null ? status : guildDB.credits.status;
  guildDB.credits.rate = rate !== null ? rate : guildDB.credits.rate;
  guildDB.credits.timeout =
    timeout !== null ? timeout : guildDB.credits.timeout;
  guildDB.credits.minimumLength =
    minimumLength !== null ? minimumLength : guildDB.credits.minimumLength;

  // Save guild
  await guildDB.save().then(async () => {
    // Create embed object
    const embed = {
      title: ':hammer: Settings - Guild [Points]',
      description: 'Following settings is set!',
      color: config.colors.success,
      fields: [
        { name: '🤖 Status', value: `${guildDB.credits.status}`, inline: true },
        { name: '📈 Rate', value: `${guildDB.credits.rate}`, inline: true },
        {
          name: '🔨 Minimum Length',
          value: `${guildDB.credits.minimumLength}`,
          inline: true,
        },
        {
          name: '⏰ Timeout',
          value: `${guildDB.credits.timeout}`,
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    await interaction.editReply({ embeds: [embed], ephemeral: true });

    // Send debug message
    await logger.debug(
      `Guild: ${guild.id} User: ${member.id} has changed credit details.`
    );
  });
};
