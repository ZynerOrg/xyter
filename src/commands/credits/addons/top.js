const db = require('quick.db');
const credits = new db.table('credits');
module.exports = async (interaction) => {
  const { client } = interaction;
  const all = credits.all();
  const allSorted = all.sort((a, b) => (a.data > b.data ? -1 : 1));

  const topTen = allSorted.slice(0, 10);

  const topTens = [];

  Promise.all(
    topTen.map(async (x, i) => {
      user = await client.users.fetch(`${x.ID}`, { force: true });
      topTens.push({ index: i, user: user, credits: x.data });
    })
  ).then(async () => {
    const embed = {
      title: 'Balance Top',
      description: `Below are the top ten.\n
      ${topTens
        .map(
          (x) =>
            `**Top ${x.index + 1}** - ${x.user}: ${
              x.credits <= 1 ? `${x.credits} credit` : `${x.credits} credits`
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
