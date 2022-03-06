const { Permissions } = require('discord.js');

const credits = require(`${__basedir}/helpers/database/models/creditSchema`);
const logger = require(`${__basedir}/handlers/logger`);
const creditNoun = require(`${__basedir}/helpers/creditNoun`);

module.exports = async (interaction) => {
  if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
    const embed = {
      title: 'Set',
      description: 'You need to have permission to manage this guild (MANAGE_GUILD)',
      color: 0xbb2124,
      timestamp: new Date(),
      footer: { iconURL: __config.footer.icon, text: __config.footer.text },
    };
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  }
  const user = await interaction.options.getUser('user');
  const amount = await interaction.options.getInteger('amount');

  const toUser = await credits.findOne({ userId: user.id });
  toUser.balance = amount;
  await toUser.save();

  const embed = {
    title: 'Set',
    description: `You set ${creditNoun(amount)} on ${user}.`,
    color: 0x22bb33,
    timestamp: new Date(),
    footer: { iconURL: __config.footer.icon, text: __config.footer.text },
  };
  await logger.debug(
    `Administrator: ${interaction.user.username} set ${
      amount <= 1 ? `${amount} credit` : `${amount} credits`
    } on ${user.username}`
  );
  return await interaction.editReply({ embeds: [embed], ephemeral: true });
};
