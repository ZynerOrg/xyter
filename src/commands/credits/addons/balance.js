const i18next = require('i18next');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const credits = require('../../../helpers/database/models/creditSchema');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  try {
    const user = await interaction.options.getUser('user');

    logger.debug(i18next.t('commands:credits:general:key', { count: 1 }));

    await credits
      // eslint-disable-next-line max-len
      .findOne({
        userId: user ? user.id : interaction.user.id,
        guildId: interaction.member.guild.id,
      })
      .then(async (data) => {
        if (!data) {
          const embed = {
            title: `${i18next.t('commands:credits:addons:balance:embed:title')}`,
            description: `${user} has no credits.`,
            color: config.colors.success,
            timestamp: new Date(),
            footer: { iconURL: config.footer.icon, text: config.footer.text },
          };

          return interaction.editReply({ embeds: [embed], ephemeral: true });
        }
        const { balance } = data;

        const embed = {
          title: `${i18next.t('commands:credits:addons:balance:embed:title')}`,
          description: `${user ? `${user} has` : 'You have'} ${i18next.t('commands:credits:general:credits', { count: balance })}.`,
          color: config.colors.success,
          timestamp: new Date(),
          footer: { iconURL: config.footer.icon, text: config.footer.text },
        };
        return interaction.editReply({ embeds: [embed], ephemeral: true });
      })
      .catch(async (err) => logger.error(err));
  } catch {
    await logger.error();
  }
};
