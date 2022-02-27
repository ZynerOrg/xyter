const { Permissions } = require('discord.js');

const credits = require('../../../helpers/database/models/creditSchema');
const debug = require('../../../handlers/debug');
module.exports = async (interaction) => {
  try {
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      const embed = {
        title: 'Give failed',
        description: 'You need to have permission to manage this guild (MANAGE_GUILD)',
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    const user = await interaction.options.getUser('user');
    const amount = await interaction.options.getInteger('amount');

    if (amount <= 0) {
      const embed = {
        title: 'Give',
        description: "You can't give zero or below.",
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    } else {
      const toUser = await credits.findOne({ userId: user.id });
      toUser.balance += amount;
      toUser.save();
      const embed = {
        title: 'Give',
        description: `Gave ${amount <= 1 ? `${amount} credit` : `${amount} credits`} to ${user}.`,
        color: 0x22bb33,
        timestamp: new Date(),
        footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
  } catch {
    async (err) => debug(err);
  }
};
