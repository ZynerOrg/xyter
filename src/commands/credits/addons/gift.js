const credits = require(`${__basedir}/helpers/database/models/creditSchema`);
const logger = require(`${__basedir}/handlers/logger`);
const saveUser = require(`${__basedir}/helpers/saveUser`);
const creditNoun = require(`${__basedir}/helpers/creditNoun`);

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
        footer: { iconURL: __config.footer.icon, text: __config.footer.text },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    } else if (amount <= 0) {
      const embed = {
        title: 'Gift failed',
        description: "You can't pay zero or below.",
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { iconURL: __config.footer.icon, text: __config.footer.text },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    } else {
      if (data.balance < amount) {
        const embed = {
          title: 'Gift',
          description: `You have insufficient credits. Your balance is ${data.balance}`,
          color: 0xbb2124,
          timestamp: new Date(),
          footer: { iconURL: __config.footer.icon, text: __config.footer.text },
        };
        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      } else {
        const fromUser = await credits.findOne({ userId: interaction.user.id });
        const toUser = await credits.findOne({ userId: user.id });

        fromUser.balance -= amount;
        toUser.balance += amount;

        await saveUser(fromUser, toUser);

        const embed = {
          title: 'Gift',
          description: `You sent ${creditNoun(amount)} to ${user}. Your new balance is ${creditNoun(
            fromUser.balance
          )}.`,
          color: 0x22bb33,
          timestamp: new Date(),
          footer: { iconURL: __config.footer.icon, text: __config.footer.text },
        };
        await logger.debug(`Gift sent from: ${interaction.user.username} to: ${user.username}`);
        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      }
    }
  } catch {
    async (err) => await logger.error(err);
  }
};
