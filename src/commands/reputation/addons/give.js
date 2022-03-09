const i18next = require('i18next');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const users = require('../../../helpers/database/models/userSchema');

module.exports = async (interaction) => {
  // Destructure member

  const { member } = interaction;

  // Get options

  const target = await interaction.options.getUser('target');
  const type = await interaction.options.getString('type');

  // Do not allow self reputation

  if (target.id === interaction.member.id) {
    // Build embed

    const embed = { title: 'Reputation', description: 'You can not repute yourself' };

    // Send reply

    return interaction.editReply({ embeds: [embed] });
  }

  // Get user object

  const user = await users.findOne({ userId: interaction.member.id });

  // Math operators depending on type of reputation

  if (type === 'positive') { user.reputation += 1; }
  if (type === 'negative') { user.reputation -= 1; }

  // Save user

  await user.save();

  // Build embed

  const embed = {
    title: 'Reputation',
    description: `You have given ${target} a ${type} reputation!`,
    timestamp: new Date(),
    color: config.colors.success,
    footer: { iconURL: config.footer.icon, text: config.footer.text },
  };

  // Send reply

  await interaction.editReply({ embeds: [embed] });

  // Send debug message

  await logger.debug(`Guild: ${member.guild.id} User: ${member.id} has given ${target.id} a ${type} reputation.`);
};
