const config = require('../../../../config.json');
const credits = require('../../../helpers/database/models/creditSchema');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  await credits
    .find({ guildId: interaction.member.guild.id })
    .then(async (data) => {
      const topTen = data
        .sort((a, b) => (a.balance > b.balance ? -1 : 1))
        .slice(0, 10);

      const item = (x, index) =>
        `**Top ${index + 1}** - <@${x.userId}> ${creditNoun(x.balance)}`;

      const embed = {
        title: 'Balance Top',
        description: `Below are the top ten.\n${topTen
          .map((x, index) => item(x, index))
          .join('\n')}`,
        color: 0x22bb33,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    });
};
