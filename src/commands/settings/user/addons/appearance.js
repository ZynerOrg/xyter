const config = require('../../../../../config.json');
const logger = require('../../../../handlers/logger');

// Database models
const { users } = require('../../../../helpers/database/models');

module.exports = async (interaction) => {
  // Destructure member
  const { member } = interaction;
  const { guild } = member;

  // Get options
  const language = await interaction.options.getString('language');

  // Get user object
  const userDB = await users.findOne({ userId: member.id, guildId: guild.id });

  // Modify values
  userDB.language = language !== null ? language : userDB.language;

  // Save guild
  await userDB.save().then(async () => {
    // Create embed object
    const embed = {
      title: ':hammer: Settings - User [Appearance]',
      description: 'Following settings is set!',
      color: config.colors.success,
      fields: [
        {
          name: '🏳️‍🌈 Language',
          value: `${userDB.language}`,
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
      `Guild: ${member.guild.id} User: ${member.id} has changed appearance settings.`
    );
  });
};
