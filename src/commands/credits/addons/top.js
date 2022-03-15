const config = require('../../../../config.json');
const { users } = require('../../../helpers/database/models');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  // Get all users in the guild

  const usersDB = await users.find({ guildId: interaction.member.guild.id });

  const topTen = usersDB

    // Sort them after credits amount (ascending)
    .sort((a, b) => (a.credits > b.credits ? -1 : 1))

    // Return the top 10
    .slice(0, 10);

  // Create entry object
  const entry = (x, index) =>
    `**Top ${index + 1}** - <@${x.userId}> ${creditNoun(x.credits)}`;

  // Create embed object
  const embed = {
    title: ':dollar: Credits - Top',
    description: `Below are the top ten.\n${topTen
      .map((x, index) => entry(x, index))
      .join('\n')}`,
    color: 0x22bb33,
    timestamp: new Date(),
    footer: { iconURL: config.footer.icon, text: config.footer.text },
  };

  // Send interaction reply
  return interaction.editReply({ embeds: [embed], ephemeral: true });
};
