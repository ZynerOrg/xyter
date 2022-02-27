const db = require('quick.db');

const credits = new db.table('credits');
module.exports = async (interaction) => {
  const user = await interaction.options.getUser('user');
  const amount = await interaction.options.getInteger('amount');

  if (user.id === interaction.user.id) {
    const embed = {
      title: 'Gift failed',
      description: "You can't pay yourself.",
      color: 0xbb2124,
      timestamp: new Date(),
      footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
    };
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  } else if (amount <= 0) {
    const embed = {
      title: 'Gift failed',
      description: "You can't pay zero or below.",
      color: 0xbb2124,
      timestamp: new Date(),
      footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
    };
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  } else {
    if ((await credits.get(interaction.user.id)) < amount) {
      const embed = {
        title: 'Gift',
        description: `You have insufficient credits. Your balance is ${credits.get(
          interaction.user.id
        )}`,
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    } else {
      await credits.subtract(interaction.user.id, amount);
      await credits.add(user.id, amount);

      const embed = {
        title: 'Gift',
        description: `You sent ${
          amount <= 1 ? `${amount} credit` : `${amount} credits`
        } to ${user}. Your new balance is ${await credits.get(interaction.user.id)}.`,
        color: 0x22bb33,
        timestamp: new Date(),
        footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
  }
};
