const credits = require('../../../helpers/database/models/creditSchema');
const debug = require('../../../handlers/debug');
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
            description: `${user ? `${user} has` : 'You have'} ${
              balance <= 1 ? `${balance} credit` : `${balance} credits`
            }.`,
            color: process.env.SUCCESS_COLOR,
            timestamp: new Date(),
            footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
          };

          return await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
      })
      .catch(async (err) => debug(err));
  } catch {
    async (err) => debug(err);
  }
};
