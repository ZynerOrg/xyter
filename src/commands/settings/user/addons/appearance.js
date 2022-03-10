const { Permissions } = require('discord.js');
const config = require('../../../../../config.json');
const logger = require('../../../../handlers/logger');

// Database models

const { users } = require('../../../../helpers/database/models');

module.exports = async (interaction) => {
  // Destructure member

  const { member } = interaction;

  // Get options

  const language = await interaction.options.getString('language');

  // Get user object

  const user = await users.findOne({ userId: interaction.member.id });

  // Modify values

  user.language = language !== null ? language : user.language;

  // Save guild

  await user.save().then(async () => {
    // Build embed

    const embed = {
      title: 'Appearance',
      description: 'Following settings is set!',
      color: config.colors.success,
      fields: [
        {
          name: '🏳️‍🌈 Language',
          value: `${user.language}`,
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
      `Guild: ${member.guild.id} User: ${member.id} has changed appearance settings.`
    );
  });
};
