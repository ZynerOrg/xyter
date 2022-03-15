const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { users } = require('../../../helpers/database/models');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  // Get options
  const user = await interaction.options.getUser('user');

  // Get credit object
  const userDB = await users.findOne({
    userId: user ? user.id : interaction.user.id,
    guildId: interaction.member.guild.id,
  });

  // Destructure balance
  const { credits } = userDB;

  // If !userDB
  if (!userDB) {
    // Create embed object
    const embed = {
      title: ':dollar: Credits - Balance',
      description: `${
        user ? `${user} is` : 'You are'
      } not found in the database.`,
      color: config.colors.error,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // If !credits
  if (!credits) {
    // Create embed object
    const embed = {
      title: ':dollar: Credits - Balance',
      description: `${user ? `${user} has` : 'You have'} no credits.`,
      color: config.colors.success,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // If credits
  if (credits) {
    // Create embed object
    const embed = {
      title: ':dollar: Credits - Balance',
      description: `${user ? `${user} has` : 'You have'} ${creditNoun(
        credits
      )}.`,
      color: config.colors.success,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }
};
