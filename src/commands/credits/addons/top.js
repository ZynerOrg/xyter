const credits = require(`${__basedir}/helpers/database/models/creditSchema`);
const creditNoun = require(`${__basedir}/helpers/creditNoun`);

module.exports = async (interaction) => {
  await credits.find().then(async (data) => {
    const topTen = data.sort((a, b) => (a.balance > b.balance ? -1 : 1)).slice(0, 10);

    const item = (x, index) => `**Top ${index + 1}** - <@${x.userId}> ${creditNoun(x.balance)}`;

    const embed = {
      title: 'Balance Top',
      description: `Below are the top ten.\n${topTen.map((x, index) => item(x, index)).join('\n')}`,
      color: 0x22bb33,
      timestamp: new Date(),
      footer: { iconURL: __config.footer.icon, text: __config.footer.text },
    };
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  });
};
