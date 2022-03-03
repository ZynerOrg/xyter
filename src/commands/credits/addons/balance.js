const credits = require('../../../helpers/database/models/creditSchema');
const logger = require('../../../handlers/logger');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  try {
    const user = await interaction.options.getUser('user');

    await credits
      .findOne({ userId: user ? user.id : interaction.user.id })
      .then(async (data) => {
        if (!data) {
          const embed = {
            title: 'Balance',
            description: `${user} has no credits.`,
            color: process.env.SUCCESS_COLOR,
            timestamp: new Date(),
            footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
          };

          return await interaction.editReply({ embeds: [embed], ephemeral: true });
        } else {
          const { balance } = data;

          const embed = {
            title: 'Balance',
            description: `${user ? `${user} has` : 'You have'} ${creditNoun(balance)}.`,
            color: process.env.SUCCESS_COLOR,
            timestamp: new Date(),
            footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
          };
          return await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
      })
      .catch(async (err) => logger.error(err));
  } catch {
    async (err) => logger.error(err);
  }
};
