const credits = require('../../../helpers/database/models/creditSchema');
const debug = require('../../../handlers/debug');
const saveUser = require('../../../helpers/saveUser');

module.exports = async (interaction) => {
  try {
    const user = await interaction.options.getUser('user');
    const amount = await interaction.options.getInteger('amount');
    const data = await credits.findOne({ userId: interaction.user.id });

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
      if (data.balance < amount) {
        const embed = {
          title: 'Gift',
          description: `You have insufficient credits. Your balance is ${data.balance}`,
          color: 0xbb2124,
          timestamp: new Date(),
          footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
        };
        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      } else {
        const fromUser = await credits.findOne({ userId: interaction.user.id });
        const toUser = await credits.findOne({ userId: user.id });

        fromUser.balance -= amount;
        toUser.balance += amount;

        saveUser(fromUser, toUser);

        const embed = {
          title: 'Gift',
          description: `You sent ${
            amount <= 1 ? `${amount} credit` : `${amount} credits`
          } to ${user}. Your new balance is ${fromUser.balance}.`,
          color: 0x22bb33,
          timestamp: new Date(),
          footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
        };

        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      }
    }
  } catch {
    async (err) => debug(err);
  }
};
