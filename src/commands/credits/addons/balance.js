const credits = require(`${__basedir}/helpers/database/models/creditSchema`);
const logger = require(`${__basedir}/handlers/logger`);
const creditNoun = require(`${__basedir}/helpers/creditNoun`);

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
            color: __config.colors.success,
            timestamp: new Date(),
            footer: { iconURL: __config.footer.icon, text: __config.footer.text },
          };

          return await interaction.editReply({ embeds: [embed], ephemeral: true });
        } else {
          const { balance } = data;

          const embed = {
            title: 'Balance',
            description: `${user ? `${user} has` : 'You have'} ${creditNoun(balance)}.`,
            color: __config.colors.success,
            timestamp: new Date(),
            footer: { iconURL: __config.footer.icon, text: __config.footer.text },
          };
          return await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
      })
      .catch(async (err) => logger.error(err));
  } catch {
    async (err) => logger.error(err);
  }
};
