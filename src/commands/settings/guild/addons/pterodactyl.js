const { Permissions } = require('discord.js');
const config = require('../../../../../config.json');
const logger = require('../../../../handlers/logger');

// Database models

const { apis } = require('../../../../helpers/database/models');

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

  const url = await interaction.options.getString('url');
  const token = await interaction.options.getString('token');

  // Update API credentials

  await apis
    .findOneAndUpdate({ guildId: member.guild.id }, { url, token }, { new: true, upsert: true })
    .then(async () => {
      // Build embed

      const embed = {
        title: 'Settings',
        color: config.colors.success,
        description: 'Pterodactyl settings is saved!',
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send reply

      await interaction.editReply({ embeds: [embed], ephemeral: true });

      // Send debug message

      await logger.debug(
        `Guild: ${member.guild.id} User: ${member.id} has changed api credentials.`
      );
    });
};
