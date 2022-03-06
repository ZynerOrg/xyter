const { Permissions } = require('discord.js');

const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const credits = require('../../../helpers/database/models/creditSchema');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
    const embed = {
      title: 'Set',
      description: 'You need to have permission to manage this guild (MANAGE_GUILD)',
      color: 0xbb2124,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }
  const user = await interaction.options.getUser('user');
  const amount = await interaction.options.getInteger('amount');

  const toUser = await credits.findOne({ userId: user.id, guildId: interaction.member.guild.id });

  if (!toUser) {
    const embed = {
      title: 'Set',
      description: 'That user has no credits, I can not set credits to the user',
      color: config.colors.error,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }
  toUser.balance = amount;
  await toUser.save();

  const embed = {
    title: 'Set',
    description: `You set ${creditNoun(amount)} on ${user}.`,
    color: 0x22bb33,
    timestamp: new Date(),
    footer: { iconURL: config.footer.icon, text: config.footer.text },
  };
  await logger.debug(
    `Administrator: ${interaction.user.username} set ${
      amount <= 1 ? `${amount} credit` : `${amount} credits`
    } on ${user.username}`,
  );
  return interaction.editReply({ embeds: [embed], ephemeral: true });
};
