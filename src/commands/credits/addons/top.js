const credits = require('../../../helpers/database/models/creditSchema');
const debug = require('../../../handlers/debug');
module.exports = async (interaction) => {
  await credits.find().then(async (data) => {
    const sorted = data.sort((a, b) => (a.balance > b.balance ? -1 : 1));
    const topTen = sorted.slice(0, 10);

    const embed = {
      title: 'Balance Top',
      description: `Below are the top ten.\n${topTen
        .map(
          (x, index) =>
            `**Top ${index + 1}** - <@${x.userId}> ${
              x.balance <= 1 ? `${x.balance} credit` : `${x.balance} credits`
            }`
        )
        .join('\n')}`,
      color: 0x22bb33,
      timestamp: new Date(),
      footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
    };
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  });
};
