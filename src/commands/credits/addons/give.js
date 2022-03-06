const { Permissions } = require('discord.js');

const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const credits = require('../../../helpers/database/models/creditSchema');
const creditNoun = require('../../../helpers/creditNoun');

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
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    const toUser = await credits.findOne({ userId: user.id, guildId: interaction.member.guild.id });

    if (!toUser) {
      const embed = {
        title: 'Give',
        description: 'That user has no credits, I can not give credits to the user',
        color: config.colors.error,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    toUser.balance += amount;
    await toUser.save();
    const embed = {
      title: 'Give',
      description: `Gave ${creditNoun(amount)} to ${user}.`,
      color: 0x22bb33,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    await logger.debug(
      `Administrator: ${interaction.user.username} gave ${
        amount <= 1 ? `${amount} credit` : `${amount} credits`
      } to ${user.username}`
    );
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  } catch (e) {
    await logger.error(e);
  }
  return true;
};
