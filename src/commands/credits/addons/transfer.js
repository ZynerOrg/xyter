const { Permissions } = require('discord.js');

const credits = require(`${__basedir}/helpers/database/models/creditSchema`);
const logger = require(`${__basedir}/handlers/logger`);
const saveUser = require(`${__basedir}/helpers/saveUser`);
const creditNoun = require(`${__basedir}/helpers/creditNoun`);

module.exports = async (interaction) => {
  try {
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      const embed = {
        title: 'Transfer failed',
        description: 'You need to have permission to manage this guild (MANAGE_GUILD)',
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    const from = await interaction.options.getUser('from');
    const to = await interaction.options.getUser('to');
    const amount = await interaction.options.getInteger('amount');
    const data = await credits.findOne({ userId: from.id });

    if (amount <= 0) {
      const embed = {
        title: 'Transfer failed',
        description: "You can't transfer zero or below.",
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { iconURL: __config.footer.icon, text: __config.footer.text },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    } else {
      if (data.balance < amount) {
        const embed = {
          title: 'Transfer',
          description: `${from.username} has insufficient credits. ${from.username} balance is ${data.balance}`,
          color: 0xbb2124,
          timestamp: new Date(),
          footer: { iconURL: __config.footer.icon, text: __config.footer.text },
        };
        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      } else {
        const fromUser = await credits.findOne({ userId: from.id });
        const toUser = await credits.findOne({ userId: to.id });

        console.log(fromUser, toUser, amount);

        fromUser.balance -= amount;
        toUser.balance += amount;

        await saveUser(fromUser, toUser);

        const embed = {
          title: 'Transfer',
          description: `You sent ${creditNoun(amount)} from ${from} to ${to}.`,
          color: 0x22bb33,
          fields: [
            { name: `${from.username} Balance`, value: `${fromUser.balance}`, inline: true },
            { name: `${to.username} Balance`, value: `${toUser.balance}`, inline: true },
          ],
          timestamp: new Date(),
          footer: { iconURL: __config.footer.icon, text: __config.footer.text },
        };

        await logger.debug(`Gift sent from: ${interaction.user.username} to: ${to.username}`);
        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      }
    }
  } catch {
    async (err) => await logger.error(err);
  }
};
