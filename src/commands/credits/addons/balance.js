const db = require('quick.db');
const credits = new db.table('credits');
module.exports = async (interaction) => {
  const user = await interaction.options.getUser('user');

  const amount = await credits.get(user ? user.id : interaction.user.id);
  if (amount) {
    const embed = {
      title: 'Balance',
      description: `${user ? `${user} has` : 'You have'} ${
        amount <= 1 ? `${amount} credit` : `${amount} credits`
      }.`,
      color: 0x22bb33,
      timestamp: new Date(),
      footer: { text: 'Zyner Bot' },
    };
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  } else {
    const embed = {
      title: 'Balance',
      description: `${user} has no credits.`,
      color: 0xbb2124,
      timestamp: new Date(),
      footer: { text: 'Zyner Bot' },
    };
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  }
};
